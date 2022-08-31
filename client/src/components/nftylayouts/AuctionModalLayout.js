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


function AuctionModal({auctionAddress, signerAddress, responsive, editions}) {

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

    const handleStart = async( highestBid, timestamp) => {
        
        let bid = ethers.utils.formatUnits(highestBid.toString(), 'ether')
        let user = await fetchArtistName(signerAddress)
        let ellipsis = "..."
        let date = new Date(timestamp.toNumber()*1000)
        
        let time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
        
        if (user.length === 25) {
            user = ellipsis.concat(signerAddress.slice(33,43))
        } 

        
        setEvents(previousEvents => [...previousEvents, {

            date: time,
            username: user,
            address: signerAddress,
            event: "Auction Started",
            bid: bid
        }])
        
    }

    const sortBids = (events) => {
        const topBids = events.sort((a, b) => parseFloat(a.bid) - parseFloat(b.bid));
        return topBids
    }

    const handleBid = async(sender, amount, timestamp) => {
        
        let bid = ethers.utils.formatUnits(amount.toString(), 'ether')
        let user = await fetchArtistName(sender)
        let ellipsis = "..."
        if (user===undefined) {
            user = ellipsis.concat(sender.slice(33,43))
        }
        if (user.length === 25) {
            user = ellipsis.concat(sender.slice(33,43))
        } 

        let date = new Date(timestamp.toNumber()*1000)
        let time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()

        setEvents(previousEvents => [...previousEvents, {

            date: time,
            username: user,
            address: sender,
            event: "Bid Placed",
            bid: bid
        }])


        
    }

    const handleEnd = async(highestBidder,timestamp) => {
        const users = []
        for (const i in highestBidder) {
            let user = await fetchArtistName(highestBidder[i])
            if (user.length === 25) {
                user = ("...").concat(highestBidder[i].slice(33,43))
            } 
            users.push(user)
        }

        let date = new Date(timestamp.toNumber()*1000)
        let time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
        
        setEvents(previousEvents => [...previousEvents, {

            date: time,
            username: users.join(","),
            address: highestBidder,
            event: "Auction Ended",
            bid: 0
        }])
        
    }

    const handlePastEvents = async(contract) => {
        const filterStart = contract.filters.Start(null, null)
        const startItems = await contract.queryFilter(filterStart)

        for (const i in startItems) {
            handleStart(startItems[i]["args"]["highestBid"], startItems[i]["args"]["timestamp"])
            //handleStart(item.tokenId, item.highestBid)
        }

        const filterBid = contract.filters.Bid(null, null, null)
        const bidItems = await contract.queryFilter(filterBid)
        for (const i in bidItems) {
 
            handleBid(bidItems[i]["args"]["sender"],bidItems[i]["args"]["amount"], bidItems[i]["args"]["timestamp"])
        }

        const filterEnd = contract.filters.End(null, null)
        const endItems = await contract.queryFilter(filterEnd)
        for (const i in endItems) {
            handleEnd(endItems[i]["args"]["winningBidders"], endItems[i]["args"]["timestamp"])
        }

    }

    const sendToEtherscan = async(address) => {
        window.location.href = "http://www.etherscan.io/address/"+address;
    }


    useEffect(async() => {

        const contract = await getContract();
        await handlePastEvents(contract)

        contract.on("Start", await handleStart)
        contract.on("Bid", await handleBid)
        contract.on("End", await handleEnd)

        const uniqEvents = [...events.reduce((map, obj) => map.set(obj.username, obj), new Map()).values()]
        setEvents(uniqEvents)

        return () => {
            contract.removeAllListeners("Start")
            contract.removeAllListeners("Bid")
            contract.removeAllListeners("End")
        }
    }, [])

    

    return (
    
    (responsive) ? (
    <Table striped bordered hover responsive>
      <thead>
        <tr style={{backgroundColor: "black", color: "white"}}>
          <th>Current Winning Bidders</th>
          <th>Current Winning Bids</th>
        </tr>
      </thead>
      <tbody>
        {events && sortBids(events).map((event, index) => {
            return (
                (event.tokenId !== "" && event.event === "Bid Placed" && index < editions) ? 
                (
                    <tr>
                        <td>{event.address}</td>
                        <td>{event.bid}</td> 
                    </tr>
                ) : (<></>)
                
            )
        })}
        
      </tbody>
    </Table>
    ) : (
    <Table striped bordered hover responsive style={{fontSize: 10}}>
      <thead>
        <tr style={{backgroundColor: "black", color: "white"}}>
          <th>Current Winning Bidders</th>
          <th>Current Winning Bids</th>
        </tr>
      </thead>
      <tbody>
        {events && sortBids(events).map((event, index) => {
            return (
                (event.tokenId !== "" && event.event === "Bid Placed" && index < editions) ? 
                (
                    <tr>
                        <td>{event.address}</td>
                        <td>{event.bid}</td> 
                    </tr>
                ) : (<></>)
                
            )
        })}
        
      </tbody>
    </Table>
    )
  );
}

export default AuctionModal;