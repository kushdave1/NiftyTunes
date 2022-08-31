// //SPDX-License-Identifier: Unlicense
// pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/interfaces/IERC2981.sol";
// import "@openzeppelin/contracts/token/common/ERC2981.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";

// contract LiveMintFactory is ERC721URIStorage, Ownable, ERC2981, ReentrancyGuard {

//     using Counters for Counters.Counter;
//     Counters.Counter private _amountMinted;

//     uint256 mintAmount;
//     uint96 royaltyValue;
//     address payable theArtist;
    
//     constructor(
//         string memory name,
//         string memory symbol,
//         address payable artist,
//         uint256 _mintAmount,
//         uint96 _royaltyValue
//     ) ERC721(name, symbol) {
//         theArtist = artist;
//         mintAmount = _mintAmount;
//         royaltyValue = _royaltyValue;
//     }

//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721, ERC2981)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }

//     function getCurrentId() external view returns (uint256) {
//         return _amountMinted.current();
//     }

//     function mint(string memory tokenURI) public nonReentrant onlyOwner returns (uint256) {

//       uint256 auctionItemId = _amountMinted.current();
//       // require(mintAmount > auctionItemId, "Mint Amount Exceeded");
      
//       _mint(msg.sender, auctionItemId);
//       _setTokenRoyalty(auctionItemId, theArtist, royaltyValue);
//       _setTokenURI(auctionItemId, tokenURI);
//       _amountMinted.increment();

//       return auctionItemId;

//     }

//     // function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
//     //   _setTokenURI(tokenId, tokenURI);
//     // }

    
// }



// contract LiveMintAuction is ReentrancyGuard, Ownable {
//   using Counters for Counters.Counter;
//   Counters.Counter private _auctionsCreated;


//   event Start(uint highestBid, uint256 timestamp);
//   event End(address[] winningBidders, uint256 timestamp);
//   event Bid(address indexed sender, uint amount, uint256 timestamp);
//   event Withdraw(address indexed bidder, uint amount, uint256 timestamp);

//   address payable public seller;

//   bool public started;
//   bool public ended;
//   uint public endAt;
//   //uint timeOfAuction;
//   address payable nftContract;
//   uint public floorBid;
//   uint public TotalNFTs;

  
//   mapping(address => uint) public fundsByBidder;
//   mapping(address => address) _nextBidders;

//   uint256 public listSize;
//   address constant GUARD = address(1);


//   constructor(address _nftContract) {
//     seller = payable(msg.sender);
//     //timeOfAuction = _timeOfAuction;
//     nftContract = payable(_nftContract);
//   }

// //////////////////////                                                                                  //////////////////////
// //////////////////////                                                                                  //////////////////////
// ////////////////////// Functions to Create a sorted list of Bidders to get the top x bidders per auction//////////////////////
// //////////////////////                                                                                  //////////////////////
// //////////////////////                                                                                  //////////////////////

//   function addBidder(address bidder, uint256 bid) internal {
//     require(_nextBidders[bidder] == address(0), "You must increase bid to add a bidder");
    
//     address index = _findIndex(bid);
//     fundsByBidder[bidder] = bid;
//     _nextBidders[bidder] = _nextBidders[index];
//     _nextBidders[index] = bidder;
//     listSize++;
//   }

//   function increaseBid(address bidder, uint256 bid) internal {
    
//     updateBid(bidder, fundsByBidder[bidder] + bid);
//   }

//   function updateBid(address bidder, uint256 newBid) internal {
//     require(_nextBidders[bidder] != address(0));
    
//     address prevBidder = _findPrevBidder(bidder);
//     address nextBidder = _nextBidders[bidder];
//     if(_verifyIndex(prevBidder, newBid, nextBidder)){
//       fundsByBidder[bidder] = newBid;
//     } else {
//       removeBidder(bidder);
//       addBidder(bidder, newBid);
//     }
//   }

//   function removeBidder(address bidder) internal {
//     require(_nextBidders[bidder] != address(0));
    
//     address prevBidder = _findPrevBidder(bidder);
//     _nextBidders[prevBidder] = _nextBidders[bidder];
//     _nextBidders[bidder] = address(0);
//     fundsByBidder[bidder] = 0;
//     listSize--;
//   }

//   function getTop(uint256 totalNFTs) public view returns(address[] memory) {
//     //require(totalNFTs <= listSize, "List Size greater than Getter");
//     uint k;
//     if (totalNFTs > listSize) {
//       k = listSize;
//     } else {
//       k = totalNFTs;
//     }
//     address[] memory bidderLists = new address[](k);
//     address currentAddress = _nextBidders[GUARD];
//     for(uint256 i = 0; i < k; ++i) {
//       bidderLists[i] = currentAddress;
//       currentAddress = _nextBidders[currentAddress];
//     }
//     return bidderLists;
//   }

//   // function getTopBids(address[] memory bidders) public view returns(uint256[] memory) {
//   //   uint[] memory bids;
    
//   //   for(uint256 i = 0; i < bidders.length; ++i) {
//   //     bids[i] = fundsByBidder[bidders[i]];
//   //   }
//   //   return bids;
//   // }


//   function _verifyIndex(address prevBidder, uint256 newValue, address nextBidder)
//     internal
//     view
//     returns(bool)
//   {
//     return (prevBidder == GUARD || fundsByBidder[prevBidder] >= newValue) && 
//            (nextBidder == GUARD || newValue > fundsByBidder[nextBidder]);
//   }

//   function _findIndex(uint256 newValue) internal view returns(address) {
//     address candidateAddress = GUARD;
//     while(true) {
//       if(_verifyIndex(candidateAddress, newValue, _nextBidders[candidateAddress]))
//         return candidateAddress;
//       candidateAddress = _nextBidders[candidateAddress];
//     }
//   }

//   function _isPrevBidder(address bidder, address prevBidder) internal view returns(bool) {
//     return _nextBidders[prevBidder] == bidder;
//   }

//   function _findPrevBidder(address bidder) internal view returns(address) {
//     address currentAddress = GUARD;
//     while(_nextBidders[currentAddress] != GUARD) {
//       if(_isPrevBidder(bidder, currentAddress))
//         return currentAddress;
//       currentAddress = _nextBidders[currentAddress];
//     }
//     return address(0);
//   }



// //////////////////////                                                                                  //////////////////////
// //////////////////////                                                                                  //////////////////////
// //////////////////////                                                                                  //////////////////////
// //////////////////////                                                                                  //////////////////////
// //////////////////////                                                                                  //////////////////////


// ////////////////////// GETTERS //////////////////////////////

//   function isStarted() external view returns (bool) {
//       if (started) {
//           return true;
//       } else {
//           return false;
//       }
//   }

//   function getEndAt() external view returns (uint) {
//       return endAt;
//   }

//   function getBid() external view returns (uint256) {
//       return fundsByBidder[msg.sender];
//   }

//   function getCurrentItem() external view returns (uint256) {
//       LiveMintFactory mintContract = LiveMintFactory(nftContract); 
//       uint256 tokenId = mintContract.getCurrentId();
//       return tokenId;
//   } 

//   function getLowestBid() external view returns (uint256) {
//       address[] memory bidders = getTop(TotalNFTs);
//       uint topLength = bidders.length;
//       return fundsByBidder[bidders[topLength-1]];
//   }

//   function getHighestBid() external view returns (uint256) {
//       address[] memory bidders = getTop(TotalNFTs);
//       return fundsByBidder[bidders[0]];
//   }


// ////////////////////////////////////////////////////////////////


//   function start(uint timeOfAuction, uint startingBid, uint nftsToMint) external nonReentrant {
//         require(!started, "Already Started!");
//         require(msg.sender == seller, "You are not the contract owner");


//         TotalNFTs = nftsToMint;
//         _nextBidders[GUARD] = GUARD;

//         LiveMintFactory mintContract = LiveMintFactory(nftContract); 
        


//         // uint256 tokenId = mintContract.getCurrentId();
//         // nftId = tokenId;

//         started = true;
//         ended = false;
//         endAt = block.timestamp + (timeOfAuction * 1 minutes);
//         floorBid = startingBid;

//         emit Start(floorBid, block.timestamp);

//   }

//   function bid() external payable {
//         require(started, "Not started.");
//         require(block.timestamp < endAt, "Ended!");
//         require(msg.value+fundsByBidder[msg.sender] >= floorBid, "Must Bid Higher than or equal to Floor");
//         address lastBidder;
        
//         if (TotalNFTs <= listSize) {
//           lastBidder = getTop(TotalNFTs)[TotalNFTs-1];
//         }

//         if (lastBidder != address(0)) {
//             require(msg.value+fundsByBidder[msg.sender] > fundsByBidder[lastBidder], "Must bid more than the last highest bidder");
//         }

//         if (_nextBidders[msg.sender] == address(0)) {
//           addBidder(msg.sender, msg.value);
//         } else {
//           increaseBid(msg.sender, msg.value);
//         }

//         emit Bid(msg.sender, fundsByBidder[msg.sender], block.timestamp);
//   }

//    function withdraw() external payable nonReentrant {
//         address[] memory topBidders = getTop(TotalNFTs);
//         for (uint i = 0; i < TotalNFTs; i++) {
//           require(topBidders[i] != msg.sender, "Winning Bidders cannot withdraw their bids");
//         }
        
        

//         uint bal = fundsByBidder[msg.sender];
//         removeBidder(msg.sender);
        
//         // (bool sent, bytes memory data) = payable(msg.sender).call{value: bal}("");
//         // require(sent, "Could not withdraw");
//         payable(msg.sender).transfer(bal);


//         emit Withdraw(msg.sender, bal, block.timestamp);
//     }


//     // End Auction Function. Administrator must upload metadata in order to mint the NFT and send to winner of auction
//   function end(string memory tokenURI) external nonReentrant{
//     require(started, "The Auction hasn't started yet.");
//     require(block.timestamp >= endAt, "Auction is still ongoing!");
//     require(!ended, "Auction already ended!");
//     require(msg.sender == seller, "Only the seller can end the auction");

//     uint nftsMinted = TotalNFTs;
//     _auctionsCreated.increment();
//     LiveMintFactory mintContract = LiveMintFactory(nftContract); 

//     ended = true;
//     started = false;

//     address[] memory winningBidders = getTop(nftsMinted);


//     for (uint i = 0; i < winningBidders.length; i++) {
//         if (winningBidders[i] != address(0)) {

//             uint tokenId = mintContract.mint(tokenURI);
            
//             address ownerOfToken = IERC721(nftContract).ownerOf(tokenId);
//             IERC721(nftContract).transferFrom(ownerOfToken, winningBidders[i], tokenId);
//             payable(seller).transfer(fundsByBidder[winningBidders[i]]);
          

//         } else {

//             uint tokenId = mintContract.mint(tokenURI);
//             address ownerOfToken = IERC721(nftContract).ownerOf(tokenId);
//             IERC721(nftContract).transferFrom(ownerOfToken, seller, tokenId);

//         }

//     }
    
//     emit End(winningBidders, block.timestamp);
//   }

// //   function setTokenURI(uint256 tokenId, string memory tokenURI) public {
// //       require(seller == msg.sender, "You don't have authority to change Token URIs");
// //       LiveMintFactory mintContract = LiveMintFactory(nftContract); 
// //       mintContract.setTokenURI(tokenId, tokenURI);
// //   }

// }