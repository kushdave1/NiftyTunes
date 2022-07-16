// import React from 'react';
// import Cards from 'react-credit-cards';
// import 'react-credit-cards/es/styles-compiled.css';
// import SubmitCreditCardButton from '../nftyFunctions/SubmitCreditCard'

// import Button from 'react-bootstrap/Button'
// import Row from "react-bootstrap/Row"
// import Card from 'react-bootstrap/Card'
// import Badge from 'react-bootstrap/Badge'
// import Spinner from 'react-bootstrap/Spinner'
// import Dropdown from 'react-bootstrap/Dropdown'
// import DropdownButton from 'react-bootstrap/DropdownButton'
// import Nav from 'react-bootstrap/Nav'
// import Modal from 'react-bootstrap/Modal'
// import Form from 'react-bootstrap/Form'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'
// import FloatingLabel from 'react-bootstrap/FloatingLabel'
// import { Tooltip, Spin, Input } from "antd";
// import Moralis from 'moralis'


 
// export default class PaymentForm extends React.Component {
//   state = {
//     username: '',
//     password: '',
//     cvc: '',
//     expiry: '',
//     focus: '',
//     name: '',
//     number: '',
//   };
 
//   handleInputFocus = (e) => {
//     this.setState({ focus: e.target.name });
//   }
  
//   handleInputChange = (e) => {
//     const { name, value } = e.target;
//     this.setState({ [name]: value });
//   }
  
//   render() {
//     return (
//       <div id="PaymentForm">
//         <Cards
//           cvc={this.state.cvc}
//           expiry={this.state.expiry}
//           focused={this.state.focus}
//           name={this.state.name}
//           number={this.state.number}
//         />
//         <Form style={{padding: "40px"}}>
//             <Form.Group className="mb-1" controlId="cardNumber">
//                 <Form.Label style={{fontSize: 10, marginBottom: "-10px"}}>Credit Card Number</Form.Label>
//                 <Form.Control 
//                 type="tel" 
//                 name="number"
//                 placeholder="Enter Card Number" 
//                 onChange={this.handleInputChange}
//                 onFocus={this.handleInputFocus}/>
//                 <Form.Text className="text-muted">
//                 </Form.Text>
//             </Form.Group>
//             <Form.Group className="mb-1" controlId="fullName">
//                 <Form.Label style={{fontSize: 10, marginBottom: "-10px"}}>Full Name</Form.Label>
//                 <Form.Control 
//                 type="tel" 
//                 name="name"
//                 placeholder="Enter Name" 
//                 onChange={this.handleInputChange}
//                 onFocus={this.handleInputFocus}/>
//                 <Form.Text className="text-muted">
//                 </Form.Text>
//             </Form.Group>
//             <Row>
//                 <Form.Group className="mb-1 col-md-8" controlId="Valid Thru">
//                     <Form.Label style={{fontSize: 10, marginBottom: "-10px"}}>Valid Thru</Form.Label>
//                     <Form.Control 
//                     type="tel" 
//                     name="expiry"
//                     placeholder="Valid Thru" 
//                     onChange={this.handleInputChange}
//                     onFocus={this.handleInputFocus}/>
//                     <Form.Text className="text-muted">
//                     </Form.Text>
//                 </Form.Group>
//                 <Form.Group className="mb-1 col-md-4" controlId="cvc">
//                     <Form.Label style={{fontSize: 10, marginBottom: "-10px"}}>CVC</Form.Label>
//                     <Form.Control 
//                     type="tel" 
//                     name="cvc"
//                     placeholder="CVC" 
//                     onChange={this.handleInputChange}
//                     onFocus={this.handleInputFocus}/>
//                     <Form.Text className="text-muted">
//                     </Form.Text>
//                 </Form.Group>
//             </Row>
//             <SubmitCreditCardButton cvc={this.state.cvc} number={this.state.number} name={this.state.name} expiry={this.state.expiry}/>
//         </Form>
//       </div>
//     );
//   }
// }
