// // //SPDX-License-Identifier: Unlicense
// pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/interfaces/IERC2981.sol";
// import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// import { IERC721AUpgradeable } from "erc721a-upgradeable/contracts/IERC721AUpgradeable.sol";
// import { ERC721AUpgradeable, ERC721AStorage } from "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
// import { ERC721AQueryableUpgradeable } from "erc721a-upgradeable/contracts/extensions/ERC721AQueryableUpgradeable.sol";
// import { ERC721ABurnableUpgradeable } from "erc721a-upgradeable/contracts/extensions/ERC721ABurnableUpgradeable.sol";
// import { IERC2981Upgradeable } from "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";



// contract LiveMintFactoryProxy is Initializable, ERC721Upgradeable, ERC2981Upgradeable {

//     using Counters for Counters.Counter;
//     Counters.Counter private _amountMinted;


//     bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

//     address seller;

//     uint256 mintAmount;
//     uint96 royaltyValue;
//     address payable theArtist;
//     uint256 _MAX_BPS = 10000;

//     mapping (uint256 => string) private _tokenURIs;
    
//     function initialize(
//         string memory name,
//         string memory symbol,
//         address payable auctionAddress,
//         uint256 _mintAmount,
//         uint96 _royaltyValue
//     ) public initializer {

//         require(royaltyValue < 10000);

//         seller = auctionAddress;
//         mintAmount = _mintAmount;
//         royaltyValue = _royaltyValue;

//         __ERC721_init(name, symbol);
//     }

//      function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721Upgradeable, ERC2981Upgradeable)
//         returns (bool)
//     {
//         return
//             ERC721Upgradeable.supportsInterface(interfaceId) ||
//             ERC2981Upgradeable.supportsInterface(interfaceId) ||
//             interfaceId == this.supportsInterface.selector;
//     }

    

//     function getCurrentId() external view returns (uint256) {
//         return _amountMinted.current();
//     }

//     function mint(string memory tokenURI) public returns (uint256) {

//       require(msg.sender == auctionAddress, "Only the auction contract can call this");

//       uint256 auctionItemId = _amountMinted.current();
//       // require(mintAmount > auctionItemId, "Mint Amount Exceeded");
      
//       _mint(msg.sender, 1);
//       _setTokenRoyalty(auctionItemId, theArtist, royaltyValue);
//       _setTokenURI(auctionItemId, tokenURI);
//       _amountMinted.increment();

//       return auctionItemId;

//     }


//     function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
//             require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
//             _tokenURIs[tokenId] = _tokenURI;
//     }

//     function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
//             require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

//             string memory _tokenURI = _tokenURIs[tokenId];
            
//             return _tokenURI;
          

//         }

//     // function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
//     //   _setTokenURI(tokenId, tokenURI);
//     // }

    
// }


// contract LiveMintAuctionProxy is Initializable, ReentrancyGuardUpgradeable {
//   using Counters for Counters.Counter;


//   event Start(uint highestBid, uint256 timestamp);
//   event End(address[] winningBidders, uint256 timestamp);
//   event Bid(address indexed sender, uint amount, uint256 timestamp);
//   event Withdraw(address indexed bidder, uint amount, uint256 timestamp);

//   address payable public seller;
//   address payable public nftyTunesAddress;
//   address payable public payeeOne;
//   address payable public payeeTwo;
//   uint public payeeFeeOne;
//   uint public payeeFeeTwo;
//   uint public nftyTunesFee;


//   bool public started;
//   bool public ended;
//   uint public endAt;
//   //uint timeOfAuction;
//   address nftContract;
//   uint public floorBid;
//   uint public totalNFTs;

  
//   mapping(address => uint) public fundsByBidder;
//   mapping(address => address) _nextBidders;

//   uint256 public listSize;
//   address constant GUARD = address(1);


//   function initialize(
//   address _payeeOne, 
//   address _payeeTwo,
//   uint256 _payeeOneFee, 
//   uint256 _payeeTwoFee,
//   uint256 _nftyTunesFee
//   ) public initializer {
//     seller = payable(msg.sender);
//     payeeOne = payable(_payeeOne);
//     payeeTwo = payable(_payeeTwo);
//     payeeFeeOne = _payeeOneFee;
//     payeeFeeTwo = _payeeTwoFee;
//     nftyTunesFee = _nftyTunesFee;

//   }

//   function setNFTContract(address _nftContract) public {
//       require(msg.sender == seller, "You did not deploy this contract");
      
//   }

// //////////////////////                                                                                  //////////////////////
// //////////////////////                                                                                  //////////////////////
// ////////////////////// Functions to Create a sorted list of Bidders to get the top x bidders per auction//////////////////////
// //////////////////////                                                                                  //////////////////////
// //////////////////////                                                                                  //////////////////////

//   function addBidder(address bidder, uint256 bid) internal {
//     require(_nextBidders[bidder] == address(0), "You must increase the bid to add a bidder");
    
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
//       LiveMintFactoryProxy mintContract = LiveMintFactoryProxy(nftContract); 
//       uint256 tokenId = mintContract.getCurrentId();
//       return tokenId;
//   } 

//   function getLowestBid() external view returns (uint256) {
//       address[] memory bidders = getTop(totalNFTs);
//       uint topLength = bidders.length;
//       return fundsByBidder[bidders[topLength-1]];
//   }

//   function getHighestBid() external view returns (uint256) {
//       address[] memory bidders = getTop(totalNFTs);
//       return fundsByBidder[bidders[0]];
//   }


// ////////////////////////////////////////////////////////////////

//   // Start the auction

//   function start(uint timeOfAuction, uint startingBid, uint nftsToMint) external nonReentrant {
//         require(!started, "Already Started!");
//         require(msg.sender == seller, "You are not the contract owner");


//         totalNFTs = nftsToMint;
//         _nextBidders[GUARD] = GUARD;

//         LiveMintFactoryProxy mintContract = LiveMintFactoryProxy(nftContract); 
        


//         // uint256 tokenId = mintContract.getCurrentId();
//         // nftId = tokenId;

//         started = true;
//         ended = false;
//         endAt = block.timestamp + (timeOfAuction * 1 minutes);
//         floorBid = startingBid;

//         emit Start(floorBid, block.timestamp);

//   }

//   // bid function that allows a user to bid on the auction to win an NFT

//   function bid() external payable {
//         require(started, "Not started.");
//         require(block.timestamp < endAt, "Ended!");
//         require(msg.value+fundsByBidder[msg.sender] >= floorBid, "Must Bid Higher than or equal to Floor");
//         address lastBidder;
        
//         if (totalNFTs <= listSize) {
//           lastBidder = getTop(totalNFTs)[totalNFTs-1];
//         }

//         if (lastBidder != address(0)) {
//             require(msg.value+fundsByBidder[msg.sender] > fundsByBidder[lastBidder], "Must bid more than the last highest bidder");
//         }

//         if (_nextBidders[msg.sender] == address(0)) {
//           addBidder(msg.sender, msg.value);
//         } else {
//           increaseBid(msg.sender, msg.value);
//         }

//         if (endAt - block.timestamp < 300) {
//           endAt = endAt + 300 seconds;
//         }

//         emit Bid(msg.sender, fundsByBidder[msg.sender], block.timestamp);
//   }

//   // Withdraw function for users who are not in the top bids. Anyone not is the top x bids specified by TotalNFTs can withdraw their bid during or after the auction
   
//     function withdraw() external payable nonReentrant {
//         address[] memory topBidders = getTop(totalNFTs);
//         for (uint i = 0; i < totalNFTs; i++) {
//           require(topBidders[i] != msg.sender, "Winning Bidders cannot withdraw their bids");
//         }
        
        

//         uint bal = fundsByBidder[msg.sender];
//         removeBidder(msg.sender);
        
//         (bool sent, bytes memory data) = payable(msg.sender).call{value: bal}("");
//         require(sent, "Could not withdraw");
//         // payable(msg.sender).transfer(bal);


//         emit Withdraw(msg.sender, bal, block.timestamp);
//     }


//     // End Auction Function. Administrator must upload metadata in order to mint the NFTs and send to winner of auction
//   function end(string memory tokenURI) external nonReentrant{
//         require(started, "The Auction hasn't started yet.");
//         require(block.timestamp >= endAt, "Auction is still ongoing!");
//         require(!ended, "Auction already ended!");
//         require(msg.sender == seller, "Only the seller can end the auction");

//         uint nftsMinted = totalNFTs;
//         LiveMintFactoryProxy mintContract = LiveMintFactoryProxy(nftContract); 

//         ended = true;
//         started = false;

//         address[] memory winningBidders = getTop(nftsMinted);


//         for (uint i = 0; i < winningBidders.length; i++) {
//             if (winningBidders[i] != address(0)) {

//                 uint tokenId = mintContract.mint(tokenURI);
                
//                 address ownerOfToken = IERC721(nftContract).ownerOf(tokenId);
//                 IERC721(nftContract).transferFrom(ownerOfToken, winningBidders[i], tokenId);
//                 payable(seller).transfer(fundsByBidder[winningBidders[i]] * nftyTunesFee/100);
//                 payable(payeeOne).transfer(fundsByBidder[winningBidders[i]] * payeeFeeOne/100);
//                 payable(payeeTwo).transfer(fundsByBidder[winningBidders[i]] * payeeFeeTwo/100);
              
//             } else {

//                 uint tokenId = mintContract.mint(tokenURI);
//                 address ownerOfToken = IERC721(nftContract).ownerOf(tokenId);
//                 IERC721(nftContract).transferFrom(ownerOfToken, seller, tokenId);

//             }

//         }
        
//         emit End(winningBidders, block.timestamp);
//   }

// //   function setTokenURI(uint256 tokenId, string memory tokenURI) public {
// //       require(seller == msg.sender, "You don't have authority to change Token URIs");
// //       LiveMintFactory mintContract = LiveMintFactory(nftContract); 
// //       mintContract.setTokenURI(tokenId, tokenURI);
// //   }

// }



// import "@openzeppelin/contracts/proxy/Clones.sol";
// import "hardhat/console.sol";


// contract MintFactoryClone is Ownable {
//   address public mintFactoryImplementation;
//   address[] public NftyTunesAddresses;
//   event NftyCoinCreated(address nftyCoin);

  

//   constructor(address _mintFactoryImplementation) {
//     mintFactoryImplementation = _mintFactoryImplementation;

//   }

//   function setMintFactoryImplementation(address _mintFactoryImplementation) external onlyOwner {
//         mintFactoryImplementation = _mintFactoryImplementation;
//   }

//   function createERC721Token(string memory name,
//       string memory symbol,
//       address payable artist,
//       uint256 _mintAmount,
//       uint96 _royaltyValue
//       ) external returns (address) {

//         address clone = Clones.clone(mintFactoryImplementation);
//         console.log(clone);
//         LiveMintFactoryProxy mintContract = LiveMintFactoryProxy(clone); 
//         mintContract.initialize(name, symbol, artist, _mintAmount, _royaltyValue);
//         emit NftyCoinCreated(clone);
//         return clone;



//   }

// }


// contract AuctionFactoryClone is Ownable {
//   address public auctionFactoryImplementation;
//   address[] public NftyTunesAddresses;
//   event NftyAuctionCreated(address nftyAuction);

  

//   constructor(address _auctionFactoryImplementation) {
//     auctionFactoryImplementation = _auctionFactoryImplementation;

//   }

//   function setAuctionFactoryImplementation(address _auctionFactoryImplementation) external onlyOwner {
//         auctionFactoryImplementation = _auctionFactoryImplementation;
//   }

//   function createAuction(address _nftContract, 
//       address _payeeOne, 
//       address _payeeTwo,
//       uint256 _payeeOneFee, 
//       uint256 _payeeTwoFee,
//       uint256 _nftyTunesFee
//       ) external returns (address) {

//         address clone = Clones.clone(auctionFactoryImplementation);
//         LiveMintAuctionProxy auctionContract = LiveMintAuctionProxy(clone); 
//         auctionContract.initialize(_nftContract,
//                                 _payeeOne, 
//                                 _payeeTwo,
//                                 _payeeOneFee, 
//                                 _payeeTwoFee,
//                                 _nftyTunesFee);
//         emit NftyAuctionCreated(clone);
//         return clone;



//   }

// }