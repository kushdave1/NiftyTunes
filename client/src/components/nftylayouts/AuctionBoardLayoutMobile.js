import React, { useState, useEffect } from "react";
import { Link, BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { useMoralisQuery } from "react-moralis";
import { useMoralis, useNFTBalances } from "react-moralis"
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { fetchArtistName, fetchArtistPhoto } from "../nftyFunctions/fetchCloudData"
import Moralis from 'moralis'

import { ethers, utils } from 'ethers'
import Web3Modal from 'web3modal';
import { ConnectWallet } from "../nftyFunctions/ConnectWallet"
import { GetProvider } from '../nftyFunctions/GetProvider'
import DefaultProfilePicture from '../../assets/images/gorilla.png';


import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import styled from 'styled-components'

import goTo from '../../assets/images/linkGoTo.jpeg'
import LiveMintAuctionProxy from '../../contracts/LiveMintFactoryWAuction.sol/LiveMintAuctionFactoryStorage.json';


function AuctionBoardMobile({auctionAddress, signerAddress, responsive, mintNumber, indexNumber, mintAddress}) {

    const [events, setEvents] = useState([])
    const { isInitialized, isAuthenticated, user } = useMoralis()
    const [bid, setBid] = useState(false)

    const handleBid = () => {
        if (bid === false) {
            setBid(true)
        } else {
            setBid(false)
        }
        
    }
    


    const getContract = async() => {
        
        let signer
        let liveAuctionFactory
        let liveAuctionFactoryContract

        if (isAuthenticated) {
            signer = await ConnectWallet()
            if (auctionAddress === "0xDDeB92CbB5A97C3C75FcA2f498BA3d3Ce8E5D429") {  
                liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuctionProxy.abi, signer)
            } else {
                liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuction.abi, signer)
            }

        } else {
            signer = GetProvider()
            if (auctionAddress === "0xDDeB92CbB5A97C3C75FcA2f498BA3d3Ce8E5D429") {  
                liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuctionProxy.abi, signer)
            } else {
                liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuction.abi, signer)
            }
            console.log(liveAuctionFactoryContract.provider, "FOL")
        }

        return liveAuctionFactoryContract

    }

    

    const PopulateBids = () => {
        if (events.length < 10) {
            for (const i in Array.from(Array(10).keys())) {
                setEvents(previousEvents => [...previousEvents, {
                    date: "01-01-2020",
                    timestamp: "12:00",
                    username: "Empty",
                    userphoto: "Empty",
                    address: "0x0",
                    event: "Bid Placed",
                    bid: "0.00"
                }])
            }
        }
        console.log(events)
    }

    const { fetch } = useMoralisQuery(
        "LiveAuctions",
        (query) => query.equalTo("auctionAddress", mintAddress),
        [],
        { autoFetch: false }
    );

    const getBids = async() => {
        const LiveAuction = Moralis.Object.extend("LiveAuctions")
        const liveAuction = new LiveAuction()

        const auctionQuery = await fetch()

        return auctionQuery

    }



    const filterSortOneEvent = async(bidItems) => {

        /// convert Bid and User Data into Readable form


        let bid = ethers.utils.formatUnits((bidItems["args"]["amount"]).toString(), 'ether')
        let user = await fetchArtistName(bidItems["args"]["sender"])
        let userPhoto = await fetchArtistPhoto(bidItems["args"]["sender"])
        let ellipsis = "..." 
        if (user===undefined) {
            user = ellipsis.concat(bidItems["args"]["sender"].slice(33,43))
        }
        if (user.length === 25) {
            user = ellipsis.concat(bidItems["args"]["sender"].slice(33,43))
        } 

        let date = new Date((bidItems["args"]["timestamp"]).toNumber()*1000)
        let dateTwo = (date.getMonth()+1)+"-"+date.getDate()+"-"+date.getFullYear()
        let time = date.getHours()+":"+date.getMinutes()

        let item = {
            date: dateTwo,
            timestamp: time,
            username: user,
            userphoto: userPhoto,
            address: bidItems["args"]["sender"],
            event: "Bid Placed",
            bid: bid
        }

        return item

    }


    const filterSortEvents = async(bidItems) => {
        let items = []
        for (const i in bidItems) {

            /// convert Bid and User Data into Readable form


            let bid = ethers.utils.formatUnits((bidItems[i]["args"]["amount"]).toString(), 'ether')
            let user = await fetchArtistName(bidItems[i]["args"]["sender"])
            let userPhoto = await fetchArtistPhoto(bidItems[i]["args"]["sender"])
            let ellipsis = "..." 
            if (user===undefined) {
                user = ellipsis.concat(bidItems[i]["args"]["sender"].slice(33,43))
            }
            if (user.length === 25) {
                user = ellipsis.concat(bidItems[i]["args"]["sender"].slice(33,43))
            } 

            let date = new Date((bidItems[i]["args"]["timestamp"]).toNumber()*1000)
            let dateTwo = (date.getMonth()+1)+"-"+date.getDate()+"-"+date.getFullYear()
            let time = date.getHours()+":"+date.getMinutes()

            let item = {
  
                date: dateTwo,
                timestamp: time,
                username: user,
                userphoto: userPhoto,
                address: bidItems[i]["args"]["sender"],
                event: "Bid Placed",
                bid: bid

            }

            items.push(item)

            //handleBid(bidItems[i]["args"]["sender"],bidItems[i]["args"]["amount"],bidItems[i]["args"]["timestamp"])
        }

        items.sort((a,b) => {
            if (a.bid !== "" || b.bid !== "") {
                return b.bid-a.bid
            }
        } 
        )

        items.forEach(function (event, i) {
            items.forEach(function (eventTwo, j) {
                if (event.username === eventTwo.username && i !== j && event.bid >= eventTwo.bid) {

                    items.splice(j,1)
                        
                }
            })
        })

        return items
    }

    const filterSortItems = (items) => {
        items.sort((a,b) => {
            if (a.bid !== "" || b.bid !== "") {
                return b.bid-a.bid
            }
        } 
        )

       let counter = 0
        let itemsTwo = items
        let i = 0
        let j = 0

        while (i < items.length) {
            while (j < items.length) {
                if (items[i].username === items[j].username && items[i].bid >= items[j].bid && i !== j) {
                    items.splice(j,1)
                    j = 0
                    i = 0
                } else {
                    
                    j+=1
                }

            }
            i+=1
            j=0
        }
                
        
        
        return items
    }


    const handlePastEvents = async(contract) => {

        
        let filterBid
        if (auctionAddress === "0xDDeB92CbB5A97C3C75FcA2f498BA3d3Ce8E5D429") {  
            filterBid = contract.filters.Bid(null, null, null, mintAddress)
        } else {
            filterBid = contract.filters.Bid(null, null, null)
        }
        
        const bidItems = await contract.queryFilter(filterBid)
    
        const cachedBidItems = await getBids()
        let itemsFinal

        if (cachedBidItems.length === 0) {
            itemsFinal = await filterSortEvents(bidItems)
            

            const LiveAuction = Moralis.Object.extend("LiveAuctions")
            const liveAuction = new LiveAuction()

            liveAuction.set("auctionAddress", mintAddress)
            liveAuction.set("bids", itemsFinal)
            await liveAuction.save()

        } else {

            const totalBids = cachedBidItems[0].get("bids")
            

            for (const i in bidItems) {
                let bid = ethers.utils.formatUnits((bidItems[i]["args"]["amount"]).toString(), 'ether')
                let address = bidItems[i]["args"]["sender"]
                let itemFinal
                let newItems = []
                
                for (const j in totalBids) {
                    if (totalBids[j].bid === bid && totalBids[j].address === address) {
                        break
                    } else if (j === totalBids.length) {
                        itemFinal = await filterSortOneEvent(bidItems[i])
                        totalBids.push(itemFinal)
                    }
                }
            } 

            itemsFinal = filterSortItems(totalBids)


            const auctionQuery = await getBids()

            auctionQuery[0].set("bids", itemsFinal)
            await auctionQuery[0].save()   



        }
        

        setEvents(itemsFinal)


    }

   

    useEffect(async() => {

        const contract = await getContract();
        await handlePastEvents(contract)
        

        // contract.on("Start", await handleStart)
        contract.on("Bid", await handleBid)
        // contract.on("End", await handleEnd)

        


        
        return () => {
            contract.removeAllListeners("Bid")

        }

        
    }, [])

    

    return (
    
        <>
    <Table responsive
    style={{display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "0px",
        gap: "2px",
        
        width: "330px",
        height: "502px",
        
        /* white */
        
        background: "#FFFFFF"}}>
            {/* <tbody>
            {Array.from(Array(10).keys()).map((event, index) => {
                <tr>
                    <td>{event}</td>
                </tr>
            })}
            </tbody> */}
        <tbody>
            {events && events.map((event, index) => {
                return(
                    <>
                {(index < mintNumber) ? (
                    <AuctionUnitHighlighted>
                    <AuctionBoardBox>
                        <BidList>
                            <UserInfo>
                                <BidNumber>
                                #<div style={{color: "black", fontFamily: "Graphik LCG Regular"}}>{index+1}</div>
                                </BidNumber>
                            </UserInfo>
                            <BidderInfo>
                                {(event.userphoto && event.userphoto !== "Empty") ? (<BidderPhoto crossOrigin='true' crossoriginresourcepolicy='false' src={event.userphoto}/>) : (<BidderPhoto src={DefaultProfilePicture}/>)}
                                <BidderName>{event.username}</BidderName>
                            </BidderInfo>
                            <BidTime>
                                <BidTimeDate>
                                    {event.date} {event.timestamp}
                                </BidTimeDate>
                                <BidAmount>
                                    {event.bid} ETH
                                </BidAmount>
                            </BidTime>
                            
                        </BidList>
                    </AuctionBoardBox>
                </AuctionUnitHighlighted>) : (
                    <AuctionUnit>
                    <AuctionBoardBox>
                        <BidList>
                            <UserInfo>
                                <BidNumber>
                                #<div style={{color: "black", fontFamily: "Graphik LCG Regular"}}>{index+1}</div>
                                </BidNumber>
                            </UserInfo>
                            <BidderInfo>
                                {(event.userphoto && event.userphoto !== "Empty") ? (<BidderPhoto crossOrigin='true' crossoriginresourcepolicy='false' src={event.userphoto}/>) : (<BidderPhoto src={DefaultProfilePicture}/>)}
                                <BidderName>{event.username}</BidderName>
                            </BidderInfo>
                            <BidTime>
                                <BidTimeDate>
                                    {event.date} {event.timestamp}
                                </BidTimeDate>
                                <BidAmount>
                                    {event.bid} ETH
                                </BidAmount>
                            </BidTime>
                            
                        </BidList>
                    </AuctionBoardBox>
                </AuctionUnit>
                )}
                </>
                )
            })}
            
        </tbody>
        
    </Table>
    </>
    )
}

export default AuctionBoardMobile;

const AuctionUnit = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 10px;

width: 330px;
height: 61px;

overflow: hidden;
/* white */

background: #FFFFFF;
`

const AuctionUnitHighlighted = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 10px;

width: 330px;
height: 61px;
overflow: hidden;

/* white */

background: #CACACA;
`

const AuctionBoardBox = styled.div`
display: flex;
flex-direction: column;
align-items: center;
padding: 0px;
gap: 10px;

width: 310px;
height: 51px;
`

const BidList = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 0px 10px;
gap: 106px;

width: 310px;
height: 41px;
`

const UserInfo = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 0px;
gap: 23px;

width: 161px;
height: 34px;

`

const BidNumber = styled.div`
width: 23px;
height: 33px;

/* Caption */

font-family: 'Montserrat';
font-style: normal;
font-weight: 600;
font-size: 24px;
line-height: 15px;
/* or 54% */

text-transform: uppercase;

color: rgba(0, 0, 0, 0.2);
`

const BidderInfo = styled.div`
display: flex;
flex-direction: row;
align-items: center;
margin-left: -100px;
padding: 0px;
gap: 10px;

width: 115px;
height: 34px;
`

const BidderPhoto = styled.img`
width: 34px;
height: 34px;
border-radius: 80px;
`

const BidderName = styled.div`
width: 71px;
height: 24px;

/* text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 18px;
line-height: 24px;
/* identical to box height, or 133% */
white-space: nowrap;


color: #000000;
`

const BidTime = styled.div`
display: flex;
flex-direction: column;
align-items: flex-end;
padding-right: 20px;
gap: 7px;

width: 101px;
height: 41px;
`

const BidTimeDate = styled.div`
width: 101px;
height: 16px;

/* small text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 16px;
white-space: nowrap;
/* identical to box height, or 114% */
margin-right: 5px;
text-align: right;

color: #000000;
`

const BidAmount = styled.div`
width: 66px;
height: 18px;

/* Caption small */

font-family: 'Graphik LCG';

font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
white-space: nowrap;
/* identical to box height, or 112% */

text-align: right;
text-transform: uppercase;
margin-left: auto;
color: #000000;
`


