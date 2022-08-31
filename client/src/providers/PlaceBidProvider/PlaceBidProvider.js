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


  return (
    <PlaceBidContext.Provider value={{ bidSuccess, setBidSuccess, bidLoading, setBidLoading, bidError, 
    setBidError, withdrawSuccess, setWithdrawSuccess, withdrawLoading, setWithdrawLoading, withdrawError, setWithdrawError }}>
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