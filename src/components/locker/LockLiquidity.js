import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField
} from '@mui/material';
import { BigNumber } from 'ethers';
import ApprovalIcon from '@mui/icons-material/Approval';
import LockIcon from '@mui/icons-material/Lock';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTokenAllowance } from '@usedapp/core';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { useApproveLocker, useLockTokens } from '../../hooks';
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

function LockLiquidity(props) {
  const { mode, account, pairAddress, lpBalance } = props;
  const [unlockDate, setUnlockDate] = useState(dayjs());
  const [enforceSignata, setEnforceSignata] = useState(true);
  const [amountToLock, setAmountToLock] = useState(0);
  const [actualAmountToLock, setActualAmountToLock] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const lockingAllowance = useTokenAllowance(pairAddress, account, LOCKER_ADDRESS);
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApproveLocker();
  const { state: lockState, send: lockSend, resetState: lockResetState } = useLockTokens();

  useEffect(() => {
    if (approveState) {
      logLoading(approveState, 'approve');
      setLoading(shouldBeLoading(approveState.status));
    }
  }, [approveState]);

  useEffect(() => {
    if (lockState) {
      logLoading(lockState, 'lockTokens');
      setLoading(shouldBeLoading(lockState.status));
    }
  }, [lockState]);

  const resetStates = () => {
    approveResetState();
    lockResetState();
  };

  const onClickApprove = (e) => {
    e.preventDefault();
    resetStates();
    approveSend(LOCKER_ADDRESS, BigNumber.from(actualAmountToLock));
  };

  const onClickLock = (e) => {
    e.preventDefault();
    resetStates();
    lockSend(
      pairAddress,
      BigNumber.from(actualAmountToLock),
      unlockDate.unix(),
      account,
      BigNumber.from(enforceSignata ? '2' : '0')
    );
  };

  const onClick6Months = (e) => {
    e.preventDefault();
    setUnlockDate(dayjs().add(6, 'month'));
  };

  const onClick12Months = (e) => {
    e.preventDefault();
    setUnlockDate(dayjs().add(12, 'month'));
  };

  const onChangeEnforceSignata = (e) => {
    setEnforceSignata(e.target.checked);
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
      <Divider>
        <i>Amount to Lock</i>
      </Divider>
      <TextField label="Amount" fullWidth color="secondary" value={amountToLock} onChange={onChangeAmountToLock} />
      <ButtonGroup
        fullWidth
        size="small"
        variant={mode === 'dark' ? 'outlined' : 'contained'}
        color={mode === 'dark' ? 'primary' : 'secondary'}
      >
        <Button onClick={(e) => handleClickToLockPercentage(e, 50)}>50%</Button>
        <Button onClick={(e) => handleClickToLockPercentage(e, 100)}>100%</Button>
      </ButtonGroup>
      <Divider>
        <i>Unlock Date</i>
      </Divider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="Unlock Date"
          value={unlockDate}
          color={mode === 'dark' ? 'primary' : 'secondary'}
          onChange={(newValue) => {
            setUnlockDate(newValue);
          }}
        />
      </LocalizationProvider>
      <ButtonGroup
        fullWidth
        size="small"
        variant={mode === 'dark' ? 'outlined' : 'contained'}
        color={mode === 'dark' ? 'primary' : 'secondary'}
      >
        <Button disabled={isLoading} onClick={onClick6Months}>
          6 Months
        </Button>
        <Button disabled={isLoading} onClick={onClick12Months}>
          12 Months
        </Button>
      </ButtonGroup>
      <Divider>
        <i>Extras</i>
      </Divider>
      <FormGroup sx={{ alignContent: 'center' }}>
        <FormControlLabel
          control={<Checkbox checked={enforceSignata} onChange={onChangeEnforceSignata} />}
          label="Enforce Signata KYC"
        />
      </FormGroup>
      {enforceSignata && (
        <Alert severity="info">
          Signata KYC enforced locks require lockers and withdrawers to hold a KYC NFT issued by Signata.
        </Alert>
      )}
      <ButtonGroup size="large" orientation="horizontal" fullWidth variant="contained">
        <Button
          onClick={onClickApprove}
          disabled={lockingAllowance >= actualAmountToLock || isLoading}
          color={mode === 'dark' ? 'primary' : 'secondary'}
          startIcon={<ApprovalIcon />}
        >
          Approve
        </Button>
        <Button
          onClick={onClickLock}
          color="success"
          startIcon={<LockIcon />}
          disabled={lockingAllowance < actualAmountToLock || amountToLock < 1 || isLoading}
        >
          Lock
        </Button>
      </ButtonGroup>
      <LoadingState state={approveState} />
      <LoadingState state={lockState} />
    </Stack>
  );
}

export default LockLiquidity;
