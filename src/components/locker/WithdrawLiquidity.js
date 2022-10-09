import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Divider, Stack, TextField, Typography } from '@mui/material';
import { BigNumber } from 'ethers';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import dayjs, { Dayjs } from 'dayjs';
import { useEthers } from '@usedapp/core';
import { useWithdrawLock } from '../../hooks';
import LoadingState from '../LoadingState';
import { LOCKER_ADDRESS } from '../../config';

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

function WithdrawLiquidity(props) {
  const { mode, account, pairAddress } = props;
  const [unlockDate, setUnlockDate] = useState(dayjs());
  const [amountToLock, setAmountToLock] = useState(0);
  const [actualAmountToUnlock, setActualAmountToUnlock] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [lockId, setLockId] = useState(0);

  const { state: withdrawState, send: withdrawSend, resetState: withdrawResetState } = useWithdrawLock();

  useEffect(() => {
    if (withdrawState) {
      logLoading(withdrawState, 'withdraw');
      setLoading(shouldBeLoading(withdrawState.status));
    }
  }, [withdrawState]);

  const resetStates = () => {
    withdrawResetState();
  };

  const onClick6Months = (e) => {
    e.preventDefault();
    setUnlockDate(dayjs().add(6, 'month'));
  };

  const onClick12Months = (e) => {
    e.preventDefault();
    setUnlockDate(dayjs().add(12, 'month'));
  };

  const onChangeAmountToLock = (e) => {
    setAmountToLock(e.target.value);
  };

  const onClickWithdraw = (e) => {
    e.preventDefault();
    resetStates();
    withdrawSend(pairAddress, index, lockId, actualAmountToUnlock);
  };

  return (
    <Stack spacing={2} sx={{ pt: 2 }}>
      <Divider>
        <i>Amount to Withdraw</i>
      </Divider>
      <TextField
        label="Amount to Withdraw"
        fullWidth
        color={mode === 'dark' ? 'primary' : 'secondary'}
        value={amountToLock}
        onChange={onChangeAmountToLock}
      />
      <ButtonGroup
        fullWidth
        size="small"
        variant={mode === 'dark' ? 'outlined' : 'contained'}
        color={mode === 'dark' ? 'primary' : 'secondary'}
      >
        <Button disabled={isLoading} onClick={onClick6Months}>
          50%
        </Button>
        <Button disabled={isLoading} onClick={onClick12Months}>
          100%
        </Button>
      </ButtonGroup>
      <ButtonGroup color="success" size="large" orientation="horizontal" fullWidth>
        <Button disabled={isLoading} onClick={onClickWithdraw} variant="contained" startIcon={<LockOpenIcon />}>
          Withdraw
        </Button>
      </ButtonGroup>
      <LoadingState state={withdrawState} />
    </Stack>
  );
}

export default WithdrawLiquidity;
