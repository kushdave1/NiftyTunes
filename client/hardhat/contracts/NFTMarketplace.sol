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
    address WETH;

    

    event bidPlaced (
      uint256 indexed bid,
      address bidder
    );

    struct MarketItem {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      address payable publisher;
      address payable publisherTwo;
      address tokenAddress;
      uint256 price;
      uint256 royalty;
      bool sold;
      bool bred;
      bool locked;
    }

    struct BredItemTokens {
      uint256 tokenIdBredOne;
      uint256 tokenIdBredTwo;
      address tokenIdBredOneAddress;
      address tokenIdBredTwoAddress;
    }

    event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      address publisher,
      address publisherTwo,
      address tokenAddress,
      uint256 price,
      uint256 royalty,
      bool sold,
      bool bred,
      bool locked
    );

    mapping(uint256 => mapping(address => uint256)) private tokenIdToBidderToBid;
    mapping(uint256 => BredItemTokens) private tokenIdToBredTokens;
    mapping(uint256 => MarketItem) private idToMarketItem;

    constructor(address _WETH) {
      WETH = _WETH;
    }

    function checkIfItemExists(address tokenAddress, uint256 tokenId) public view returns (bool) {

      uint totalItemCount = _marketItemId.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].tokenId == tokenId && idToMarketItem[i + 1].tokenAddress == tokenAddress) {
          return true;
        }  
      }
      return false;

    }

    function getItemId(address tokenAddress, uint256 tokenId) public view returns (uint) {

      uint totalItemCount = _marketItemId.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].tokenId == tokenId && idToMarketItem[i + 1].tokenAddress == tokenAddress) {
          return (i+1);
        }  
      }

    }

    /////////////////////// GETTERS //////////////////////////

    function getItemSeller(uint256 marketItemId) public view returns (address) {
      return idToMarketItem[marketItemId].seller;
    }

    function getItemTokenId(uint256 marketItemId) public view returns (uint256) {
      return idToMarketItem[marketItemId].tokenId;
    }

    function getItemOwner(uint256 marketItemId) public view returns (address) {
      return idToMarketItem[marketItemId].owner;
    }

    function getItemPrice(uint256 marketItemId) public view returns (uint256) {
      return idToMarketItem[marketItemId].price;
    }

    function getItemPublisherOne(uint256 marketItemId) public view returns (address) {
      return idToMarketItem[marketItemId].publisher;
    }

    function getItemPublisherTwo(uint256 marketItemId) public view returns (address) {
      return idToMarketItem[marketItemId].publisherTwo;
    }

    function getItemRoyalty(uint256 marketItemId) public view returns (uint256) {
      return idToMarketItem[marketItemId].royalty;
    }

    function getItemBred(uint256 marketItemId) public view returns (bool) {
      return idToMarketItem[marketItemId].bred;
    }

    function getItemBid(uint256 marketItemId, address bidder) public view returns (uint256) {
      return tokenIdToBidderToBid[marketItemId][bidder];
    }

    function getItemLocked(uint256 marketItemId) public view returns (bool) {
      return idToMarketItem[marketItemId].locked;
    }

    function getTokenIdOne(uint256 marketItemId) public view returns (uint) {
      return tokenIdToBredTokens[marketItemId].tokenIdBredOne;
    }

    function getTokenIdTwo(uint256 marketItemId) public view returns (uint) {
      return tokenIdToBredTokens[marketItemId].tokenIdBredTwo;
    }

    function getTokenIdOneAddress(uint256 marketItemId) public view returns (address) {
      return tokenIdToBredTokens[marketItemId].tokenIdBredOneAddress;
    }

    function getTokenIdTwoAddress(uint256 marketItemId) public view returns (address) {
      return tokenIdToBredTokens[marketItemId].tokenIdBredTwoAddress;
    }

    //////////////////////// SET BIDS ///////////////////////////////////////////

    function setItemBid(address bidder, uint256 bid, uint256 marketItemId) onlyOwner external {
      WETH10 wethContract = WETH10(WETH);
      require(IERC20(wethContract).balanceOf(msg.sender) > bid, "You don't have enough WETH");

      tokenIdToBidderToBid[marketItemId][bidder] = bid;
    }

    function withdrawItemBid(address bidder, uint256 marketItemId) onlyOwner external {
      tokenIdToBidderToBid[marketItemId][bidder] = 0;
    }

    /////////////////////// CUSTOM STORAGE FUNCTIONS ////////////////////////////

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
        payable(signer),
        payable(buyer),
        payable(signer),
        payable(signer),
        msg.sender,
        price,
        royaltyAmount,
        true,
        false,
        false
      );

      emit MarketItemCreated(
        newMarketItemId,
        address(signer),
        address(buyer),
        address(signer),
        address(signer),
        msg.sender,
        price,
        royaltyAmount,
        true,
        false,
        false
      );

      return newMarketItemId;

    }


    function storeResellData(uint256 marketItemId, address owner, uint256 price) onlyOwner external {

        idToMarketItem[marketItemId].sold = false;
        idToMarketItem[marketItemId].price = price;
        idToMarketItem[marketItemId].seller = payable(owner);
        idToMarketItem[marketItemId].owner = payable(msg.sender);
        _itemsSold.decrement();

    }

    function storeLockedData(uint256 marketItemId, address owner) onlyOwner external {

        idToMarketItem[marketItemId].seller = payable(owner);
        idToMarketItem[marketItemId].owner = payable(msg.sender);
        idToMarketItem[marketItemId].locked = true;

    }


    function storeDelistData(uint256 marketItemId, address owner) onlyOwner external {

        idToMarketItem[marketItemId].sold = true;
        idToMarketItem[marketItemId].seller = payable(msg.sender);
        idToMarketItem[marketItemId].owner = payable(owner);
        _itemsSold.increment();

    }

    function setMarketSale(
      uint256 tokenId, 
      address newOwner, 
      uint256 price) onlyOwner external {

      _itemsSold.increment();
      idToMarketItem[tokenId].owner = payable(newOwner);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].price = price;

      if (idToMarketItem[tokenId].bred) {
        uint256 tokenIdOne = getTokenIdOne(tokenId);
        uint256 tokenIdTwo = getTokenIdTwo(tokenId);
        address tokenIdOneAddress = getTokenIdOneAddress(tokenId);
        address tokenIdTwoAddress = getTokenIdTwoAddress(tokenId);

        uint256 marketItemIdOne = getItemId(tokenIdOneAddress, tokenIdOne);
        uint256 marketItemIdTwo = getItemId(tokenIdTwoAddress, tokenIdTwo);

        idToMarketItem[marketItemIdOne].owner = payable(newOwner);
        idToMarketItem[marketItemIdOne].sold = true;
        idToMarketItem[marketItemIdOne].seller = payable(msg.sender);

        idToMarketItem[marketItemIdTwo].owner = payable(newOwner);
        idToMarketItem[marketItemIdTwo].sold = true;
        idToMarketItem[marketItemIdTwo].seller = payable(msg.sender);

      }

    }

    function storeMarketItem(
      uint256 tokenId,
      address seller,
      address royaltyAddress,
      uint256 royaltyAmount,
      uint256 price,
      address tokenAddress
    ) onlyOwner external {

      _marketItemId.increment();
      uint256 newMarketItemId = _marketItemId.current();

      idToMarketItem[newMarketItemId] =  MarketItem(
        newMarketItemId,
        payable(seller),
        payable(msg.sender),
        payable(royaltyAddress),
        payable(royaltyAddress),
        tokenAddress,
        price,
        royaltyAmount,
        false,
        false,
        false
      );

      emit MarketItemCreated(
        newMarketItemId,
        seller,
        msg.sender,
        address(royaltyAddress),
        address(royaltyAddress),
        address(tokenAddress),
        price,
        royaltyAmount,
        false,
        false,
        false
      );

    }

    function setBredContractInfo(
      uint256 tokenIdOne,
      uint256 tokenIdTwo,
      address tokenIdOneContract,
      address tokenIdTwoContract,
      uint256 marketItemId
    ) onlyOwner external {

      tokenIdToBredTokens[marketItemId].tokenIdBredOne = tokenIdOne;
      tokenIdToBredTokens[marketItemId].tokenIdBredTwo = tokenIdTwo;
      tokenIdToBredTokens[marketItemId].tokenIdBredOneAddress = tokenIdOneContract;
      tokenIdToBredTokens[marketItemId].tokenIdBredTwoAddress = tokenIdTwoContract;

    }

    function storeBredItem(
      address creator,
      address publisherOne,
      address publisherTwo,
      uint256 bredRoyaltyValue
      ) onlyOwner external returns (uint256) {

      _marketItemId.increment();

      idToMarketItem[_marketItemId.current()] =  MarketItem(
        _marketItemId.current(),
        payable(creator),
        payable(creator),
        payable(publisherOne),
        payable(publisherTwo),
        msg.sender,
        0,
        bredRoyaltyValue,
        true,
        true,
        false
      );

      emit MarketItemCreated(
        _marketItemId.current(),
        address(creator),
        address(creator),
        address(publisherOne),
        address(publisherTwo),
        msg.sender,
        0,
        bredRoyaltyValue,
        true,
        true,
        false
      );

      return _marketItemId.current();

    }
    
    function storeLockedItem(
      uint256 tokenId,
      address seller,
      address royaltyAddress,
      uint256 royaltyAmount,
      address tokenAddress
    ) onlyOwner external {

      _marketItemId.increment();
      uint256 newMarketItemId = _marketItemId.current();

      idToMarketItem[newMarketItemId] =  MarketItem(
        newMarketItemId,
        payable(seller),
        payable(msg.sender),
        payable(royaltyAddress),
        payable(royaltyAddress),
        tokenAddress,
        0,
        royaltyAmount,
        false,
        false,
        true
      );

      emit MarketItemCreated(
        newMarketItemId,
        seller,
        msg.sender,
        address(royaltyAddress),
        address(royaltyAddress),
        address(tokenAddress),
        0,
        royaltyAmount,
        false,
        false,
        true
      );

    }
    

    
    function fetchMarketItems() public view returns (MarketItem[] memory) {

      uint itemCount = _marketItemId.current();
      console.log(_itemsSold.current());
      uint unsoldItemCount = _marketItemId.current() - _itemsSold.current();
      uint currentIndex = 0;

      address owner = owner();

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == owner && idToMarketItem[i+1].locked == false) {
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
      address owner = owner();

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender && idToMarketItem[i + 1].owner == owner && idToMarketItem[i+1].locked == false) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender && idToMarketItem[i + 1].owner == owner && idToMarketItem[i+1].locked == false) {
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

    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
    
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

    function setSignerRole(address nftyLazyFactory) public {
      
      IAccessControl(nftyLazyFactory).grantRole(SIGNER_ROLE, msg.sender);

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

    /* allows someone to resell a token they have purchased */

    function resellToken(uint256 tokenId, uint256 price, address nftContract) public payable {

      require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "You do not own this token");
      require(price > 0, "Cannot have zero price");

      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);
      
      if (storageContract.checkIfItemExists(nftContract, tokenId)) {

        storageContract.storeResellData(tokenId, msg.sender, price);
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);    

      } else {

        (address royaltyAddress, uint256 royaltyAmount) = IERC2981(nftContract).royaltyInfo(tokenId, uint256(price));
        storageContract.storeMarketItem(tokenId, msg.sender, royaltyAddress, royaltyAmount, price, nftContract);
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId); 
      }
    }

    function delistToken(uint256 marketItemId) public payable nonReentrant {

      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);
      address seller = storageContract.getItemSeller(marketItemId);
      uint256 tokenId = storageContract.getItemTokenId(marketItemId);

      require(seller == msg.sender, "Cannot delist another user's token");

      storageContract.storeDelistData(marketItemId, msg.sender);
      _transfer(address(this), msg.sender, tokenId);

    }


    //                                                              //
    //                                                              //
    //  Create a Market Sale from either a bred NFT or a single NFT //
    //                                                              //
    //                                                              // 

    function createMarketSale(
      uint256 marketItemId
      ) public payable {

      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);

      uint256 tokenId = storageContract.getItemTokenId(marketItemId);
      address owner = storageContract.getItemOwner(marketItemId);
      address seller = storageContract.getItemSeller(marketItemId);
      uint256 price = storageContract.getItemPrice(marketItemId);
      bool bredStatus = storageContract.getItemBred(marketItemId);
      uint256 royaltyAmount = storageContract.getItemRoyalty(marketItemId);
      address publisherOne = storageContract.getItemPublisherOne(marketItemId);
      address publisherTwo = storageContract.getItemPublisherTwo(marketItemId);

      uint nftyFee = (msg.value * nftySecondaryFee) / 10000;
      uint artistFee = (msg.value * royaltyAmount) / 10000;

      require(owner == address(this), "Only marketplace items can be bought");
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      require(storageContract.getItemLocked(marketItemId) == false, "This token is locked due to breeding");
      
      if (bredStatus == false) {

        storageContract.setMarketSale(marketItemId, msg.sender, msg.value);
      
        _transfer(address(this), msg.sender, tokenId);
        payable(publisherOne).transfer(artistFee);
        payable(address(this)).transfer(nftyFee);
        payable(seller).transfer(msg.value-artistFee-nftyFee);

      }
      else {

        storageContract.setMarketSale(marketItemId, msg.sender, msg.value);

        _transfer(address(this), msg.sender, tokenId);
        payable(publisherOne).transfer(artistFee / 2);
        payable(publisherTwo).transfer(artistFee / 2);
        payable(address(this)).transfer(nftyFee);
        payable(seller).transfer(msg.value-artistFee-nftyFee);
          
      }
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


      (address publisherOne, uint256 royaltyAmountOne) = IERC2981(tokenIdOneContract).royaltyInfo(tokenIdOne, 1 ether);
      (address publisherTwo, uint256 royaltyAmountTwo) = IERC2981(tokenIdTwoContract).royaltyInfo(tokenIdTwo, 1 ether);

      NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);

      if (storageContract.checkIfItemExists(tokenIdOneContract, tokenIdOne)) {
        uint marketItemId = storageContract.getItemId(tokenIdOneContract, tokenIdOne);
        storageContract.storeLockedData(marketItemId, msg.sender);
      } else {
        storageContract.storeLockedItem(tokenIdOne, msg.sender, publisherOne, royaltyAmountOne, tokenIdOneContract);
      }

      if (storageContract.checkIfItemExists(tokenIdTwoContract, tokenIdTwo)) {
        uint marketItemId = storageContract.getItemId(tokenIdTwoContract, tokenIdTwo);
        storageContract.storeLockedData(marketItemId, msg.sender);
      } else {
        storageContract.storeLockedItem(tokenIdTwo, msg.sender, publisherTwo, royaltyAmountTwo, tokenIdTwoContract);
      }

      IERC721(tokenIdOneContract).transferFrom(msg.sender, address(this), tokenIdOne);
      IERC721(tokenIdOneContract).transferFrom(msg.sender, address(this), tokenIdTwo);

     
      uint256 newMarketItemId = storageContract.storeBredItem(
        msg.sender, 
        publisherOne, 
        publisherTwo, 
        ((royaltyAmountOne*(1 ether) + royaltyAmountTwo*(1 ether)) / 2));
      
      storageContract.setBredContractInfo(
        tokenIdOne,
        tokenIdTwo,
        tokenIdOneContract,
        tokenIdTwoContract,
        newMarketItemId
      );

      _mint(msg.sender, newMarketItemId);
      _setTokenURI(newMarketItemId, bredTokenUri);
            
      return newMarketItemId;

    }

    // function unBreedToken(
    //   uint256 marketItemId
    // ) public payable returns (uint, uint) {

    //   NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);
    //   address owner = storageContract.getItemOwner(marketItemId);
    //   bool bred = storageContract.getItemBred(marketItemId);

    //   require(owner == msg.sender, "You do not own this token");
    //   require(bred, "This is not a NftyTunes bred token");

    //   uint256 tokenIdOne = storageContract.getTokenIdOne(marketItemId);
    //   uint256 tokenIdTwo = storageContract.getTokenIdTwo(marketItemId);
    //   address tokenIdOneAddress = storageContract.getTokenIdOneAddress(marketItemId);
    //   address tokenIdTwoAddress = storageContract.getTokenIdTwoAddress(marketItemId);

    //   storageContract.getItemId(tokenIdOneAddress, tokenIdOne);

    //   _transfer(address(this), msg.sender, tokenIdOne);
    //   _transfer(address(this), msg.sender, tokenIdTwo);

    //   _transfer(msg.sender, address(0), marketItemId);

    //   return (tokenIdOne, tokenIdTwo);
    // }

    //                                                                                  //
    //                                                                                  //
    //  Create a Biddable Market Item that will be transferred to the bidding contract  //
    //                                                                                  //
    //                                                                                  // 

    // function acceptBid(
    //   uint256 marketItemId,
    //   address bidder
    //   ) public payable {

    //   NFTMarketplaceStorage storageContract = NFTMarketplaceStorage(Storage);
    //   WETH10 wethContract = WETH10(WETH);

    //   uint256 tokenId = storageContract.getItemTokenId(marketItemId);
    //   address owner = storageContract.getItemOwner(marketItemId);
    //   address seller = storageContract.getItemSeller(marketItemId);
    //   uint256 price = storageContract.getItemPrice(marketItemId);
    //   bool bredStatus = storageContract.getItemBred(marketItemId);
    //   uint256 royaltyAmount = storageContract.getItemRoyalty(marketItemId);
    //   address publisherOne = storageContract.getItemPublisherOne(marketItemId);
    //   address publisherTwo = storageContract.getItemPublisherTwo(marketItemId);

    //   uint256 bid = storageContract.getItemBid(marketItemId, bidder);

    //   require(seller == msg.sender, "You don't own this token");
    //   require(IERC20(wethContract).balanceOf(bidder) > bid, "Bidder doesn't have enough money");

    //   storageContract.withdrawItemBid(msg.sender, marketItemId);
    //   storageContract.setMarketSale(tokenId, bidder, bid);

    //   if (bredStatus == false) {

    //     IERC20(wethContract).transferFrom(bidder, publisherOne, ((bid * royaltyAmount) / 10000));
    //     IERC20(wethContract).transferFrom(bidder, address(this), ((bid * nftySecondaryFee) / 100));
    //     IERC20(wethContract).transferFrom(bidder, seller, bid-((bid * royaltyAmount) / 10000)-((bid * nftySecondaryFee) / 100));
    //     _transfer(address(this), bidder, tokenId);

    //   } else {

    //     IERC20(wethContract).transferFrom(bidder, publisherOne, (((bid * royaltyAmount) / 10000) / 2));
    //     IERC20(wethContract).transferFrom(bidder, publisherOne, (((bid * royaltyAmount) / 10000) / 2));
    //     IERC20(wethContract).transferFrom(bidder, address(this), ((bid * nftySecondaryFee) / 100));
    //     IERC20(wethContract).transferFrom(bidder, seller, bid-((bid * royaltyAmount) / 10000)-((bid * nftySecondaryFee) / 100));
    //      _transfer(address(this), bidder, tokenId);

    //   }
    // }

}




import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "hardhat/console.sol";

contract NftyLazyFactory is
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
        address payable marketplaceAddress
    ) ERC721("NftyTunes Tokens", "NFTY") EIP712(SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION) {
        
        theMarketPlace = marketplaceAddress;
        _setupRole(DEFAULT_ADMIN_ROLE, theMarketPlace);
    }

    function redeem(
        address buyer,
        Voucher calldata voucher,
        address signer
    ) public payable nonReentrant {

        require(msg.value == voucher.priceWei, "Enter the correct price");
        require(signer != buyer, "You can not purchase your own token");
        require(hasRole(SIGNER_ROLE, signer), "Invalid Signature");
        

        setApprovalForAll(theMarketPlace, true); // sender approves Market Place to transfer tokens
        NFTMarketplace nftMarketplace = NFTMarketplace(theMarketPlace);

        uint96 royaltyAmount = (voucher.royalty)*100;
        uint256 amount = msg.value;

        nftMarketplace.createOwnedTokenFromLazy(address(this), voucher.tokenUri, amount, royaltyAmount, signer, buyer);



        payable(signer).transfer(amount - (amount * nftyFee / 100));
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
    ) ERC721(name, symbol) EIP712(SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION) {
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








