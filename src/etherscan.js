import axios from 'axios';

const delay = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

export async function getTokenSupply(contractAddr) {
  try {
    await delay(); // to try to stop rate limiting by etherscan
    const response = await axios.get(
      `https://api.etherscan.io/api?module=stats&action=tokensupply&contractAddress=${contractAddr}&apikey=43MJ15K85GHRQEDAKK227QZVSTY2BVEP6T`
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getTransactions(addr, contractAddr) {
  try {
    await delay(); // to try to stop rate limiting by etherscan
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${addr}&contractAddress=${contractAddr}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=43MJ15K85GHRQEDAKK227QZVSTY2BVEP6T`
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getBuys() {
  try {
    await delay(); // to try to stop rate limiting by etherscan
    const response = await axios.get(
      `https://api.bloxy.info/token/token_holders_list?token=0x0be4447860ddf283884bbaa3702749706750b09e&limit=5000&key=ACCYgFaUWhDP9&format=structure`
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}
