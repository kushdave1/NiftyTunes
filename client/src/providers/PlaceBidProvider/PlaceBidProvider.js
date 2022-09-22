import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PlaceBidContext from "./PlaceBidContext";

function PlaceBidProvider({ children }) {
  const { web3, Moralis, user } = useMoralis();
  const [bidSuccess, setBidSuccess] = useState(false)
  const [bidLoading, setBidLoading] = useState(true)
  const [bidError, setBidError] = useState(false)

  const [withdrawSuccess, setWithdrawSuccess] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(true)
  const [withdrawError, setWithdrawError] = useState(false)

  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false) 

  const [currentBid, setCurrentBid] = useState(0)
  const [highestBid, setHighestBid] = useState(0)
  const [lowestBid, setLowestBid] = useState(0)
  const [bidAmount, setBidAmount] = useState()
  const [ifWinningBid, setIfWinningBid] = useState(false)


  return (
    <PlaceBidContext.Provider value={{ bidSuccess, setBidSuccess, bidLoading, setBidLoading, bidError, setBidError, 
    withdrawSuccess, setWithdrawSuccess, withdrawLoading, setWithdrawLoading, withdrawError, setWithdrawError,
    started, setStarted, ended, setEnded, currentBid, setCurrentBid, highestBid, setHighestBid, lowestBid, setLowestBid,  
    bidAmount, setBidAmount, ifWinningBid, setIfWinningBid}}>
      {children}
    </PlaceBidContext.Provider>
  );
}

function usePlaceBid() {
  const context = React.useContext(PlaceBidContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { PlaceBidProvider, usePlaceBid };