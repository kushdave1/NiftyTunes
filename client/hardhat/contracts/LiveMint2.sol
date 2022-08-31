//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LiveMintFactory2 is ERC721URIStorage, Ownable, ERC2981, ReentrancyGuard {

    using Counters for Counters.Counter;
    Counters.Counter private _amountMinted;

    uint256 mintAmount;
    uint96 royaltyValue;
    address payable theArtist;
    
    constructor(
        string memory name,
        string memory symbol,
        address payable artist,
        uint256 _mintAmount,
        uint96 _royaltyValue
    ) ERC721(name, symbol) {
        theArtist = artist;
        mintAmount = _mintAmount;
        royaltyValue = _royaltyValue;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getCurrentId() external view returns (uint256) {
        return _amountMinted.current();
    }

    function mint(string memory tokenURI) public nonReentrant onlyOwner returns (uint256) {

      uint256 auctionItemId = _amountMinted.current();
      require(mintAmount > auctionItemId, "Mint Amount Exceeded");
      
      _mint(msg.sender, auctionItemId);
      _setTokenRoyalty(auctionItemId, theArtist, royaltyValue);
      _setTokenURI(auctionItemId, tokenURI);
      _amountMinted.increment();

      return auctionItemId;

    }

    // function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
    //   _setTokenURI(tokenId, tokenURI);
    // }

    
}



contract LiveMintAuction2 is ReentrancyGuard {

  event Start(uint tokenId, uint highestBid);
  event End(address highestBidder, uint highestBid, uint tokenId);
  event Bid(address indexed sender, uint amount, uint tokenId);
  event Withdraw(address indexed bidder, uint amount);

  address payable public seller;

  bool public started;
  bool public ended;
  uint public endAt;
  address public highestBidder;
  uint public highestBid;
  //uint timeOfAuction;
  address payable nftContract;

  uint public nftId;

  mapping(uint => mapping(address => uint)) public bids;

  mapping(uint => mapping(address => uint)) public fundsByBidder;

  constructor(address _nftContract) {
    seller = payable(msg.sender);
    //timeOfAuction = _timeOfAuction;
    nftContract = payable(_nftContract);

  }

  function isStarted() external view returns (bool) {
      if (started) {
          return true;
      } else {
          return false;
      }
  }

  function getCurrentItem() external view returns (uint256) {
      LiveMintFactory2 mintContract = LiveMintFactory2(nftContract); 
      uint256 tokenId = mintContract.getCurrentId();
      return tokenId;
  }

  function getEndAt() external view returns (uint) {
      return endAt;
  }

  function getBid(uint tokenId) external view returns (uint256) {
      return bids[tokenId][msg.sender];
  }

  function getHighestBidBidder(uint tokenId) external view returns (uint, address) {
      return (highestBid, highestBidder);
  }


  function start(uint timeOfAuction, uint startingBid) external nonReentrant {
    require(!started, "Already Started!");
    require(msg.sender == seller, "You are not the contract owner");

    LiveMintFactory2 mintContract = LiveMintFactory2(nftContract); 

    uint256 tokenId = mintContract.getCurrentId();

    nftId = tokenId;

    started = true;
    ended = false;
    endAt = block.timestamp + (timeOfAuction * 1 minutes);
    highestBid = startingBid;

    emit Start(nftId, highestBid);

  }

  function bid() external payable {
        require(started, "Not started.");
        require(block.timestamp < endAt, "Ended!");
        require(msg.value > highestBid);

        if (highestBidder != address(0)) {
            bids[nftId][highestBidder] += highestBid;
        }

        fundsByBidder[nftId][msg.sender] += msg.value;

        highestBid = msg.value;
        highestBidder = payable(msg.sender);

        emit Bid(highestBidder, highestBid, nftId);
  }

   function withdraw() external payable nonReentrant {
        uint bal = bids[nftId][msg.sender];
        bids[nftId][msg.sender] = 0;
        // (bool sent, bytes memory data) = payable(msg.sender).call{value: bal}("");
        // require(sent, "Could not withdraw");
        payable(msg.sender).transfer(bal);


        emit Withdraw(msg.sender, bal);
    }


    // End Auction Function. Administrator must upload metadata in order to mint the NFT and send to winner of the auction
  function end(string memory tokenURI) external nonReentrant{
    require(started, "The Auction hasn't started yet.");
    require(block.timestamp >= endAt, "Auction is still ongoing!");
    require(!ended, "Auction already ended!");
    require(msg.sender == seller, "Only the seller can end the auction");

    LiveMintFactory2 mintContract = LiveMintFactory2(nftContract); 

    ended = true;
    started = false;

    if (highestBidder != address(0)) {
        uint tokenId = mintContract.mint(tokenURI);
        address ownerOfToken = IERC721(nftContract).ownerOf(tokenId);
        IERC721(nftContract).transferFrom(ownerOfToken, highestBidder, tokenId);
        // (bool sent, bytes memory data) = seller.call{value: highestBid}("");
        // require(sent, "Could not pay seller!");
        payable(seller).transfer(highestBid);
    } else {
        uint tokenId = mintContract.mint(tokenURI);
        address ownerOfToken = IERC721(nftContract).ownerOf(tokenId);
        IERC721(nftContract).transferFrom(ownerOfToken, seller, tokenId);
    }

    
    emit End(highestBidder, highestBid, nftId);
  }

//   function setTokenURI(uint256 tokenId, string memory tokenURI) public {
//       require(seller == msg.sender, "You don't have authority to change Token URIs");
//       LiveMintFactory mintContract = LiveMintFactory(nftContract); 
//       mintContract.setTokenURI(tokenId, tokenURI);
//   }

}