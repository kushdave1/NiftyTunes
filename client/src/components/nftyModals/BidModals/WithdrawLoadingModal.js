import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

import xicon from '../../../assets/images/xicon.png'
import nftyimg from "../../../assets/images/NT_White_Isotype.png";
import checkmark from "../../../assets/images/checkmark.png"
import error from '../../../assets/images/error.png'

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

import { usePlaceBid } from "../../../providers/PlaceBidProvider/PlaceBidProvider";



function WithdrawLoadingModal(props) {

    const { withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading } = usePlaceBid()
    
    return (
        <Modal show={props.showWithdrawLoadingModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' >
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Withdrawing your bid!
            </Modal.Title>
            <Row style={{padding: "30px 30px 30px 30px"}}>
                <Col sm={7} className="align-self-center">
                    <div>
                    <h4 className="text-start fw-bold mb-0">Withdrawing the <span className="text-primary">Live </span>Bid</h4>
                    <small className='text-muted'>This should only take a minute</small>
                    </div>
                </Col>
                <Col sm={5} className="align-self-center">
                    
                    {(withdrawLoading) ? (<center className="spinner-container">
                        <div className="loading-spinner">
                        </div>
                    </center>) : (withdrawError) ? (<center>
                        <img src={error} width="50px" height="50px"></img>
                    </center>) : (<center>
                        <img src={checkmark} width="50px" height="50px"></img>
                    </center>)}
                   
                </Col>
                
            </Row>
            {withdrawSuccess &&
                <Alert variant='success' className="py-1">
                <i class="bi bi-check-circle-fill"></i>
                {' '} Congratulations! Your Withdrawal has been successful!
                <Alert.Link onClick={() => props.handleCloseWithdrawLoadingModal()}>Go back to Auction Console</Alert.Link>
                </Alert>
            }
            {withdrawError && 
              <Alert variant='danger' >
                <i class="bi bi-check-circle-fill"></i>
                {' '} Your transaction failed
                <Alert.Link onClick={() => props.handleCloseWithdrawLoadingModal()}><br />Go back to Auction Console</Alert.Link>
                </Alert>

            }
      </Modal>
    )
}

export default WithdrawLoadingModal