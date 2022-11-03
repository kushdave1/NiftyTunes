import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

import xicon from '../../assets/images/xicon.png'
import nftyimg from '../../assets/images/NT_White_Isotype.png'

import ProductListLayout from '../nftylayouts/ProductListLayout'

import LiveNFTTokenIds from '../nftymarketplace/LiveNFTTokenIds__'


import legendaryband from '../../assets/images/legendaryband.png'

import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Alert from 'react-bootstrap/Alert'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'

import { usePlaceBid } from "../../providers/PlaceBidProvider/PlaceBidProvider";
import { PlaceBid } from "../nftyFunctions/PlaceBid"
import Vector23 from '../../assets/images/Vector White.png'



function SeeNFTsModal(props) {

    const { bidSuccess, setBidSuccess, bidError, setBidError, bidLoading, setBidLoading } = usePlaceBid()
    const [bidAmount, setBidAmount] = useState()

    useEffect(() => {

        for (const i in props.auction['auctionData']) {
            if (props.auction['auctionData'][i]['tier'] === props.tier) {
                props.auction['mintAddress'] = props.auction['auctionData'][i]['mintAddress']
                props.auction['auctionAddress'] = props.auction['auctionData'][i]['auctionAddress']
                props.auction['nftsToMint'] = props.auction['auctionData'][i]['totalNFTs']
                props.auction['tier'] = props.tier
            }
        }


    }, [props.showBidModal])

    const XFull = () => {
        return (
            <div style={{cursor: "pointer", width: "25px", height: "25px"}} onClick={()=>props.handleCloseBidModal()}>
                <XButton src={Vector23}/>
                <XButton2 src={Vector23}/>
            </div>
        )
    }

    return (
    <>
    {props.showBidModal && 
    <NFTModal>
        <XFull/>
        <NFTSubSection>
        
            <NFTLabel>{props.tier}</NFTLabel>
            <MarketRow>
                

                
                    
                <ProductListLayout>
                    <LiveNFTTokenIds auction={props.auction} responsive={true} mintAddress={props.mintAddress} auctionAddress={props.auctionAddress}/>
                </ProductListLayout>    
                    
               
            </MarketRow>
        </NFTSubSection>
        
    </NFTModal>}




    </>
    )
}

export default SeeNFTsModal


const MarketRow = styled.div`

    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    width: 1300px;
    height: 382px;
`


const NFTModal = styled.div`
position: fixed;
width: 90vw;
height: 90vh;
z-index: 4;
left: 5%;
top: 5%;

background: black;
`

const NFTSubSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 80px;

position: absolute;
width: 1300px;
height: 570px;
left: 70px;
top: 80px;

`

const NFTLabel = styled.div`
width: 487px;
height: 168px;

/* H1 */

font-family: 'Druk Cyr';

font-weight: 900;
font-size: 180px;
line-height: 168px;
/* identical to box height */

text-transform: uppercase;

color: #FFFFFF;
`



const XButton = styled.img`
    position: absolute;
    width: 24px;
    height: 24px;
    right: 24px;
    top: 24px;
`

const XButton2 = styled.img`
    position: absolute;
    width: 24px;
    height: 24px;
    right: 24px;
    top: 24px;
    transform: rotate(-90deg);
`


