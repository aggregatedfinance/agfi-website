import { gql, useQuery } from '@apollo/client';
// import { useEthers } from '@usedapp/core';
import { AGFI_ADDRESS } from './config';

const priceQuery = gql`
  {
    token(id: "${AGFI_ADDRESS}") {
      totalSupply
      tradeVolumeUSD
      untrackedVolumeUSD
      totalLiquidity
      derivedETH
    }
  }
`;

const dataQuery = gql`
  query Swaps($wallet: String!) {
    swaps(orderBy: timestamp, orderDirection: desc, where: { to: $wallet }) {
      pair {
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      transaction {
        id
        blockNumber
        timestamp
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
  }
`;

export function useUniswapPriceData() {
  // const { account } = useEthers();
  const { data } = useQuery(priceQuery, {});
  return data;
}

export default function UniswapTransactionData(address) {
  // const { account } = useEthers();
  const { data } = useQuery(dataQuery, { variables: { wallet: address } });
  return data;
}
