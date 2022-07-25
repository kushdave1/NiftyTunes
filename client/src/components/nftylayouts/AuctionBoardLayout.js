import React, { useState, useEffect } from "react";
import { Link, BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { useMoralisQuery } from "react-moralis";
import { useMoralis, useNFTBalances } from "react-moralis"
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { fetchArtistName, fetchArtistPhoto } from "../nftyFunctions/fetchCloudData"

import { ethers, utils } from 'ethers'
import Web3Modal from 'web3modal';

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import goTo from '../../assets/images/linkGoTo.jpeg'


function AuctionBoard({auctionAddress, signerAddress}) {

    const [events, setEvents] = useState([{
        tokenId: "",
        username: "",
        address: "",
        event: "",
        bid: ""
    }])
    


    const getContract = async() => {

        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)
        const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);

        return liveAuctionFactoryContract

    }

    const handleStart = async(tokenId, highestBid) => {
        let bid = ethers.utils.formatUnits(highestBid.toString(), 'ether')
        let user = await fetchArtistName(signerAddress)
        let ellipsis = "..."
        if (user.length === 25) {
            user = ellipsis.concat(signerAddress.slice(33,43))
        } 

        let item = {
            tokenId: tokenId.toNumber(),
            username: user,
            address: signerAddress,
            event: "Auction Started",
            bid: bid
        }
        
        setEvents(previousEvents => [...previousEvents, {
            tokenId: tokenId.toNumber(),
            username: user,
            address: signerAddress,
            event: "Auction Started",
            bid: bid
        }])
        
    }

    const handleBid = async(sender, amount, tokenId) => {
        
        let bid = ethers.utils.formatUnits(amount.toString(), 'ether')
        let user = await fetchArtistName(sender)
        let ellipsis = "..."
        if (user.length === 25) {
            user = ellipsis.concat(sender.slice(33,43))
        } 

        setEvents(previousEvents => [...previousEvents, {
            tokenId: tokenId.toNumber(),
            username: user,
            address: sender,
            event: "Bid Placed",
            bid: bid
        }])
        
    }

    const handleEnd = async(highestBidder, highestBid, tokenId) => {
        let bid = ethers.utils.formatUnits(highestBid.toString(), 'ether')
        let user = await fetchArtistName(highestBidder)
        if (user.length === 25) {
            user = ("...").concat(highestBidder.slice(33,43))
        } 

      
        setEvents(previousEvents => [...previousEvents, {
            tokenId: tokenId.toNumber(),
            username: user,
            address: highestBidder,
            event: "Auction Ended",
            bid: bid
        }])
        
    }

    const handlePastEvents = async(contract) => {
        const filterStart = contract.filters.Start(null, null)
        const startItems = await contract.queryFilter(filterStart)
        for (const i in startItems) {
            handleStart(startItems[i]["args"]["tokenId"],startItems[i]["args"]["highestBid"])
            //handleStart(item.tokenId, item.highestBid)
        }

        const filterBid = contract.filters.Bid(null, null, null)
        const bidItems = await contract.queryFilter(filterBid)
        for (const i in bidItems) {
            handleBid(bidItems[i]["args"]["sender"],bidItems[i]["args"]["amount"],bidItems[i]["args"]["tokenId"])
        }

        const filterEnd = contract.filters.End(null, null, null)
        const endItems = await contract.queryFilter(filterEnd)
        for (const i in endItems) {
            handleEnd(endItems[i]["args"]["highestBidder"],endItems[i]["args"]["highestBid"],endItems[i]["args"]["tokenId"])
        }

    }

    const sendToEtherscan = async(address) => {
        window.location.href = "http://www.etherscan.io/address/"+address;
    }


    useEffect(async() => {

        const contract = await getContract();
        await handlePastEvents(contract)

        // contract.on("Start", await handleStart)
        // contract.on("Bid", await handleBid)
        // contract.on("End", await handleEnd)
        

        return () => {
            contract.removeAllListeners("Start")
            contract.removeAllListeners("Bid")
            contract.removeAllListeners("End")
        }
    }, [])

    

    return (
    <Table striped bordered hover>
      <thead>
        <tr style={{backgroundColor: "black", color: "white"}}>
          <th>NFT #</th>
          <th>User/Address</th>
          <th>Event</th>
          <th>Bid (Eth)</th>
        </tr>
      </thead>
      <tbody>
        {events && events.map((event, index) => {
            return (
                (event.tokenId !== "") ? (
                    <tr>
                        <td>{event.tokenId}</td>
                        
                        <td><a href={`http://www.etherscan.io/address/${event.address}`} target="_blank" style={{textDecoration: "none", display: "inline"}}>
                        {event.username}<img src={goTo} height="20px" width="20px" style={{display: "inline"}}/></a></td>
                        
                        <td>{event.event}</td>
                        <td>{event.bid}</td>
                    </tr>
                ) : (<></>)
                
            )
        })}
        
      </tbody>
    </Table>
  );
}

export default AuctionBoard;