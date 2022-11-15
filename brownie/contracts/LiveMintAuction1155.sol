//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "OpenZeppelin/openzeppelin-contracts@4.8.0/contracts/utils/Counters.sol";
import "OpenZeppelin/openzeppelin-contracts@4.8.0/contracts/security/ReentrancyGuard.sol";
import "OpenZeppelin/openzeppelin-contracts@4.8.0/contracts/access/Ownable.sol";

import "OpenZeppelin/openzeppelin-contracts@4.8.0/contracts/proxy/Clones.sol";

import "./LiveMintFactory1155.sol";


contract LiveAuctions is Ownable, ReentrancyGuard {

  using Counters for Counters.Counter;
  Counters.Counter public _auctionsCreated;

  address public mintFactoryImplementation;

  event Start(uint highestBid, uint256 timestamp, address indexed nftContract);
  event End(address[] winningBidders, uint256 timestamp, address indexed nftContract);
  event Bid(address indexed sender, uint amount, uint256 timestamp, address indexed nftContract);
  event Withdraw(address indexed bidder, uint amount, uint256 timestamp, address indexed nftContract);
  event NftyCoinCreated(address nftyCoin);

  uint public constant LEGENDARY = 1999555280405868409465;
  uint public constant RARE = 1918988901;
  uint public constant COMMON = 109330228408174;

  struct NFTAuction {

    mapping(uint => address) payees;
    mapping(uint => uint) payeeFees;
    mapping(uint => uint) floor;
    mapping(uint => uint) supply;
    uint numberOfPayees;
    
    bool started;
    bool ended;
    uint endAt;
    uint timeOfAuction;
    address nftContract;
    
    uint totalNFTs;
    uint listSize;
    
    
    mapping(address => uint) fundsByBidder;
    mapping(address => address) _nextBidders;

  }

  event AuctionCreated(
    address nftContract,
    string name,
    address[] payees,
    uint[] payeeFees
    );

  mapping(address => NFTAuction) public idToAuction;

  
  address constant GUARD = address(1);

  constructor(
    address _mintFactoryImplementation
  ) {
    mintFactoryImplementation = _mintFactoryImplementation;
  }

  function createAuction(
      string memory name,
      string memory symbol,
      string memory defaultURI,
      uint96 _royaltyValue,
      address[] calldata payees,
      uint256[] calldata fees
  ) public onlyOwner {
    // in the future, can relax onlyOwner for public protocol
    require (payees.length > 0, "Must have payees");
    require(payees.length == fees.length, "Length of payees and fee percentages must match");

    address _nftContract = Clones.clone(mintFactoryImplementation);
    LiveMintFactory mintContract = LiveMintFactory(_nftContract); 
    mintContract.initialize(name, symbol, defaultURI, payees[0], _royaltyValue);
    emit NftyCoinCreated(_nftContract);

    //createCollection(name, symbol, defaultURI, payees[0], _royaltyValue);
    NFTAuction storage auction = idToAuction[_nftContract];

    auction.numberOfPayees = payees.length;
    
    uint _payeeTotal = 0;

    for (uint i=0; i<auction.numberOfPayees; ++i){
      _payeeTotal += fees[i];
      auction.payees[i] = payees[i];
      auction.payeeFees[i] = fees[i];
    }

    require(_payeeTotal == 100, "Split percentage must equal 100");

    auction.nftContract = _nftContract;

    emit AuctionCreated(
      _nftContract,
      name,
      payees,
      fees
    );
    
  }
  
// ███████  ██████  ██████  ████████ ██ ███    ██  ██████  
// ██      ██    ██ ██   ██    ██    ██ ████   ██ ██       
// ███████ ██    ██ ██████     ██    ██ ██ ██  ██ ██   ███ 
//      ██ ██    ██ ██   ██    ██    ██ ██  ██ ██ ██    ██ 
// ███████  ██████  ██   ██    ██    ██ ██   ████  ██████  
                                                        
                                                        
  function addBidder(address bidder, uint256 bid_, address nftContract) internal {
    // This check is redundant since the only time it gets called is when this is the case
    // require(idToAuction[nftContract]._nextBidders[bidder] == address(0), "You must increase the bid to add a bidder");
    
    address index = _findIndex(bid_, nftContract);
    idToAuction[nftContract].fundsByBidder[bidder] = bid_;
    idToAuction[nftContract]._nextBidders[bidder] = idToAuction[nftContract]._nextBidders[index];
    idToAuction[nftContract]._nextBidders[index] = bidder;
    idToAuction[nftContract].listSize++;
  }

  function increaseBid(address bidder, uint256 bid_, address nftContract) internal {
    
    require(idToAuction[nftContract]._nextBidders[bidder] != address(0));
    
    uint newBid = idToAuction[nftContract].fundsByBidder[bidder] + bid_;
    
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

  function getTop(address nftContract) public view returns(address[] memory) {
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
    // 
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



//  ██████  ███████ ████████ ████████ ███████ ██████  ███████ 
// ██       ██         ██       ██    ██      ██   ██ ██      
// ██   ███ █████      ██       ██    █████   ██████  ███████ 
// ██    ██ ██         ██       ██    ██      ██   ██      ██ 
//  ██████  ███████    ██       ██    ███████ ██   ██ ███████

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

  function getLowestBid(address nftContract) public view returns (uint256) {
      address[] memory bidders = getTop(nftContract);
      uint topLength = bidders.length;
      return idToAuction[nftContract].fundsByBidder[bidders[topLength-1]];
  }

  function getHighestBid(address nftContract) external view returns (uint256) {
      address[] memory bidders = getTop(nftContract);
      return idToAuction[nftContract].fundsByBidder[bidders[0]];
  }

  function canWithdraw(address nftContract, address withdrawer) public view returns (uint) {
    uint bal = idToAuction[nftContract].fundsByBidder[withdrawer];
    if (bal < getLowestBid(nftContract) && bal > 0) {
      return bal;
    } else {
      return 0;
    }
  }


//  █████  ██████  ███    ███ ██ ███    ██ 
// ██   ██ ██   ██ ████  ████ ██ ████   ██ 
// ███████ ██   ██ ██ ████ ██ ██ ██ ██  ██ 
// ██   ██ ██   ██ ██  ██  ██ ██ ██  ██ ██ 
// ██   ██ ██████  ██      ██ ██ ██   ████ 
                                        

  // Start the auction

  function start(
    uint timeOfAuction,
    uint commonFloor,
    uint rareFloor,
    uint legendaryFloor,
    uint maxCommon,
    uint maxRare,
    uint maxLegendary,
    address nftContract
  ) external nonReentrant {
        require(!idToAuction[nftContract].started, "Already Started!");
        require(msg.sender == idToAuction[nftContract].payees[0], "You are not the contract owner");


        idToAuction[nftContract].totalNFTs = maxCommon + maxRare + maxLegendary;
        idToAuction[nftContract]._nextBidders[GUARD] = GUARD;

        idToAuction[nftContract].started = true;
        idToAuction[nftContract].ended = false;
        idToAuction[nftContract].endAt = block.timestamp + (timeOfAuction * 1 minutes);
        idToAuction[nftContract].floor[COMMON] = commonFloor;
        idToAuction[nftContract].floor[LEGENDARY] = legendaryFloor;
        idToAuction[nftContract].floor[RARE] = rareFloor;
        idToAuction[nftContract].supply[LEGENDARY] = maxLegendary;
        idToAuction[nftContract].supply[RARE] = maxRare;
        idToAuction[nftContract].supply[COMMON] = maxCommon;

        emit Start(idToAuction[nftContract].floor[COMMON], block.timestamp, nftContract);

  }

  


  // End Auction Function. Administrator must upload metadata in order to mint the NFTs and send to winner of auction
  function end(
    string memory legendaryTokenURI,
    string memory rareTokenURI,
    string memory commonTokenURI,
    address nftContract) external nonReentrant{
        require(idToAuction[nftContract].started, "The Auction hasn't started yet.");
        require(block.timestamp >= idToAuction[nftContract].endAt, "Auction is still ongoing!");
        require(!idToAuction[nftContract].ended, "Auction already ended!");
        require(msg.sender == idToAuction[nftContract].payees[0], "Only the seller can end the auction");

        _auctionsCreated.increment();
        
        idToAuction[nftContract].ended = true;
        idToAuction[nftContract].started = false;

        LiveMintFactory mintContract = LiveMintFactory(nftContract); 
        
        mintContract.setTokenURI(LEGENDARY, legendaryTokenURI);
        mintContract.setTokenURI(RARE, rareTokenURI);
        mintContract.setTokenURI(COMMON, commonTokenURI);

        address[] memory winningBidders = getTop(nftContract);

        uint[] memory payments = new uint[](idToAuction[nftContract].numberOfPayees);
        uint rareToMint = idToAuction[nftContract].supply[RARE];
        uint commonToMint = idToAuction[nftContract].supply[COMMON];
        uint legendaryToMint = idToAuction[nftContract].supply[LEGENDARY];

        for (uint i = 0; i < winningBidders.length; i++) {
            if (winningBidders[i] != address(0)) {

              if (i < idToAuction[nftContract].supply[LEGENDARY] && idToAuction[nftContract].fundsByBidder[winningBidders[i]] >= idToAuction[nftContract].floor[LEGENDARY]){
                // Mint legendary
                mintContract.mint(winningBidders[i], LEGENDARY);
                legendaryToMint--;
                
              } else {
                if (
                  i < idToAuction[nftContract].supply[RARE] + idToAuction[nftContract].supply[LEGENDARY] &&
                  idToAuction[nftContract].fundsByBidder[winningBidders[i]] >= idToAuction[nftContract].floor[RARE] &&
                  rareToMint > 0
                  ) {
                  // Mint rare
                  mintContract.mint(winningBidders[i], RARE);
                  rareToMint--;
                } else {
                    // Mint Common
                    if( commonToMint > 0){
                      mintContract.mint(winningBidders[i], COMMON);
                      commonToMint--;
                    }
                    
                }
              }
              for (uint ii = 0; ii < idToAuction[nftContract].numberOfPayees; ++ii){
                payments[ii] += idToAuction[nftContract].fundsByBidder[winningBidders[i]] * idToAuction[nftContract].payeeFees[ii]/100;
              }

            }
            
        }
       
        // Mint leftovers directly to artist
        if (commonToMint + rareToMint + legendaryToMint > 0){

            uint leftover_size = 0;
            if (legendaryToMint > 0) {
              leftover_size += 1;
            }
            if (rareToMint > 0) {
              leftover_size += 1;
            }
            if (commonToMint > 0) {
              leftover_size += 1;
            }
            uint[] memory leftover_amounts = new uint[](leftover_size);
            uint[] memory leftover_tokens = new uint[](leftover_size);

            if (legendaryToMint > 0) {
              leftover_amounts[leftover_size - 1] = legendaryToMint;
              leftover_tokens[leftover_size - 1] = LEGENDARY;
              leftover_size -= 1;
            }
            if (rareToMint > 0) {
              leftover_amounts[leftover_size - 1] = rareToMint;
              leftover_tokens[leftover_size - 1] = RARE;
              leftover_size -= 1;
            }
            if (commonToMint > 0) {
              leftover_amounts[leftover_size - 1] = commonToMint;
              leftover_tokens[leftover_size - 1] = COMMON;
              leftover_size -= 1;
            }

            mintContract.mintBatch(idToAuction[nftContract].payees[0], leftover_tokens, leftover_amounts);
        }

        // Reduce totalNFTs to the number actually minted so that withdrawls can be made for those who didn't qualify
        idToAuction[nftContract].totalNFTs = idToAuction[nftContract].totalNFTs - commonToMint + rareToMint + legendaryToMint;
        
        
        
        for (uint ii = 0; ii < idToAuction[nftContract].numberOfPayees; ++ii){
          (bool sent, ) = payable(idToAuction[nftContract].payees[ii]).call{value: payments[ii]}("");
          require(sent, "Failed to send ETH");
        }
        
        emit End(winningBidders, block.timestamp, nftContract);
  }

// ██    ██ ███████ ███████ ██████  
// ██    ██ ██      ██      ██   ██ 
// ██    ██ ███████ █████   ██████  
// ██    ██      ██ ██      ██   ██ 
//  ██████  ███████ ███████ ██   ██ 

  // bid function that allows a user to bid on the auction to win an NFT

  function bid(address nftContract) external payable {
        require(idToAuction[nftContract].started, "Not started.");
        require(block.timestamp < idToAuction[nftContract].endAt, "Ended!");
        
        address lastBidder;
        
        // if there are more bidders than NFTs
        if (idToAuction[nftContract].totalNFTs <= idToAuction[nftContract].listSize) {
          // lastBidder = lowest high bidder
          lastBidder = getTop(nftContract)[idToAuction[nftContract].totalNFTs-1];
        }

        // if there exists a lowest high bidder
        if (lastBidder != address(0)) {
            require(msg.value+idToAuction[nftContract].fundsByBidder[msg.sender] > idToAuction[nftContract].fundsByBidder[lastBidder], "Must bid more than the last highest bidder");
        } else {
            require(msg.value+idToAuction[nftContract].fundsByBidder[msg.sender] >= idToAuction[nftContract].floor[COMMON], "Must Bid Higher than or equal to Floor");
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
        // address[] memory topBidders = getTop(nftContract);
        
        // Can we just compare the amount they've bid against the lowest qualifying bid instead of looping through?
        // for (uint i = 0; i < idToAuction[nftContract].totalNFTs; i++) {
        //  require(topBidders[i] != msg.sender, "Winning Bidders cannot withdraw their bids");
        // }
        uint bal = canWithdraw(nftContract, _msgSender());
        require(bal > 0, "Unable to withdraw");
        
        removeBidder(msg.sender, nftContract);
        
        (bool sent, ) = payable(msg.sender).call{value: bal}("");
        require(sent, "Could not withdraw");
        // payable(msg.sender).transfer(bal);

        emit Withdraw(msg.sender, bal, block.timestamp, nftContract);
        
    }


}

