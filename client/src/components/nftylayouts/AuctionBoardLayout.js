import React, { useState, useEffect } from "react";
import { Link, BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { useMoralisQuery } from "react-moralis";
import { useMoralis, useNFTBalances } from "react-moralis"
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { fetchArtistName, fetchArtistPhoto } from "../nftyFunctions/fetchCloudData"

import { ethers, utils } from 'ethers'
import Web3Modal from 'web3modal';
import { ConnectWallet } from "../nftyFunctions/ConnectWallet"

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import goTo from '../../assets/images/linkGoTo.jpeg'


function AuctionBoard({auctionAddress, signerAddress, responsive, mintNumber}) {

    const [events, setEvents] = useState([{
        tokenId: "",
        username: "",
        address: "",
        event: "",
        bid: ""
    }])
    


    const getContract = async() => {
        
        const signer = await ConnectWallet()

        const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)
        const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);

        return liveAuctionFactoryContract

    }

    const handleStart = async(highestBid, timestamp) => {
        
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
            timestamp: timestamp.toNumber(),
            username: user,
            address: signerAddress,
            event: "Auction Started",
            bid: bid
        }])
        
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
            timestamp: timestamp.toNumber(),
            username: user,
            address: sender,
            event: "Bid Placed",
            bid: bid
        }])


        
    }

    const handleEnd = async(highestBidder, timestamp) => {
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
        
        console.log(highestBidder, timestamp, "END AUCTION")
        setEvents(previousEvents => [...previousEvents, {
  
            date: time,
            timestamp: timestamp.toNumber(),
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
            handleBid(bidItems[i]["args"]["sender"],bidItems[i]["args"]["amount"],bidItems[i]["args"]["timestamp"])
            console.log(bidItems[i]["args"]["sender"],bidItems[i]["args"]["amount"], "THESE ARE THE BIDS")
        }

        const filterEnd = contract.filters.End(null, null)
        const endItems = await contract.queryFilter(filterEnd)
        for (const i in endItems) {
            handleEnd(endItems[i]["args"]["winningBidders"],endItems[i]["args"]["timestamp"])
        }

    }

    const filterEvents = async(currEvents) => {
        currEvents.forEach(function (event, indexI) {
            currEvents.forEach(function(eventTwo, indexJ) {
                if (indexI!==indexJ) {
                    if (event.username===eventTwo.username) {
                        currEvents.splice(indexJ, 1)
                    }
                }
            })
        })
        return currEvents
    }

    const sortEvents = () => {
        let currEvents = events
        
        currEvents.sort((a,b) => {
            if (a.bid !== "" || b.bid !== "") {
                return b.bid-a.bid
            }
        } 
        )

        currEvents.forEach(function (event, i) {
            currEvents.forEach(function (eventTwo, j) {
                if (event.username === eventTwo.username && i !== j && event.bid >= eventTwo.bid) {

                    currEvents.splice(j,1)
                        
                }
            })
        })

        currEvents.forEach(function (event, i) {
            currEvents.forEach(function (eventTwo, j) {
                if (event.username === eventTwo.username && i !== j) {

                    currEvents.splice(j,1)
                        
                }
            })
        })

        setEvents(currEvents.slice(0,parseInt(mintNumber)))
        
    }
        // for(let i = 0; i < events.length; i++) {
        //     for(let j = 0; j < events.length; i++) {
        //         if (i!==j) {
        //             console.log(events[1], j)

        //             if (events[i]['date']=== events[j]['date']) {
        //                 setEvents(events.splice(j, 1))
        //             }
        //         }
        //     i++
        //     } 
        // 


    const sendToEtherscan = async(address) => {
        window.location.href = "http://www.etherscan.io/address/"+address;
    }


    useEffect(async() => {


        const contract = await getContract();
        

        // contract.on("Start", await handleStart)
        // contract.on("Bid", await handleBid)
        // contract.on("End", await handleEnd)

        await handlePastEvents(contract)
        
        return () => {
            contract.removeAllListeners("Start")
            contract.removeAllListeners("Bid")
            contract.removeAllListeners("End")
        }

        
    }, [])

    

    return (
    
    (responsive) ? (
        <>
        <Button onClick={()=>sortEvents()} style={{borderRadius: "2rem", 
        borderColor: "black", backgroundColor: "white", color: "black"}}>Refresh Table</Button>
    <Table striped bordered hover responsive>
      
      <thead>
        <tr style={{backgroundColor: "black", color: "white"}}>
          
          <th>User/Address</th>
          <th>Event</th>
          <th>Bid (Eth)</th>
        </tr>
      </thead>
      <tbody>
        {events && events.map((event, index) => {
            return (
                (event.date !== "") ? (
                    <tr>
                        
                        {(event.username.includes(",")) ? (<td>
                        {event.username}</td>) : (
                        <td>
                        {event.username}</td>)}
                    
                        <td>{event.event}</td>
                        <td>{event.bid}</td>
                    </tr>
                ) : (<></>)
                
            )
        })}
        
      </tbody>
    </Table>
    </>
    ) : (
        <>
        <Row className="py-2">
            <Col style={{float: 'right'}}>
                <Button onClick={()=>sortEvents()} width='5rem' 
                style={{borderRadius: "2rem", borderColor: "black", 
                backgroundColor: "white", color: "black"}}>Get Top Bids</Button>
            </Col>
        </Row>
    <Table striped bordered hover responsive style={{fontSize: 10}}>
        
      <thead>
        <tr style={{backgroundColor: "black", color: "white"}}>
          
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
                        
                        {(event.username.includes(",")) ? (<td>
                        {event.username}</td>) : (
                        <td>
                        {event.username}</td>)}
                    
                        <td>{event.event}</td>
                        <td>{event.bid}</td>
                    </tr>
                ) : (<></>)
                
            )
        })}
        
      </tbody>
    </Table>
    </>
    )
  );
}

export default AuctionBoard;