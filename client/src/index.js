import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router } from 'react-router-dom'
/* bootstrap css*/
import './assets/sass/custom-strap.scss';

/* bootstrap icons */
import "bootstrap-icons/font/bootstrap-icons.css";

/* DAPP connection handler */
import {MoralisProvider} from 'react-moralis'

const _appId = 'E0fhGEi52PLpDC6apDEN52dnKljh2WCoFhPD491S';
const _serverUrl = 'https://uwwwhurxlsze.usemoralis.com:2053/server';

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId = {_appId} serverUrl = {_serverUrl} >
      <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

