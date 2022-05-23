//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";


contract NFTMarketplace is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _marketItemId;
    Counters.Counter private _itemsSold;

    uint256 nftySecondaryFee = 5;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    mapping(uint256 => uint256) private artworkIdToMarketItemId;

    struct MarketItem {
      uint256 tokenId;
      uint256 marketItemId;
      address payable seller;
      address payable owner;
      address payable publisher;
      address payable publisherTwo;
      uint256 price;
      uint256 royalty;
      bool sold;
      bool bred;
      bool isNftyLoop;
    }

    event MarketItemCreated (
      uint256 indexed tokenId,
      uint256 indexed marketItemId,
      address seller,
      address owner,
      address publisher,
      address publisherTwo,
      uint256 price,
      uint256 royalty,
      bool sold,
      bool bred,
      bool isNftyLoop
    );


    event received(address, uint256);



    constructor() ERC721("NftyTunes Tokens", "NFTY") {
      owner = payable(msg.sender);
    }





    function createOwnedToken(
      address galleryAddress, 
      string memory tokenUri, 
      uint256 price, 
      uint256 artworkId, 
      uint256 royaltyValue, 
      address signer, 
      address buyer
      ) public payable returns (uint) {
      require(msg.sender == galleryAddress, "Only the controller can access this function");
      _marketItemId.increment();
      uint256 newMarketItemId = _marketItemId.current();
      
      _mint(signer, newMarketItemId);
      _setTokenURI(newMarketItemId, tokenUri);

      artworkIdToMarketItemId[artworkId] = newMarketItemId;

      createOwnedItem(newMarketItemId, price, royaltyValue, signer, buyer, galleryAddress);

      return newMarketItemId;
    }

    function createOwnedItem(
      uint256 tokenId,
      uint256 price,
      uint256 royaltyValue, 
      address signer,
      address buyer,
      address galleryAddress
    ) public payable nonReentrant {
      require(price > 0, "Price must be at least 1 wei");

      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        tokenId,
        payable(signer),
        payable(buyer),
        payable(signer),
        payable(signer),
        price,
        royaltyValue,
        true,
        false,
        true
      );

      _transfer(signer, buyer, tokenId);
      emit MarketItemCreated(
        tokenId,
        tokenId,
        address(signer),
        address(buyer),
        address(signer),
        address(signer),
        price,
        royaltyValue,
        true,
        false,
        true
      );
    }




    

    function createMarketItem(
      uint256 tokenId,
      uint256 price,
      uint256 royaltyValue,
      address nftContract
    ) public payable nonReentrant {
      require(price > 0, "Price must be at least 1 wei");

      _marketItemId.increment();
      uint256 newMarketItemId = _marketItemId.current();

      idToMarketItem[newMarketItemId] =  MarketItem(
        tokenId,
        newMarketItemId,
        payable(msg.sender),
        payable(address(this)),
        payable(msg.sender),
        payable(address(this)),
        price,
        royaltyValue,
        false,
        false,
        false
      );

      setApprovalForAll(address(this), true);
      IERC721(nftContract).transferFrom(
         msg.sender,
         address(this),
         tokenId
      );

      emit MarketItemCreated(
        tokenId,
        newMarketItemId,
        msg.sender,
        address(this),
        address(msg.sender),
        address(this),
        price,
        royaltyValue,
        false,
        false,
        false
      );
    }




    function createBredToken(uint256 tokenIdOne, uint256 tokenIdTwo, string memory bredTokenUri) public payable returns (uint) {

      require(idToMarketItem[tokenIdOne].owner == msg.sender, "Only item 1 owner can perform this operation");
      require(idToMarketItem[tokenIdTwo].owner == msg.sender, "Only item 2 owner can perform this operation");
      _marketItemId.increment();
      uint256 newMarketItemId = _marketItemId.current();
      uint256 price = 0 ether;
      _mint(msg.sender, newMarketItemId);
      _setTokenURI(newMarketItemId, bredTokenUri);

      uint256 bredRoyaltyValue = (idToMarketItem[tokenIdOne].royalty + idToMarketItem[tokenIdTwo].royalty) / 2;

      createBredItem(newMarketItemId, price, bredRoyaltyValue, tokenIdOne, tokenIdTwo);

      return newMarketItemId;

    }

    function createBredItem(
      uint256 tokenId,
      uint256 price,
      uint256 royaltyValue,
      uint256 tokenIdOne,
      uint256 tokenIdTwo
    ) public payable nonReentrant {
      require(price > 0, "Price must be at least 1 wei");

      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        tokenId,
        payable(msg.sender),
        payable(msg.sender),
        payable(idToMarketItem[tokenIdOne].publisher),
        payable(idToMarketItem[tokenIdTwo].publisher),
        price,
        royaltyValue,
        true,
        true,
        true
      );

      emit MarketItemCreated(
        tokenId,
        tokenId,
        address(msg.sender),
        address(msg.sender),
        address(idToMarketItem[tokenIdOne].publisher),
        address(idToMarketItem[tokenIdTwo].publisher),
        price,
        royaltyValue,
        true,
        true,
        true
      );
      
    }






    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
      require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = price;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this));
      _itemsSold.decrement();
      setApprovalForAll(address(this), true);
      _transfer(msg.sender, address(this), tokenId);
    }

    /* allows someone to delist a token they have listed */

    function delistToken(uint256 tokenId) public payable {
      require(idToMarketItem[tokenId].seller == msg.sender, "Only item seller can perform this operation");

      idToMarketItem[tokenId].sold = true;

      idToMarketItem[tokenId].seller = payable(address(this));
      idToMarketItem[tokenId].owner = payable(msg.sender);
      _itemsSold.increment();

      _transfer(address(this), msg.sender, tokenId);
    }






    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) public payable {

      require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      uint price = idToMarketItem[tokenId].price;
      uint nftyFee = (msg.value * nftySecondaryFee) / 100;
      if (idToMarketItem[tokenId].bred == false) {
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        uint artistFee = (msg.value * idToMarketItem[tokenId].royalty) / 100;
        address seller = idToMarketItem[tokenId].seller;
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
        payable(idToMarketItem[tokenId].publisher).transfer(artistFee);
        payable(address(this)).transfer(nftyFee);
        payable(seller).transfer(msg.value-artistFee);
      }
      else {
        uint price = idToMarketItem[tokenId].price;
        uint artistFeeOne = ((msg.value * idToMarketItem[tokenId].royalty) / 100) / 2;
        uint artistFeeTwo = ((msg.value * idToMarketItem[tokenId].royalty) / 100) / 2;
        uint nftyFee = (msg.value * nftySecondaryFee) / 100;
        address seller = idToMarketItem[tokenId].seller;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
        payable(idToMarketItem[tokenId].publisher).transfer(artistFeeOne);
        payable(idToMarketItem[tokenId].publisherTwo).transfer(artistFeeTwo);
        payable(address(this)).transfer(nftyFee);
        payable(seller).transfer(msg.value-artistFeeOne-artistFeeTwo-nftyFee);
          
      }
    }  






    /* FETCH ITEMS FUNCTIONS */

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _marketItemId.current();
      uint unsoldItemCount = _marketItemId.current() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _marketItemId.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    receive() external payable {
        emit received(msg.sender, msg.value);
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _marketItemId.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }


}





import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "hardhat/console.sol";


contract LazyFactory is
    ERC721URIStorage,
    EIP712,
    AccessControl,
    ReentrancyGuard
{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    address payable theMarketPlace;
    address payable theArtist;
    uint256 nftyFee = 7;
    string private constant SIGNING_DOMAIN_NAME = "NFTY";
    string private constant SIGNING_DOMAIN_VERSION = "1";
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
    bytes32 constant VOUCHER_TYPEHASH =
        keccak256(
            "Voucher(uint256 artworkId,string title,uint256 priceWei,string tokenUri,string content,uint256 royalty)"
        );

    mapping(address => uint256) private balanceByAddress;


    struct Voucher {
        uint256 artworkId;
        string title;
        uint256 priceWei;
        string tokenUri;
        string content;
        uint256 royalty;
        bytes signature;
    }

    event RedeemedAndMinted(uint256 indexed tokenId);

    

    constructor(
        address payable marketplaceAddress,
        string memory name,
        string memory symbol,
        address payable artist
    ) ERC721("NftyTunes Tokens", "NFTY") EIP712(SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION) {
        _setupRole(SIGNER_ROLE, artist);
        theMarketPlace = marketplaceAddress;
        theArtist = artist;
    }

    function redeem(
        address buyer,
        Voucher calldata voucher,
        address signer
    ) public payable nonReentrant {
        address artist = signer;
        require(msg.value == voucher.priceWei, "Enter the correct price");
        require(artist != buyer, "You can not purchase your own token");
        require(hasRole(SIGNER_ROLE, artist), "Invalid Signature");

        // _mint(artist, voucher.artworkId);
        // _setTokenURI(voucher.artworkId, voucher.tokenUri);
        setApprovalForAll(theMarketPlace, true); // sender approves Market Place to transfer tokens
        // transfer the token to the buyer
        // _transfer(artist, buyer, voucher.artworkId);

        NFTMarketplace nftMarketplace = NFTMarketplace(theMarketPlace);

        uint256 amount = msg.value;
        nftMarketplace.createOwnedToken(address(this), voucher.tokenUri, amount, voucher.artworkId, voucher.royalty, signer, msg.sender);

        payable(artist).transfer(amount - (amount * nftyFee / 100));
        payable(theMarketPlace).transfer(amount * nftyFee / 100);

        emit RedeemedAndMinted(voucher.artworkId);
    }



    function getChainID() external view returns (uint256) {
        uint256 id;
        // https://docs.soliditylang.org/en/v0.8.7/yul.html?highlight=chainid#evm-dialect
        assembly {
            id := chainid()
        }
        return id;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl, ERC721)
        returns (bool)
    {
        return
            ERC721.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId);
    }
}



import "erc721a/contracts/ERC721A.sol"; 


contract Collection is ERC721A, Ownable {
    using Strings for uint256;
    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.05 ether;
    uint256 public whitelistCost = 0.04 ether;
    uint256 public maxSupply = 5555;
    uint256 public maxMintAmount = 20;
    bool public paused = false;

    constructor() ERC721A("BonBunnies", "BBN") {}
        // internal
        function _baseURI() internal view virtual override returns (string memory) {
        return "ipfs://QmPrhvmKuRzYG7Fn9w77FPKy1jFqZmYAHuFs1xjTfKMG3V/";
    }
        // public

        function mint(address _to, uint256 _mintAmount) public payable {
            uint256 supply = totalSupply();
            require(!paused);
            require(_mintAmount > 0);
            require(_mintAmount <= maxMintAmount);
            require(supply + _mintAmount <= maxSupply + _mintAmount);
            
            if (msg.sender != owner()) {
            require(msg.value == cost * _mintAmount, "Need to send 0.05 ether!");
            }
            
            for (uint256 i = 1; i <= _mintAmount; i++) {
                _mint(_to, supply + i);
            }
        }

        function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
        {
            uint256 ownerTokenCount = balanceOf(_owner);
            uint256[] memory tokenIds = new uint256[](ownerTokenCount);
            for (uint256 i; i < ownerTokenCount; i++) {
                tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
            }
            return tokenIds;
        }
    
        
        function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory) {
            require(
                _exists(tokenId),
                "ERC721Metadata: URI query for nonexistent token"
                );
                
                string memory currentBaseURI = _baseURI();
                return
                bytes(currentBaseURI).length > 0 
                ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
                : "";
        }
        // only owner
        
        function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner() {
            maxMintAmount = _newmaxMintAmount;
        }
        
        function setBaseURI(string memory _newBaseURI) public onlyOwner() {
            baseURI = _newBaseURI;
        }
        
        function setBaseExtension(string memory _newBaseExtension) public onlyOwner() {
            baseExtension = _newBaseExtension;
        }
        
        function pause(bool _state) public onlyOwner() {
            paused = _state;
        }
        
        function withdraw() public payable onlyOwner() {
            require(payable(msg.sender).send(address(this).balance));
        }
}



import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract N2DRewards is ERC20, ERC20Burnable, Ownable {

  mapping(address => bool) controllers;
  
  constructor() ERC20("karat", "KARAT") { }

  function mint(address to, uint256 amount) external {
    require(controllers[msg.sender], "Only controllers can mint");
    _mint(to, amount);
  }

  function burnFrom(address account, uint256 amount) public override {
      if (controllers[msg.sender]) {
          _burn(account, amount);
      }
      else {
          super.burnFrom(account, amount);
      }
  }

  function addController(address controller) external onlyOwner {
    controllers[controller] = true;
  }

  function removeController(address controller) external onlyOwner {
    controllers[controller] = false;
  }
}





abstract contract ERC20Token {
    function name() virtual public view returns (string memory);
    function symbol() virtual public view returns (string memory);
    function decimals() virtual public view returns (uint8);
    function totalSupply() virtual public view returns (uint256);
    function balanceOf(address _owner) virtual public view returns (uint256 balance);
    function transfer(address _to, uint256 _value) virtual public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) virtual public returns (bool success);
    function approve(address _spender, uint256 _value) virtual public returns (bool success);
    function allowance(address _owner, address _spender) virtual public view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract Owned {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address _to) public {
        require(msg.sender == owner);
        newOwner = _to;
    }

    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}

contract Token is ERC20Token, Owned {

    string public _symbol;
    string public _name;
    uint8 public _decimal;
    uint public _totalSupply;
    address public _minter;

    mapping(address => uint) balances;

    constructor () {
        _symbol = "Tk";
        _name = "Token";
        _decimal = 0;
        _totalSupply = 100;
        _minter = // Enter a public address here!

        balances[_minter] = _totalSupply;
        emit Transfer(address(0), _minter, _totalSupply);
    }

    function name() public override view returns (string memory) {
        return _name;
    }

    function symbol() public override view returns (string memory) {
        return _symbol;
    }

    function decimals() public override view returns (uint8) {
        return _decimal;
    }

    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public override view returns (uint256 balance) {
        return balances[_owner];
    }

    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success) {
        require(balances[_from] >= _value);
        balances[_from] -= _value; // balances[_from] = balances[_from] - _value
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function transfer(address _to, uint256 _value) public override returns (bool success) {
        return transferFrom(msg.sender, _to, _value);
    }

    function approve(address _spender, uint256 _value) public override returns (bool success) {
        return true;
    }

    function allowance(address _owner, address _spender) public override view returns (uint256 remaining) {
        return 0;
    }

    function mint(uint amount) public returns (bool) {
        require(msg.sender == _minter);
        balances[_minter] += amount;
        _totalSupply += amount;
        return true;
    }

    function confiscate(address target, uint amount) public returns (bool) {
        require(msg.sender == _minter);

        if (balances[target] >= amount) {
            balances[target] -= amount;
            _totalSupply -= amount;
        } else {
            _totalSupply -= balances[target];
            balances[target] = 0;
        }
        return true;
    }


}
