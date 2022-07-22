# Aggregated Finance Website

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

In the project directory, run:

### `yarn`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Deployment

Fleek deploys all changes on the `main` branch to IPFS.

## Getting total supply data

Supply data on the dashboard is static. Run the below script to get all supply history from Infura. It prints out all totalSupply for every day from when you run it.

Only add a new entry onto the website if the amount drops by 1 billion tokens. Convert the block number to a timestamp by using Etherscan to look at the block and then convert that timestamp into a unix timestamp for appending to the dashboard data.

``` javascript
const Web3 = require('web3');

const rpcUrl = 'https://mainnet.infura.io/v3/INFURA_KEY';

const web3 = new Web3(rpcUrl);
const contractAddress = "0x4D0F56d728c5232ab07fAA0BdcbA23670A35451f";
const contractABI = [{"inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],"stateMutability": "view","type": "function" }];
const w3contract = new web3.eth.Contract(contractABI, contractAddress)
const sevenDaysBlocks = 6414;

var blockToCall;

var dat = [];

function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

async function getData() {
  blockToCall = await web3.eth.getBlockNumber();

  try {
    for (let i = 0; i < 200; i++) {
      const supplyToLog = await w3contract.methods.totalSupply().call(blockToCall);
      dat.push({ block: blockToCall, supply: supplyToLog });
      blockToCall -= sevenDaysBlocks;
      // await delay(2000);
    }
  } catch {}

  console.log(dat);
}

getData();
```
