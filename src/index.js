import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router } from 'react-router-dom'
import { MoralisDappProvider } from "./providers/MoralisDappProvider/MoralisDappProvider";
import "./index.css";
import QuickStart from "./components/QuickStart";
/* bootstrap css*/
import './assets/sass/custom-strap.scss';

/* animate css */
import 'animate.css';

/* bootstrap icons */
import "bootstrap-icons/font/bootstrap-icons.css";

/* DAPP connection handler */
import {MoralisProvider} from 'react-moralis'
  
const APP_ID = 'gHZB462va1nfDt9kiggqQMxXl3UA6nYDXVNFQbrr';
const SERVER_URL = 'https://nkh6xkvx6bxv.usemoralis.com:2053/server';

const Application = () => {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;
  if (isServerInfo)
    return (
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <MoralisDappProvider>
          <App isServerInfo />
        </MoralisDappProvider>
      </MoralisProvider>
    );
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QuickStart />
      </div>
    );
  }
};



ReactDOM.render(
  // <React.StrictMode>
  <Application />,
  // </React.StrictMode>,
  document.getElementById("root")
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

