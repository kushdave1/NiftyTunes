//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import { IERC721AUpgradeable } from "erc721a-upgradeable/contracts/IERC721AUpgradeable.sol";
import { ERC721AUpgradeable, ERC721AStorage } from "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import { ERC721AQueryableUpgradeable } from "erc721a-upgradeable/contracts/extensions/ERC721AQueryableUpgradeable.sol";
import { ERC721ABurnableUpgradeable } from "erc721a-upgradeable/contracts/extensions/ERC721ABurnableUpgradeable.sol";
import { IERC2981Upgradeable } from "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";



contract LiveMintFactory is Initializable, ERC721Upgradeable, ERC2981Upgradeable, AccessControlUpgradeable {

    using Counters for Counters.Counter;
    Counters.Counter private _amountMinted;


    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    address seller;

    uint256 mintAmount;
    uint96 royaltyValue;
    uint256 _MAX_BPS = 10000;

    mapping (uint256 => string) private _tokenURIs;
    
    function initialize(
        string memory name,
        string memory symbol,
        address auctionAddress,
        uint256 _mintAmount,
        uint96 _royaltyValue
    ) public initializer {

        require(royaltyValue < 10000);

        seller = auctionAddress;
        mintAmount = _mintAmount;
        royaltyValue = _royaltyValue;

        __ERC721_init(name, symbol);
    }

     function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC2981Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return
            ERC721Upgradeable.supportsInterface(interfaceId) ||
            ERC2981Upgradeable.supportsInterface(interfaceId) ||
            AccessControlUpgradeable.supportsInterface(interfaceId) || 
            interfaceId == this.supportsInterface.selector;
    }

    

    function getCurrentId() external view returns (uint256) {
        return _amountMinted.current();
    }

    function mint(string memory tokenURI, address theArtist) public returns (uint256) {

      require(msg.sender == seller, "Only the auction contract can call this");

      uint256 auctionItemId = _amountMinted.current();
      // require(mintAmount > auctionItemId, "Mint Amount Exceeded");
      
      _mint(msg.sender, auctionItemId);
      _setTokenRoyalty(auctionItemId, theArtist, royaltyValue);
      _setTokenURI(auctionItemId, tokenURI);
      _amountMinted.increment();

      return auctionItemId;

    }


    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
            require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
            _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
            require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

            string memory _tokenURI = _tokenURIs[tokenId];
            
            return _tokenURI;
          

        }

    // function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
    //   _setTokenURI(tokenId, tokenURI);
    // }

    
}






contract LiveMintAuctionFactoryStorage is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter public _auctionsCreated;


  event Start(uint highestBid, uint256 timestamp, address indexed nftContract);
  event End(address[] winningBidders, uint256 timestamp, address indexed nftContract);
  event Bid(address indexed sender, uint amount, uint256 timestamp, address indexed nftContract);
  event Withdraw(address indexed bidder, uint amount, uint256 timestamp, address indexed nftContract);

  struct ERC721Auction {

    mapping(uint => address) payees;
    mapping(uint => uint) payeeFees;
    bool started;
    bool ended;
    uint endAt;
    uint timeOfAuction;
    address nftContract;
    uint floorBid;
    uint totalNFTs;
    uint listSize;
    mapping(address => uint) fundsByBidder;
    mapping(address => address) _nextBidders;

  }

  event AuctionCreated(

    address payeeOne,
    address payeeTwo,
    address payeeThree,
    uint payeeFeeOne,
    uint payeeFeeTwo,
    uint payeeFeeThree,
    address nftContract
    );

  mapping(address => ERC721Auction) public idToAuction;

  
  address constant GUARD = address(1);

  constructor() {}

  function setupAuction(address _nftContract,
  address _payeeOne, 
  address _payeeTwo,
  address _payeeThree,
  uint256 _payeeOneFee, 
  uint256 _payeeTwoFee,
  uint256 _payeeThreeFee) public {

    uint _payeeTotal = _payeeOneFee + _payeeTwoFee + _payeeThreeFee;
    require(_payeeTotal == 100, "Split percentage must equal 100");

    ERC721Auction storage auction = idToAuction[_nftContract];

    auction.payees[1] = payable(_payeeOne);
    auction.payees[2] = payable(_payeeTwo);
    auction.payees[3] = payable(_payeeThree);
    auction.payeeFees[1] = _payeeOneFee;
    auction.payeeFees[2] = _payeeTwoFee;
    auction.payeeFees[3] = _payeeThreeFee;

    auction.started = false;
    auction.ended = false;
    auction.endAt = 0;
    auction.timeOfAuction = 0;
    auction.nftContract = _nftContract;
    auction.floorBid = 0;
    auction.totalNFTs = 0;
    auction.listSize = 0;

    emit AuctionCreated(
      address(_payeeOne),
      address(_payeeTwo),
      address(_payeeThree),
      _payeeOneFee,
      _payeeTwoFee,
      _payeeThreeFee,
      _nftContract
    );
    
  }

//////////////////////                                                                                  //////////////////////
//////////////////////                                                                                  //////////////////////
////////////////////// Functions to Create a sorted list of Bidders to get the top x bidders per auction//////////////////////
//////////////////////                                                                                  //////////////////////
//////////////////////                                                                                  //////////////////////

  function addBidder(address bidder, uint256 bid, address nftContract) internal {
    require(idToAuction[nftContract]._nextBidders[bidder] == address(0), "You must increase the bid to add a bidder");
    
    address index = _findIndex(bid, nftContract);
    idToAuction[nftContract].fundsByBidder[bidder] = bid;
    idToAuction[nftContract]._nextBidders[bidder] = idToAuction[nftContract]._nextBidders[index];
    idToAuction[nftContract]._nextBidders[index] = bidder;
    idToAuction[nftContract].listSize++;
  }

  function increaseBid(address bidder, uint256 bid, address nftContract) internal {
    
    updateBid(bidder, idToAuction[nftContract].fundsByBidder[bidder] + bid, nftContract);
  }

  function updateBid(address bidder, uint256 newBid, address nftContract) internal {
    require(idToAuction[nftContract]._nextBidders[bidder] != address(0));
    
    address prevBidder = _findPrevBidder(bidder, nftContract);
    address nextBidder = idToAuction[nftContract]._nextBidders[bidder];
    if(_verifyIndex(prevBidder, newBid, nextBidder, nftContract)){
      idToAuction[nftContract].fundsByBidder[bidder] = newBid;
    } else {
      removeBidder(bidder, nftContract);
      addBidder(bidder, newBid, nftContract);
    }
  }

  function removeBidder(address bidder, address nftContract) internal {
    require(idToAuction[nftContract]._nextBidders[bidder] != address(0));
    
    address prevBidder = _findPrevBidder(bidder, nftContract);
    idToAuction[nftContract]._nextBidders[prevBidder] = idToAuction[nftContract]._nextBidders[bidder];
    idToAuction[nftContract]._nextBidders[bidder] = address(0);
    idToAuction[nftContract].fundsByBidder[bidder] = 0;
    idToAuction[nftContract].listSize--;
  }

  function getTop(uint256 totalNFTs, address nftContract) public view returns(address[] memory) {
    //require(totalNFTs <= listSize, "List Size greater than Getter");
    uint k;
    if (idToAuction[nftContract].totalNFTs > idToAuction[nftContract].listSize) {
      k = idToAuction[nftContract].listSize;
    } else {
      k = idToAuction[nftContract].totalNFTs;
    }
    address[] memory bidderLists = new address[](k);
    address currentAddress = idToAuction[nftContract]._nextBidders[GUARD];
    for(uint256 i = 0; i < k; ++i) {
      bidderLists[i] = currentAddress;
      currentAddress = idToAuction[nftContract]._nextBidders[currentAddress];
    }
    return bidderLists;
  }

  // function getTopBids(address[] memory bidders) public view returns(uint256[] memory) {
  //   uint[] memory bids;
    
  //   for(uint256 i = 0; i < bidders.length; ++i) {
  //     bids[i] = fundsByBidder[bidders[i]];
  //   }
  //   return bids;
  // }


  function _verifyIndex(address prevBidder, uint256 newValue, address nextBidder, address nftContract)
    internal
    view
    returns(bool)
  {
    return (prevBidder == GUARD || idToAuction[nftContract].fundsByBidder[prevBidder] >= newValue) && 
           (nextBidder == GUARD || newValue > idToAuction[nftContract].fundsByBidder[nextBidder]);
  }

  function _findIndex(uint256 newValue, address nftContract) internal view returns(address) {
    address candidateAddress = GUARD;
    while(true) {
      if(_verifyIndex(candidateAddress, newValue, idToAuction[nftContract]._nextBidders[candidateAddress], nftContract))
        return candidateAddress;
      candidateAddress = idToAuction[nftContract]._nextBidders[candidateAddress];
    }
  }

  function _isPrevBidder(address bidder, address prevBidder, address nftContract) internal view returns(bool) {
    return idToAuction[nftContract]._nextBidders[prevBidder] == bidder;
  }

  function _findPrevBidder(address bidder, address nftContract) internal view returns(address) {
    address currentAddress = GUARD;
    while(idToAuction[nftContract]._nextBidders[currentAddress] != GUARD) {
      if(_isPrevBidder(bidder, currentAddress, nftContract))
        return currentAddress;
      currentAddress = idToAuction[nftContract]._nextBidders[currentAddress];
    }
    return address(0);
  }



//////////////////////                                                                                  //////////////////////
//////////////////////                                                                                  //////////////////////
//////////////////////                                                                                  //////////////////////
//////////////////////                                                                                  //////////////////////
//////////////////////                                                                                  //////////////////////


////////////////////// GETTERS //////////////////////////////

  function isStarted(address nftContract) external view returns (bool) {
      if (idToAuction[nftContract].started) {
          return true;
      } else {
          return false;
      }
  }

  function getEndAt(address nftContract) external view returns (uint) {
      return idToAuction[nftContract].endAt;
  }

  function getBid(address nftContract) external view returns (uint256) {
      return idToAuction[nftContract].fundsByBidder[msg.sender];
  }

  function getCurrentItem(address nftContract) external view returns (uint256) {
      LiveMintFactory mintContract = LiveMintFactory(nftContract); 
      uint256 tokenId = mintContract.getCurrentId();
      return tokenId;
  } 

  function getLowestBid(address nftContract) external view returns (uint256) {
      address[] memory bidders = getTop(idToAuction[nftContract].totalNFTs, nftContract);
      uint topLength = bidders.length;
      return idToAuction[nftContract].fundsByBidder[bidders[topLength-1]];
  }

  function getHighestBid(address nftContract) external view returns (uint256) {
      address[] memory bidders = getTop(idToAuction[nftContract].totalNFTs, nftContract);
      return idToAuction[nftContract].fundsByBidder[bidders[0]];
  }


////////////////////////////////////////////////////////////////

  // Start the auction

  function start(uint timeOfAuction, uint startingBid, uint nftsToMint, address nftContract) external nonReentrant {
        require(!idToAuction[nftContract].started, "Already Started!");
        console.log(idToAuction[nftContract].payees[1]);
        require(msg.sender == idToAuction[nftContract].payees[1], "You are not the contract owner");


        idToAuction[nftContract].totalNFTs = nftsToMint;
        idToAuction[nftContract]._nextBidders[GUARD] = GUARD;

        LiveMintFactory mintContract = LiveMintFactory(nftContract); 
        


        // uint256 tokenId = mintContract.getCurrentId();
        // nftId = tokenId;

        idToAuction[nftContract].started = true;
        idToAuction[nftContract].ended = false;
        idToAuction[nftContract].endAt = block.timestamp + (timeOfAuction * 1 minutes);
        idToAuction[nftContract].floorBid = startingBid;

        emit Start(idToAuction[nftContract].floorBid, block.timestamp, nftContract);

  }

  // bid function that allows a user to bid on the auction to win an NFT

  function bid(address nftContract) external payable {
        require(idToAuction[nftContract].started, "Not started.");
        require(block.timestamp < idToAuction[nftContract].endAt, "Ended!");
        require(msg.value+idToAuction[nftContract].fundsByBidder[msg.sender] >= idToAuction[nftContract].floorBid, "Must Bid Higher than or equal to Floor");
        address lastBidder;
        
        if (idToAuction[nftContract].totalNFTs <= idToAuction[nftContract].listSize) {
          lastBidder = getTop(idToAuction[nftContract].totalNFTs, nftContract)[idToAuction[nftContract].totalNFTs-1];
        }

        if (lastBidder != address(0)) {
            require(msg.value+idToAuction[nftContract].fundsByBidder[msg.sender] > idToAuction[nftContract].fundsByBidder[lastBidder], "Must bid more than the last highest bidder");
        }

        if (idToAuction[nftContract]._nextBidders[msg.sender] == address(0)) {
          addBidder(msg.sender, msg.value, nftContract);
        } else {
          increaseBid(msg.sender, msg.value, nftContract);
        }

        if (idToAuction[nftContract].endAt - block.timestamp < 300) {
          idToAuction[nftContract].endAt = idToAuction[nftContract].endAt + 300 seconds;
        }

        emit Bid(msg.sender, idToAuction[nftContract].fundsByBidder[msg.sender], block.timestamp, nftContract);
  }

  // Withdraw function for users who are not in the top bids. Anyone not is the top x bids specified by TotalNFTs can withdraw their bid during or after the auction
   
    function withdraw(address nftContract) external payable nonReentrant {
        address[] memory topBidders = getTop(idToAuction[nftContract].totalNFTs, nftContract);
        for (uint i = 0; i < idToAuction[nftContract].totalNFTs; i++) {
          require(topBidders[i] != msg.sender, "Winning Bidders cannot withdraw their bids");
        }
        
        

        uint bal = idToAuction[nftContract].fundsByBidder[msg.sender];
        removeBidder(msg.sender, nftContract);
        
        (bool sent, bytes memory data) = payable(msg.sender).call{value: bal}("");
        require(sent, "Could not withdraw");
        // payable(msg.sender).transfer(bal);


        emit Withdraw(msg.sender, bal, block.timestamp, nftContract);
    }


    // End Auction Function. Administrator must upload metadata in order to mint the NFTs and send to winner of auction
  function end(string memory tokenURI, address nftContract) external nonReentrant{
        require(idToAuction[nftContract].started, "The Auction hasn't started yet.");
        require(block.timestamp >= idToAuction[nftContract].endAt, "Auction is still ongoing!");
        require(!idToAuction[nftContract].ended, "Auction already ended!");
        require(msg.sender == idToAuction[nftContract].payees[1], "Only the seller can end the auction");

        uint nftsMinted = idToAuction[nftContract].totalNFTs;
        _auctionsCreated.increment();
        LiveMintFactory mintContract = LiveMintFactory(nftContract); 

        idToAuction[nftContract].ended = true;
        idToAuction[nftContract].started = false;

        address[] memory winningBidders = getTop(nftsMinted, nftContract);


        for (uint i = 0; i < winningBidders.length; i++) {
            if (winningBidders[i] != address(0)) {

                uint tokenId = mintContract.mint(tokenURI, idToAuction[nftContract].payees[1]);
                
                address ownerOfToken = IERC721(nftContract).ownerOf(tokenId);
                IERC721(nftContract).transferFrom(ownerOfToken, winningBidders[i], tokenId);
                payable(idToAuction[nftContract].payees[1]).transfer(idToAuction[nftContract].fundsByBidder[winningBidders[i]] * idToAuction[nftContract].payeeFees[1]/100);
                payable(idToAuction[nftContract].payees[2]).transfer(idToAuction[nftContract].fundsByBidder[winningBidders[i]] * idToAuction[nftContract].payeeFees[2]/100);
                payable(idToAuction[nftContract].payees[3]).transfer(idToAuction[nftContract].fundsByBidder[winningBidders[i]] * idToAuction[nftContract].payeeFees[3]/100);
              

            } else {

                uint tokenId = mintContract.mint(tokenURI, idToAuction[nftContract].payees[1] );
                address ownerOfToken = IERC721(nftContract).ownerOf(tokenId);
                IERC721(nftContract).transferFrom(ownerOfToken, idToAuction[nftContract].payees[1], tokenId);

            }

        }
        
        emit End(winningBidders, block.timestamp, nftContract);
  }

//   function setTokenURI(uint256 tokenId, string memory tokenURI) public {
//       require(seller == msg.sender, "You don't have authority to change Token URIs");
//       LiveMintFactory mintContract = LiveMintFactory(nftContract); 
//       mintContract.setTokenURI(tokenId, tokenURI);
//   }

}



import "@openzeppelin/contracts/proxy/Clones.sol";
import "hardhat/console.sol";


contract MintFactoryClone is Ownable {
  address public mintFactoryImplementation;
  address[] public NftyTunesAddresses;
  event NftyCoinCreated(address nftyCoin);

  

  constructor(address _mintFactoryImplementation) {
    mintFactoryImplementation = _mintFactoryImplementation;

  }

  function setMintFactoryImplementation(address _mintFactoryImplementation) external onlyOwner {
        mintFactoryImplementation = _mintFactoryImplementation;
  }

  function createERC721Token(string memory name,
      string memory symbol,
      address payable artist,
      uint256 _mintAmount,
      uint96 _royaltyValue
      ) external returns (address) {

        address clone = Clones.clone(mintFactoryImplementation);
        console.log(clone);
        LiveMintFactory mintContract = LiveMintFactory(clone); 
        mintContract.initialize(name, symbol, artist, _mintAmount, _royaltyValue);
        emit NftyCoinCreated(clone);
        return clone;



  }

}


