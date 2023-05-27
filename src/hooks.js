import { useState, useEffect } from 'react';
import { useContractFunction, useCall } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import agfiAbi from './agfiAbi.json';
import stakingAbi from './stakingAbi.json';
import lockerAbi from './lockerAbi.json';
import usdtAbi from './usdtAbi.json';
import nftAbi from './nftAbi.json';
import uniswapV2PairAbi from './uniswapV2PairAbi.json';
import { AGFI_ADDRESS, STAKING_ADDRESS, LOCKER_ADDRESS, USDT_ADDRESS, NFT_ADDRESS } from './config';

const agfiContract = new Contract(AGFI_ADDRESS, agfiAbi);
const stakingContract = new Contract(STAKING_ADDRESS, stakingAbi);
const lockerContract = new Contract(LOCKER_ADDRESS, lockerAbi);
const usdtContract = new Contract(USDT_ADDRESS, usdtAbi);
const nftContract = new Contract(NFT_ADDRESS, nftAbi);

export function useMint() {
  const { state, send, events, resetState } = useContractFunction(nftContract, 'mintNFT', {
    transactionName: 'Mint NFT'
  });
  return { state, send, events, resetState };
}

export function useBulkMint() {
  const { state, send, events, resetState } = useContractFunction(nftContract, 'bulkMintNFT', {
    transactionName: 'Bulk Mint NFT'
  });
  return { state, send, events, resetState };
}

export function useClaim() {
  const { state, send, events, resetState } = useContractFunction(agfiContract, 'claim', {
    transactionName: 'Claim Rewards'
  });
  return { state, send, events, resetState };
}

export function useCompound() {
  const { state, send, events, resetState } = useContractFunction(agfiContract, 'compound', {
    transactionName: 'Compound Rewards'
  });
  return { state, send, events, resetState };
}

export function useAllowance() {
  const { state, send, events, resetState } = useContractFunction(agfiContract, 'allowance');
  return { state, send, events, resetState };
}

export function useWithdraw() {
  const { state, send, events, resetState } = useContractFunction(stakingContract, 'withdraw', {
    transactionName: 'Unstake'
  });
  return { state, send, events, resetState };
}

export function useDeposit() {
  const { state, send, events, resetState } = useContractFunction(stakingContract, 'deposit', {
    transactionName: 'Stake'
  });
  return { state, send, events, resetState };
}

export function useApproveUsdt() {
  const { state, send, events, resetState } = useContractFunction(usdtContract, 'approve', {
    transactionName: 'Approve'
  });
  return { state, send, events, resetState };
}

export function useApprove() {
  const { state, send, events, resetState } = useContractFunction(agfiContract, 'approve', {
    transactionName: 'Approve'
  });
  return { state, send, events, resetState };
}

export function useApproveLocker(token) {
  const tokenContract = new Contract(token, uniswapV2PairAbi);
  const { state, send, events, resetState } = useContractFunction(tokenContract, 'approve', {
    transactionName: 'Approve'
  });
  return { state, send, events, resetState };
}

export function useLockTokens() {
  const { state, send, events, resetState } = useContractFunction(lockerContract, 'lockTokens', {
    transactionName: 'Lock'
  });
  return { state, send, events, resetState };
}

export function useIncrementLock() {
  const { state, send, events, resetState } = useContractFunction(lockerContract, 'incrementLock', {
    transactionName: 'Increment Lock'
  });
  return { state, send, events, resetState };
}

export function useRelock() {
  const { state, send, events, resetState } = useContractFunction(lockerContract, 'relock', {
    transactionName: 'Relock'
  });
  return { state, send, events, resetState };
}

export function useSplitLock() {
  const { state, send, events, resetState } = useContractFunction(lockerContract, 'splitLock', {
    transactionName: 'Split Lock'
  });
  return { state, send, events, resetState };
}

export function useWithdrawLock() {
  const { state, send, events, resetState } = useContractFunction(lockerContract, 'withdraw', {
    transactionName: 'Withdraw'
  });
  return { state, send, events, resetState };
}

export const useGetLockedTokenAtIndex = (index) => {
  const { value, error } =
    useCall(
      LOCKER_ADDRESS && {
        contract: lockerContract,
        method: 'getLockedTokenAtIndex',
        args: [index]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useGetNumLockedTokens = () => {
  const { value, error } =
    useCall(
      LOCKER_ADDRESS && {
        contract: lockerContract,
        method: 'getNumLockedTokens',
        args: []
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useGetNumLocksForToken = (lpToken) => {
  const { value, error } =
    useCall(
      LOCKER_ADDRESS && {
        contract: lockerContract,
        method: 'getNumLocksForToken',
        args: [lpToken]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useGetUserLockForTokenAtIndex = (user, lpToken, index) => {
  const { value, error } =
    useCall(
      LOCKER_ADDRESS && {
        contract: lockerContract,
        method: 'getUserLockForTokenAtIndex',
        args: [user, lpToken, index]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useGetUserLockedTokenAtIndex = (user, index) => {
  const { value, error } =
    useCall(
      LOCKER_ADDRESS && {
        contract: lockerContract,
        method: 'getUserLockedTokenAtIndex',
        args: [user, index]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return {
    lockData: value?.[0],
    amount: value?.[1],
    initialAmount: value?.[2],
    unlockDate: value?.[3],
    lockID: value?.[4],
    schemaId: value?.[5],
    owner: value?.[6]
  };
};

export const useGetUserNumLockedTokens = (user) => {
  const { value, error } =
    useCall(
      LOCKER_ADDRESS && {
        contract: lockerContract,
        method: 'getUserNumLockedTokens',
        args: [user]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useGetUserNumLocksForToken = (user, token) => {
  const { value, error } =
    useCall(
      LOCKER_ADDRESS && {
        contract: lockerContract,
        method: 'getUserNumLockedTokens',
        args: [user, token]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useLocks = (pairAddress, idx) => {
  const { value, error } =
    useCall(
      LOCKER_ADDRESS && {
        contract: lockerContract,
        method: 'locks',
        args: [pairAddress, idx]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return {
    lockDate: value?.[0],
    amount: value?.[1],
    initialAmount: value?.[2],
    unlockDate: value?.[3],
    lockID: value?.[4],
    owner: value?.[5],
    schemaId: value?.[6]
  };
};

export const useGetVotes = (account) => {
  const { value, error } =
    useCall(
      AGFI_ADDRESS && {
        contract: agfiContract,
        method: 'getVotes',
        args: [account]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useGetStakingInfo = (account) => {
  const { value, error } =
    useCall(
      STAKING_ADDRESS && {
        contract: stakingContract,
        method: 'getUserInfo',
        args: [account, AGFI_ADDRESS]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return {
    depositedAmount: value?.[0],
    rewardDebt: value?.[1]
  };
};

export const useGetAccountInfo = (account) => {
  const { value, error } =
    useCall(
      AGFI_ADDRESS && {
        contract: agfiContract,
        method: 'getAccountInfo',
        args: [account]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return {
    account: value?.[0],
    withdrawableRewards: value?.[1],
    totalRewards: value?.[2],
    lastClaimTime: value?.[3],
    totalRewardsWithdrawn: value?.[4]
  };
};

const getUniswapContract = (contract) => new Contract(contract, uniswapV2PairAbi);

export const useGetToken0 = (contract) => {
  const { value, error } =
    useCall(
      contract && {
        contract: getUniswapContract(contract),
        method: 'token0',
        args: []
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useGetToken1 = (contract) => {
  const { value, error } =
    useCall(
      contract && {
        contract: getUniswapContract(contract),
        method: 'token1',
        args: []
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useGetPendingReward = (account) => {
  const { value, error } =
    useCall(
      STAKING_ADDRESS && {
        contract: stakingContract,
        method: 'pendingReward',
        args: [account, AGFI_ADDRESS]
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useGetSwapIndex = () => {
  const { value, error } =
    useCall(
      AGFI_ADDRESS && {
        contract: agfiContract,
        method: 'swapIndex',
        args: []
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useGetSingleValue = (method) => {
  const { value, error } =
    useCall(
      AGFI_ADDRESS && {
        contract: agfiContract,
        method,
        args: []
      }
    ) ?? {};
  if (error) {
    // console.error(error.message);
    return {};
  }
  return value?.[0];
};

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
};
