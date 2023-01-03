import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Divider, Stack, TextField, Typography, Box } from '@mui/material';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { useTokenAllowance, useToken, useTokenBalance } from '@usedapp/core';
import ApprovalIcon from '@mui/icons-material/Approval';
import LockIcon from '@mui/icons-material/Lock';
import { fNumberWithDecimals } from '../../formatNumber';
import { LOCKER_ADDRESS } from '../../config';
import { useApproveLocker, useIncrementLock, useGetToken0, useGetToken1 } from '../../hooks';
import LoadingState from '../LoadingState';

function logLoading(state, name) {
  if (state && window.location.hostname === 'localhost') {
    if (state && state.status !== 'None') {
      console.log({ name, state: { ...state } });
    }
  }
}

function shouldBeLoading(state) {
  switch (state) {
    case 'PendingSignature':
      return true;
    case 'Exception':
      return false;
    case 'None':
      return false;
    case 'Mining':
      return true;
    case 'Success':
      return false;
    default:
      return false;
  }
}

function IncrementLock({ mode, account, pairAddress, lockData, idx }) {
  const [amountToLock, setAmountToLock] = useState(0);
  const [actualAmountToLock, setActualAmountToLock] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const lockingAllowance = useTokenAllowance(pairAddress, account, LOCKER_ADDRESS);
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApproveLocker(pairAddress);
  const { state: incrementState, send: incrementSend, resetState: incrementResetState } = useIncrementLock();
  const token0 = useGetToken0(pairAddress || '');
  const token1 = useGetToken1(pairAddress || '');
  const token0Info = useToken(token0 || '');
  const token1Info = useToken(token1 || '');
  const lpBalance = useTokenBalance(pairAddress || '', account || '');

  useEffect(() => {
    if (approveState) {
      logLoading(approveState, 'approve');
      setLoading(shouldBeLoading(approveState.status));
    }
  }, [approveState]);

  useEffect(() => {
    if (incrementState) {
      logLoading(incrementState, 'incrementLock');
      setLoading(shouldBeLoading(incrementState.status));
    }
  }, [incrementState]);

  const resetStates = () => {
    approveResetState();
    incrementResetState();
  };

  const onClickApprove = (e) => {
    e.preventDefault();
    resetStates();
    approveSend(LOCKER_ADDRESS, BigNumber.from(actualAmountToLock));
  };

  const onClickIncrement = (e) => {
    e.preventDefault();
    resetStates();
    incrementSend(pairAddress, BigNumber.from(idx), lockData.lockID, BigNumber.from(actualAmountToLock));
  };

  const onChangeAmountToLock = (e) => {
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, 18);
      if (parsedAmount.gt(lpBalance) || parsedAmount.isNegative()) {
        setActualAmountToLock(lpBalance);
        setAmountToLock(formatUnits(lpBalance || 0, 18));
      } else {
        setActualAmountToLock(parsedAmount);
        setAmountToLock(newAmount);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleClickToLockPercentage = (e, val) => {
    e.preventDefault();
    const newAmount = lpBalance.div(100).mul(val);
    setActualAmountToLock(newAmount);
    setAmountToLock(formatUnits(newAmount || 0, 18));
  };

  return (
    <Stack spacing={2} sx={{ pt: 2 }}>
      <Box>
        {lpBalance && token0Info && token1Info && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Your Balance
          </Typography>
        )}
        {lpBalance && token0Info && token1Info && (
          <Typography variant="h5" sx={{ fontWeight: 700 }} textAlign="center">
            {fNumberWithDecimals(formatUnits(lpBalance, 18))} {token0Info.symbol}/{token1Info.symbol}
          </Typography>
        )}
      </Box>
      <Divider>
        <i>Amount to Add</i>
      </Divider>
      <TextField label="Amount" fullWidth color="secondary" value={amountToLock} onChange={onChangeAmountToLock} />
      <ButtonGroup
        fullWidth
        size="small"
        disabled={isLoading}
        variant={mode === 'dark' ? 'outlined' : 'contained'}
        color={mode === 'dark' ? 'primary' : 'secondary'}
      >
        <Button onClick={(e) => handleClickToLockPercentage(e, 50)}>50%</Button>
        <Button onClick={(e) => handleClickToLockPercentage(e, 100)}>100%</Button>
      </ButtonGroup>
      <ButtonGroup size="large" orientation="horizontal" fullWidth variant="contained">
        {BigNumber.isBigNumber(lockingAllowance) && (
          <Button
            onClick={onClickApprove}
            disabled={lockingAllowance.gte(actualAmountToLock) || isLoading}
            color={mode === 'dark' ? 'primary' : 'secondary'}
            startIcon={<ApprovalIcon />}
          >
            Approve
          </Button>
        )}
        {BigNumber.isBigNumber(lockingAllowance) && (
          <Button
            onClick={onClickIncrement}
            color="success"
            startIcon={<LockIcon />}
            disabled={lockingAllowance.lt(actualAmountToLock) || actualAmountToLock < 1 || isLoading}
          >
            Lock
          </Button>
        )}
      </ButtonGroup>
      <LoadingState state={approveState} />
      <LoadingState state={incrementState} />
    </Stack>
  );
}

export default IncrementLock;
