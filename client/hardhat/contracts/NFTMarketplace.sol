//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";



contract WETH10 is ERC20 {
  constructor() ERC20("Wrapped Ether", "WETH") public {}

  function mint() external payable {
    _mint(msg.sender, msg.value);
  }

  function burn(uint amount) external {
    _burn(msg.sender, amount);
    payable(msg.sender).transfer(amount);
  }

  function approveSpender(address marketplace, uint amount) external {
    uint256 spenderAmount = amount * 10**18;
    approve(marketplace, spenderAmount);
  }

}

contract NFTMarketplaceStorage is Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _marketItemId;
    Counters.Counter private _itemsSold;
    Counters.Counter private _lazyItemsSold;



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
      address highestBidder;
      uint256 highestBid;
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
      bool isNftyLoop,
      address highestBidder,
      uint256 highestBid
    );

    event bidPlaced (
      uint256 indexed bid,
      address bidder
    );

    mapping(uint256 => mapping(address => uint256)) private TokenIdtoBiddertoHighestBid;
    mapping(address => uint256[]) private bidderToBids; 
    mapping(uint256 => MarketItem) private idToMarketItem;

    function storeBid(uint256 tokenId, address bidder, uint256 bid) onlyOwner public returns (uint256) {
      uint256 newHighestBid = TokenIdtoBiddertoHighestBid[tokenId][bidder]+bid;
      require(TokenIdtoBiddertoHighestBid[tokenId][idToMarketItem[tokenId].highestBidder] < newHighestBid, "Cannot submit a bid less than or equal to the highest previous bid");

      TokenIdtoBiddertoHighestBid[tokenId][bidder]+=bid;
      idToMarketItem[tokenId].highestBidder=bidder;
      idToMarketItem[tokenId].highestBid=bid;

      console.log(idToMarketItem[tokenId].highestBid);
      console.log(idToMarketItem[tokenId].highestBidder);

      emit bidPlaced(bid, bidder);
      return newHighestBid;
    }

    function getHighestBid(uint256 tokenId) external view returns (address, uint256) {
      address highestBidder = idToMarketItem[tokenId].highestBidder;
      uint256 highestBid = TokenIdtoBiddertoHighestBid[tokenId][highestBidder];
      return (highestBidder, highestBid);
    }
    
    function getItemDetails(uint256 tokenId) external view returns (address, address, uint256, bool, uint256, address, address) {
      return (idToMarketItem[tokenId].owner, 
      idToMarketItem[tokenId].seller, 
      idToMarketItem[tokenId].price, 
      idToMarketItem[tokenId].bred,
      idToMarketItem[tokenId].royalty,
      idToMarketItem[tokenId].publisher,
      idToMarketItem[tokenId].publisherTwo
      );
    }

    function getBidDetails(uint256 tokenId) external view returns (address, address, bool, uint256, address, address) {
      return (idToMarketItem[tokenId].owner, 
      idToMarketItem[tokenId].seller, 
      idToMarketItem[tokenId].bred,
      idToMarketItem[tokenId].royalty,
      idToMarketItem[tokenId].publisher,
      idToMarketItem[tokenId].publisherTwo
      );
    }
    

    function storeLazyMintedItem(
      address signer, 
      address buyer, 
      uint256 price, 
      uint256 royaltyAmount) onlyOwner external returns (uint256) {



      _marketItemId.increment();
      _itemsSold.increment();
      uint256 newMarketItemId = _marketItemId.current();


      idToMarketItem[newMarketItemId] =  MarketItem(
        newMarketItemId,
        newMarketItemId,
        payable(signer),
        payable(buyer),
        payable(signer),
        payable(signer),
        price,
        royaltyAmount,
        true,
        false,
        true,
        address(0),
        0
      );

      emit MarketItemCreated(
        newMarketItemId,
        newMarketItemId,
        address(signer),
        address(buyer),
        address(signer),
        address(signer),
        price,
        royaltyAmount,
        true,
        false,
        true,
        address(0),
        0
      );

      return newMarketItemId;

    }

    function storeMarketItem(
      uint256 tokenId,
      address seller,
      address royaltyAddress,
      uint256 royaltyAmount,
      uint256 price
    ) onlyOwner external {

      _marketItemId.increment();
      uint256 newMarketItemId = _marketItemId.current();

      idToMarketItem[newMarketItemId] =  MarketItem(
        tokenId,
        newMarketItemId,
        payable(seller),
        payable(msg.sender),
        payable(royaltyAddress),
        payable(royaltyAddress),
        price,
        royaltyAmount,
        false,
        false,
        false,
        address(0),
        0
      );

      emit MarketItemCreated(
        tokenId,
        newMarketItemId,
        seller,
        msg.sender,
        address(royaltyAddress),
        address(royaltyAddress),
        price,
        royaltyAmount,
        false,
        false,
        false,
        address(0),
        0
      );


    }

    function storeBredItem(
      address creator,
      address publisherOne,
      address publisherTwo,
      uint256 price,
      uint256 bredRoyaltyValue
      ) onlyOwner external returns (uint256) {

      _marketItemId.increment();
      uint256 newMarketItemId = _marketItemId.current();

      idToMarketItem[newMarketItemId] =  MarketItem(
        newMarketItemId,
        newMarketItemId,
        payable(creator),
        payable(creator),
        payable(publisherOne),
        payable(publisherTwo),
        price,
        bredRoyaltyValue,
        true,
        true,
        true,
        address(0),
        0
      );

      emit MarketItemCreated(
        newMarketItemId,
        newMarketItemId,
        address(creator),
        address(creator),
        address(publisherOne),
        address(publisherTwo),
        price,
        bredRoyaltyValue,
        true,
        true,
        true,
        address(0),
        0
      );

      return newMarketItemId;
    }

    

    function deleteMarketItem(uint256 tokenId, address seller) onlyOwner external {
      require(idToMarketItem[tokenId].seller == seller, "Only item seller can perform this operation");
      require(idToMarketItem[tokenId].owner == msg.sender);
      //delete idToMarketItem[tokenId];
      _itemsSold.increment();
    }

    function deleteOwnedItem(uint256 tokenId, address previousOwner) onlyOwner external {
      require(idToMarketItem[tokenId].owner == previousOwner, "Only previous owner can delete");
      delete idToMarketItem[tokenId];
    }

    function setMarketSale(
      uint256 tokenId, 
      address newOwner, 
      uint256 paymentAmount) onlyOwner external {
      _itemsSold.increment();
      idToMarketItem[tokenId].owner = payable(newOwner);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].price = paymentAmount;

    }

    function storeResellData(uint256 tokenId, address owner, uint256 price) onlyOwner external {
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(owner);
        idToMarketItem[tokenId].owner = payable(msg.sender);
        _itemsSold.decrement();
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
      console.log(_marketItemId.current());
      uint itemCount = _marketItemId.current();
      console.log(_itemsSold.current());
      uint unsoldItemCount = _marketItemId.current() - _itemsSold.current();
      uint currentIndex = 0;

      address owner = owner();

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == owner) {
          uint currentId = i + 1;
          console.log(currentId);
          console.log(unsoldItemCount);
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    function fetchItemsListed(address seller) public view returns (MarketItem[] memory) {
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

}


contract NFTMarketplace is ERC721URIStorage, ReentrancyGuard, ERC2981 {
    

    uint256 nftySecondaryFee = 5;
    address payable owner;
    address Storage;
    address WETH;


    event received(address, uint256);


    constructor(address NFTStorage, address _WETH) ERC721("NftyTunes Tokens", "NFTY") {
      owner = payable(msg.sender);
      Storage = NFTStorage;
      WETH = _WETH;
    }


    //                       //
    //                       //
    //  SETTERS AND GETTERS  //
    //                       //
    //                       // 


    receive() external payable {
        emit received(msg.sender, msg.value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //                                         //
    //                                         //
    //  Create an Item from a lazy Minted NFT  //
    //                                         //
    //                                         // 


    function createOwnedTokenFromLazy(
      address galleryAddress, 
      string memory tokenUri, 
      uint256 price, 
      uint96 royaltyValue, 
      address signer, 
      address buyer
      ) public payable nonReentrant {
      require(msg.sender == galleryAddress, "Only the controller can access this function");
      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);

      
      uint256 newMarketItemId = storageContract.storeLazyMintedItem(signer, buyer, price, royaltyValue);
           
      _mint(signer, newMarketItemId);
      _setTokenURI(newMarketItemId, tokenUri);

      _setTokenRoyalty(newMarketItemId, signer, royaltyValue);
      
      _transfer(signer, buyer, newMarketItemId);
      
    }


    //                                                          //
    //                                                          //
    //  Create an Item from an NFT not made by the marketplace  //
    //                                                          //
    //                                                          // 



    function createMarketItem(
      uint256 tokenId,
      uint256 price,
      address nftContract
    ) public payable nonReentrant {

      require(price > 0, "Price must be at least 1 wei");
      require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "You do not own this token");
      
      (address royaltyAddress, uint256 royaltyAmount) = IERC2981(nftContract).royaltyInfo(tokenId, uint256(price));
      console.log(royaltyAddress);
      setApprovalForAll(address(this), true);

      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);
      storageContract.storeMarketItem(tokenId, msg.sender, royaltyAddress, royaltyAmount, price);

      IERC721(nftContract).transferFrom(
         msg.sender,
         address(this),
         tokenId
      );
//      setApprovalForAll(Bidding, true);
      // Biddable bidContract = Biddable(Bidding);
      // bidContract.addItemtoAuction(tokenId, msg.sender);
      
    }



    //                                                          //
    //                                                          //
    //  Create a Bred Item from 2 NFTs made by the marketplace  //
    //                                                          //
    //                                                          // 
    



    function createBredToken(
      uint256 tokenIdOne, 
      address tokenIdOneContract, 
      uint256 tokenIdTwo, 
      address tokenIdTwoContract, 
      string memory bredTokenUri) public payable returns (uint) {
      require(IERC721(tokenIdOneContract).ownerOf(tokenIdOne) == msg.sender, "Only item 1 owner can perform this operation");
      require(IERC721(tokenIdTwoContract).ownerOf(tokenIdTwo) == msg.sender, "Only item 2 owner can perform this operation");

      



      uint256 price = 1 ether;

      (address publisherOne, uint256 royaltyAmountOne) = IERC2981(tokenIdOneContract).royaltyInfo(tokenIdOne, uint256(price));
      (address publisherTwo, uint256 royaltyAmountTwo) = IERC2981(tokenIdTwoContract).royaltyInfo(tokenIdTwo, uint256(price));

      uint256 bredRoyaltyValue = (royaltyAmountOne*price + royaltyAmountTwo*price) / 2;

      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);
      uint256 newMarketItemId = storageContract.storeBredItem(msg.sender, publisherOne, publisherTwo, price, bredRoyaltyValue);
            
      _mint(msg.sender, newMarketItemId);
      _setTokenURI(newMarketItemId, bredTokenUri);
            
      return newMarketItemId;
    }

    /* allows someone to resell a token they have purchased */


    function resellToken(uint256 tokenId, uint256 price, address nftContract) public payable {
      // require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");

      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);
      if(IERC721(nftContract).ownerOf(tokenId) != msg.sender) {   
        console.log('hi');
        storageContract.deleteOwnedItem(tokenId, msg.sender);
        revert();
        
      } else {
        storageContract.storeResellData(tokenId, msg.sender, price);
        setApprovalForAll(address(this), true);
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);    
      }     
    }

    /* allows someone to delist a token they have listed */

    function delistToken(uint256 tokenId) public payable nonReentrant {
      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);
      storageContract.deleteMarketItem(tokenId, msg.sender);
      
      _transfer(address(this), msg.sender, tokenId);
    }

    //                                                                                  //
    //                                                                                  //
    //  Create a Biddable Market Item that will be transferred to the bidding contract  //
    //                                                                                  //
    //                                                                                  // 

    function placeBid(
      uint256 tokenId,
      uint256 price
    ) public payable returns (uint256) {
      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);
      WETH10 wethContract = WETH10(WETH);
      require(IERC20(wethContract).balanceOf(msg.sender) > price, "You don't have enough WETH");
      console.log(price);
      uint256 highBidPlaced = storageContract.storeBid(tokenId, msg.sender, price);

      return highBidPlaced;
    }

    function getAllowance() external view returns (uint256) {
      WETH10 wethContract = WETH10(WETH);
      return IERC20(wethContract).allowance(msg.sender, address(this)) / 10**18;
    }

    function acceptBid(
      uint256 tokenId
    ) public payable {
      
      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);
      WETH10 wethContract = WETH10(WETH);

      (address highestBidder, uint256 highestBid) = storageContract.getHighestBid(tokenId);

      (address owner, 
      address seller, 
      bool bredStatus, 
      uint256 royaltyAmount, 
      address publisherOne, 
      address publisherTwo) = storageContract.getBidDetails(tokenId);
      require(seller == msg.sender, "You don't own this token");
      require(IERC20(wethContract).balanceOf(highestBidder) > highestBid, "Bidder doesn't have enough money");

      if (bredStatus == false) {

        storageContract.setMarketSale(tokenId, highestBidder, highestBid);
        console.log(highestBid);
      
        _transfer(address(this), highestBidder, tokenId);
        IERC20(wethContract).transferFrom(highestBidder, publisherOne, ((highestBid * royaltyAmount) / 10000));
        IERC20(wethContract).transferFrom(highestBidder, address(this), ((highestBid * nftySecondaryFee) / 100));

        IERC20(wethContract).transferFrom(highestBidder, seller, highestBid-((highestBid * royaltyAmount) / 10000)-((highestBid * nftySecondaryFee) / 100));

      } else {

        storageContract.setMarketSale(tokenId, highestBidder, highestBid);


        _transfer(address(this), highestBidder, tokenId);
        IERC20(wethContract).transferFrom(highestBidder, publisherOne, (((highestBid * royaltyAmount) / 10000) / 2));
        IERC20(wethContract).transferFrom(highestBidder, publisherOne, (((highestBid * royaltyAmount) / 10000) / 2));
        IERC20(wethContract).transferFrom(highestBidder, address(this), ((highestBid * nftySecondaryFee) / 100));

        IERC20(wethContract).transferFrom(highestBidder, seller, highestBid-((highestBid * royaltyAmount) / 10000)-((highestBid * nftySecondaryFee) / 100));

      }
    }

    //                                                              //
    //                                                              //
    //  Create a Market Sale from either a bred NFT or a single NFT //
    //                                                              //
    //                                                              // 

    function createMarketSale(
      uint256 tokenId
      ) public payable {

      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);

      (address owner, 
      address seller, 
      uint256 price,
      bool bredStatus,
      uint256 royaltyAmount, 
      address publisherOne, 
      address publisherTwo) = storageContract.getItemDetails(tokenId);

      console.log(royaltyAmount);

      uint nftyFee = (msg.value * nftySecondaryFee) / 10000;
      require(owner == address(this), "Only marketplace items can be bought");
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      
      
      
      if (bredStatus == false) {
        storageContract.setMarketSale(tokenId, msg.sender, msg.value);
        uint artistFee = (msg.value * royaltyAmount) / 10000;

        console.log(publisherOne);
      
        _transfer(address(this), msg.sender, tokenId);
        payable(publisherOne).transfer(artistFee);
        payable(address(this)).transfer(nftyFee);
        payable(seller).transfer(msg.value-artistFee-nftyFee);
      }
      else {
        storageContract.setMarketSale(tokenId, msg.sender, msg.value);
        uint artistFeeOne = ((msg.value * royaltyAmount) / 10000) / 2;
        uint artistFeeTwo = ((msg.value * royaltyAmount) / 10000) / 2;

        _transfer(address(this), msg.sender, tokenId);
        payable(publisherOne).transfer(artistFeeOne);
        payable(publisherTwo).transfer(artistFeeTwo);
        payable(address(this)).transfer(nftyFee);
        payable(seller).transfer(msg.value-artistFeeOne-artistFeeTwo-nftyFee);
          
      }
    }  

    //                                                          //
    //                                                          //
    //             Fetch Items from the marketplace             //
    //                                                          //
    //                                                          // 

    /* Returns all unsold market items */
    

    // /* Returns only items that a user has purchased */


    

    /* Returns only items a user has listed */
    
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
        uint96 royalty;
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

        uint96 royaltyAmount = (voucher.royalty)*100;

        uint256 amount = msg.value;

        console.log(royaltyAmount);




        nftMarketplace.createOwnedTokenFromLazy(address(this), voucher.tokenUri, amount, royaltyAmount, signer, msg.sender);

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
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Collection is ERC721A, Ownable {
  using Strings for uint256;
  string public baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 0.005 ether;
  uint256 public maxSupply = 100;
  uint256 public maxMintAmount = 100;
  bool public paused = false;
  bool public isAllowListActive = false;
  bool public isMintActive = false;
  bytes32 public root;


  constructor(bytes32 _root) ERC721A("BonBunnies", "BBN") {
    root = _root;
  }
  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return "ipfs://Qme4WdYUZUDiiSSpwucYCFpsLSWXgh8XSKuQCh5phWoXEd/";
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );
    
    console.log(_baseURI());

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }
  // public

  function mint(address _to, uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused);
    require(_mintAmount > 0, "Can't mint 0 Amount");
    require(_mintAmount <= maxMintAmount, "Can't mint more than max");
    require(maxSupply - (supply + _mintAmount) >= 0, "Sold Out");
    
    if (msg.sender != owner()) {
      require(msg.value == cost * _mintAmount, "Need to send 0.05 ether!");
    }
    
    _safeMint(_to, _mintAmount);
    
      
  }

  function whitelistMint(bytes32[] calldata _merkleProof, address _to, uint256 _mintAmount) public payable {
    // require(!whitelistClaimed[msg.sender], "Address already claimed");

    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    uint256 supply = totalSupply();

    require(
        MerkleProof.verify(_merkleProof, root, leaf),
        "Invalid Merkle Proof."
    );

    require(_mintAmount > 0, "Can't mint 0 Amount");
    require(_mintAmount <= maxMintAmount, "Can't mint more than max");
    console.log(supply);
    require(maxSupply - (supply + _mintAmount) >= 0, "Sold Out");
      
    if (msg.sender != owner()) {
      require(msg.value == cost * _mintAmount, "Need to send 0.05 ether!");
    }

    _safeMint(_to, _mintAmount);
  }

  function walletOfOwner(address _owner)
  public
  view
  returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
    uint256 currentTokenId = 0;
    uint256 ownedTokenIndex = 0;

    while (ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply) {
      address currentTokenOwner = ownerOf(currentTokenId);

      if (currentTokenOwner == _owner) {
        ownedTokenIds[ownedTokenIndex] = currentTokenId;

        ownedTokenIndex++;
      }

      currentTokenId++;
    }
    return ownedTokenIds;
  }

  function getRoot() public view onlyOwner() returns (bytes32) {
    return root;
  }
  
  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner() {
    maxMintAmount = _newmaxMintAmount;
  }

  function setIsAllowListActive(bool _isAllowListActive) external onlyOwner {
    isAllowListActive = _isAllowListActive;
  }

  function setIsMintActive(bool _isMintActive) external onlyOwner {
    isMintActive = _isMintActive;
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



contract NFTStaking is Ownable, IERC721Receiver {

  uint256 public totalStaked;
  
  // struct to store a stake's token, owner, and earning values
  struct Stake {
    uint24 tokenId;
    uint48 timestamp;
    address owner;
  }

  event NFTStaked(address owner, uint256 tokenId, uint256 value);
  event NFTUnstaked(address owner, uint256 tokenId, uint256 value);
  event Claimed(address owner, uint256 amount);

  // reference to the Block NFT contract
  Collection nft;
  TUNES token;

  // maps tokenId to stake
  mapping(uint256 => Stake) public vault; 

   constructor(Collection _nft, TUNES _token) { 
    nft = _nft;
    token = _token;
  }

  function stake(uint256[] calldata tokenIds) external {
    uint256 tokenId;
    totalStaked += tokenIds.length;
    for (uint i = 0; i < tokenIds.length; i++) {
      tokenId = tokenIds[i];
      require(nft.ownerOf(tokenId) == msg.sender, "not your token");
      require(vault[tokenId].tokenId == 0, 'already staked');

      nft.transferFrom(msg.sender, address(this), tokenId);
      emit NFTStaked(msg.sender, tokenId, block.timestamp);

      vault[tokenId] = Stake({
        owner: msg.sender,
        tokenId: uint24(tokenId),
        timestamp: uint48(block.timestamp)
      });
    } 
  }

  function _unstakeMany(address account, uint256[] calldata tokenIds) internal {
    uint256 tokenId;
    totalStaked -= tokenIds.length;
    for (uint i = 0; i < tokenIds.length; i++) {
      tokenId = tokenIds[i];
      Stake memory staked = vault[tokenId];
      require(staked.owner == msg.sender, "not an owner");

      delete vault[tokenId];
      emit NFTUnstaked(account, tokenId, block.timestamp);
      nft.transferFrom(address(this), account, tokenId);
    }
  }

  function claim(uint256[] calldata tokenIds) external {
      _claim(msg.sender, tokenIds, false);
  }

  function claimForAddress(address account, uint256[] calldata tokenIds) external {
      _claim(account, tokenIds, false);
  }

  function unstake(uint256[] calldata tokenIds) external {
      _claim(msg.sender, tokenIds, true);
  }

  function _claim(address account, uint256[] calldata tokenIds, bool _unstake) internal {
    uint256 tokenId;
    uint256 earned = 0;

    for (uint i = 0; i < tokenIds.length; i++) {
      tokenId = tokenIds[i];
      Stake memory staked = vault[tokenId];
      require(staked.owner == account, "not an owner");
      uint256 stakedAt = staked.timestamp;
      earned += 100000 ether * (block.timestamp - stakedAt) / 30 seconds;
      vault[tokenId] = Stake({
        owner: account,
        tokenId: uint24(tokenId),
        timestamp: uint48(block.timestamp)
      });

    }
    if (earned > 0) {
      earned = earned / 10;
      token.mint(account, earned);
    }
    if (_unstake) {
      _unstakeMany(account, tokenIds);
    }
    emit Claimed(account, earned);
  }

  function earningInfo(uint256[] calldata tokenIds) external view returns (uint256[2] memory info) {
     uint256 tokenId;
     uint256 totalScore = 0;
     uint256 earned = 0;
      Stake memory staked = vault[tokenId];
      uint256 stakedAt = staked.timestamp;
      earned += 100000 ether * (block.timestamp - stakedAt) / 30 seconds;
    uint256 earnRatePerSecond = totalScore * 1 ether / 30 seconds;
    earnRatePerSecond = earnRatePerSecond / 100000;
    // earned, earnRatePerSecond
    return [earned, earnRatePerSecond];
  }

  // should never be used inside of transaction because of gas fee
  function balanceOf(address account) public view returns (uint256) {
    uint256 balance = 0;
    uint256 supply = nft.totalSupply();
    for(uint i = 1; i <= supply; i++) {
      if (vault[i].owner == account) {
        balance += 1;
      }
    }
    return balance;
  }

  // should never be used inside of transaction because of gas fee
  function tokensOfOwner(address account) public view returns (uint256[] memory ownerTokens) {

    uint256 supply = nft.totalSupply();
    uint256[] memory tmp = new uint256[](supply);

    uint256 index = 0;
    for(uint tokenId = 0; tokenId <= supply; tokenId++) {
      if (vault[tokenId].owner == account) {
        tmp[index] = vault[tokenId].tokenId;
        index +=1;
      }
    }

    uint256[] memory tokens = new uint256[](index);
    for(uint i = 0; i < index; i++) {
      tokens[i] = tmp[i];
    }

    return tokens;
  }

  function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
      require(from == address(0x0), "Cannot send nfts to Vault directly");
      return IERC721Receiver.onERC721Received.selector;
    }
  
}








contract TUNES is ERC20, ERC20Burnable, Ownable {

  mapping(address => bool) controllers;
  
  constructor() ERC20("NftyTunes", "TUNES") { 
    
  }

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



