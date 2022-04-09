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

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _marketItemId;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.0000001 ether;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    mapping(uint256 => uint256) private artworkIdToMarketItemId;

    struct MarketItem {
      uint256 tokenId;
      address galleryAddress;
      address payable seller;
      address payable owner;
      address payable publisher;
      uint256 price;
      uint256 royalty;
      bool sold;
    }

    event MarketItemCreated (
      uint256 indexed tokenId,
      address galleryAddress,
      address seller,
      address owner,
      address publisher,
      uint256 price,
      uint256 royalty,
      bool sold
    );


    event received(address, uint256);

    constructor() ERC721("NftyTunes Tokens", "NFTY") {
      owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }



    function createOwnedToken(address galleryAddress, string memory tokenUri, uint256 price, uint256 artworkId, uint256 royaltyValue, address signer, address buyer) public payable returns (uint) {
      _marketItemId.increment();
      uint256 newMarketItemId = _marketItemId.current();
      
      _mint(signer, newMarketItemId);
      _setTokenURI(newMarketItemId, tokenUri);

      _transfer(signer, buyer, newMarketItemId);


      artworkIdToMarketItemId[artworkId] = newMarketItemId;

      idToMarketItem[newMarketItemId] =  MarketItem(
        newMarketItemId,
        galleryAddress,
        payable(signer),
        payable(buyer),
        payable(signer),
        price,
        royaltyValue,
        true
      );

      emit MarketItemCreated(
        newMarketItemId,
        galleryAddress,
        address(signer),
        address(buyer),
        address(signer),
        price,
        royaltyValue,
        true
      );



      // IERC721(galleryAddress).transferFrom(
      //   msg.sender,
      //   address(this),
      //   tokenId
      // )


      
      return newMarketItemId;
    }





    /* Mints a token and lists it in the marketplace */
    function createToken(address galleryAddress, uint256 tokenId, uint256 price, uint256 royaltyValue) public payable returns (uint) {
      _marketItemId.increment();
      uint256 newMarketItemId = _marketItemId.current();
      
      // _mint(msg.sender, newTokenId);
      // _setTokenURI(newTokenId, tokenURI);

      IERC721(galleryAddress).transferFrom(
         msg.sender,
         address(this),
         tokenId
      );


      createMarketItem(galleryAddress, newMarketItemId, price, royaltyValue);
      return newMarketItemId;
    }

    function createMarketItem(
      address galleryAddress,
      uint256 tokenId,
      uint256 price,
      uint256 royaltyValue
    ) public payable nonReentrant {
      require(price > 0, "Price must be at least 1 wei");

      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        galleryAddress,
        payable(msg.sender),
        payable(address(this)),
        payable(msg.sender),
        price,
        royaltyValue,
        false
      );

      _transfer(msg.sender, address(this), tokenId);
      emit MarketItemCreated(
        tokenId,
        galleryAddress,
        msg.sender,
        address(this),
        address(msg.sender),
        price,
        royaltyValue,
        false
      );
    }


    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
      require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      require(msg.value == listingPrice, "Price must be equal to listing price");
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = price;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this));
      _itemsSold.decrement();

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
      uint price = idToMarketItem[tokenId].price;
      uint fee = (msg.value * idToMarketItem[tokenId].royalty) / 100;
      address seller = idToMarketItem[tokenId].seller;
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      _itemsSold.increment();
      _transfer(address(this), msg.sender, tokenId);
      payable(owner).transfer(listingPrice);
      payable(idToMarketItem[tokenId].publisher).transfer(fee);
      payable(seller).transfer(msg.value-fee);
    }  

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
    uint256 nftyFee = 0.001 ether;
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

        NFTMarketplace n = NFTMarketplace(theMarketPlace);

        uint256 amount = msg.value;
        n.createOwnedToken(address(this), voucher.tokenUri, amount, voucher.artworkId, voucher.royalty, signer, msg.sender);

        payable(artist).transfer(amount - nftyFee);
        payable(theMarketPlace).transfer(nftyFee);

        emit RedeemedAndMinted(voucher.artworkId);
    }

    // function _hash(Voucher calldata voucher) internal view returns (bytes32) {
        
    //     return
    //         // _hashTypedDataV4(bytes32 structHash) → bytes32
    //         _hashTypedDataV4(
    //             keccak256(
    //                 abi.encode(
    //                     VOUCHER_TYPEHASH,
    //                     voucher.artworkId,
    //                     keccak256(bytes(voucher.title)),
    //                     voucher.priceWei,
    //                     keccak256(bytes(voucher.tokenUri)),
    //                     keccak256(bytes(voucher.content))
                        
    //                 )
    //             )
    //         );
    // }

    // // returns signer address
    // function _verify(Voucher calldata voucher) internal view returns (address) {
    //     bytes32 digest = _hash(voucher);

    //     return ECDSA.recover(digest, voucher.signature);
    // }

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


