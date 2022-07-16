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

contract LiveMintFactory is ERC721URIStorage, Ownable, ERC2981, ReentrancyGuard {

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

    function mint() public nonReentrant onlyOwner returns (uint256) {

      _amountMinted.increment();
      uint256 auctionItemId = _amountMinted.current();
      require(mintAmount > auctionItemId, "Mint Amount Exceeded");
      
      _mint(msg.sender, auctionItemId);
      _setTokenRoyalty(auctionItemId, theArtist, royaltyValue);

      return auctionItemId;

    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
      _setTokenURI(tokenId, tokenURI);
    }
    
}



contract LiveMintAuction {

  event Start();
  event End(address highestBidder, uint highestBid);
  event Bid(address indexed sender, uint amount);
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

  mapping(address => uint) public bids;

  constructor(address _nftContract) {
    seller = payable(msg.sender);
    //timeOfAuction = _timeOfAuction;
    nftContract = payable(_nftContract);

  }

  function start() external {
    require(!started, "Already Started!");
    require(msg.sender == seller, "You are not the contract owner");

    LiveMintFactory mintContract = LiveMintFactory(nftContract); 

    uint256 tokenId = mintContract.mint();

    nftId = tokenId;

    started = true;
    endAt = block.timestamp + 5 minutes;

    emit Start();

  }

  function bid() external payable {
        require(started, "Not started.");
        require(block.timestamp < endAt, "Ended!");
        require(msg.value > highestBid);

        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBid = msg.value;
        highestBidder = payable(msg.sender);

        emit Bid(highestBidder, highestBid);
  }

   function withdraw() external payable {
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        (bool sent, bytes memory data) = payable(msg.sender).call{value: bal}("");
        require(sent, "Could not withdraw");

        emit Withdraw(msg.sender, bal);
    }

  function end() external {
    require(started, "The Auction hasn't started yet.");
    require(block.timestamp >= endAt, "Auction is still ongoing!");
    require(!ended, "Auction already ended!");
    require(msg.sender == seller, "Only the seller can end the auction");


    if (highestBidder != address(0)) {
        IERC721(nftContract).transferFrom(address(this), highestBidder, nftId);
        (bool sent, bytes memory data) = seller.call{value: highestBid}("");
        require(sent, "Could not pay seller!");
    } else {
        IERC721(nftContract).transferFrom(address(this), seller, nftId);
    }

    ended = true;
    emit End(highestBidder, highestBid);
  }

  function setTokenURI(uint256 tokenId, string memory tokenURI) public {
      require(seller == msg.sender, "You don't have authority to change Token URIs");
      LiveMintFactory mintContract = LiveMintFactory(nftContract); 
      mintContract.setTokenURI(tokenId, tokenURI);
  }

}