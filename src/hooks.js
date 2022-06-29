import { useContractFunction, useCall } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import agfiAbi from './agfiAbi.json';
import stakingAbi from './stakingAbi.json';
import { AGFI_ADDRESS, STAKING_ADDRESS } from './config';

const agfiContract = new Contract(AGFI_ADDRESS, agfiAbi);
const stakingContract = new Contract(STAKING_ADDRESS, stakingAbi);

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

export function useApprove() {
  const { state, send, events, resetState } = useContractFunction(agfiContract, 'approve', {
    transactionName: 'Approve'
  });
  return { state, send, events, resetState };
}

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
