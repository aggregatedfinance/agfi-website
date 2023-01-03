import React, { useEffect, useState } from 'react';
import { Stack, Typography, Chip, Divider, Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';
import { formatEther } from '@ethersproject/units';
import { useLocks } from '../../hooks';
import { fNumberWithDecimals } from '../../formatNumber';
import IncrementLock from './IncrementLock';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

function LockData({ account, pairAddress, idx }) {
  const theme = useTheme();
  const lockData = useLocks(pairAddress, idx);
  const [lockDate, setLockDate] = useState('');
  const [schemaId, setSchemaId] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (lockData && lockData.owner) {
      setLockDate(lockData.lockDate.toString());
      setSchemaId(lockData.schemaId.toString());
      setUnlockDate(lockData.unlockDate.toString());
      setIsUnlocked(dayjs().isAfter(dayjs.unix(lockData.unlockDate.toString())));
    }
  }, [lockData]);

  return lockData && lockData.owner ? (
    <Box
      sx={{
        border: 1,
        p: 2,
        borderRadius: 4,
        borderColor: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.default
      }}
    >
      <Stack spacing={1}>
        <Box>
          <Typography variant="body2" color={theme.palette.secondary.main}>
            Lock Owner
          </Typography>
          <Typography variant="body1">{lockData?.owner}</Typography>
        </Box>
        {schemaId === '2' && (
          <Chip
            icon={<VerifiedIcon />}
            label="KYC Verified with Signata"
            color="success"
            variant="filled"
            size="small"
          />
        )}
        {lockData.owner === account && (
          <Chip icon={<CheckCircleIcon />} label="Owned by You" color="success" variant="filled" size="small" />
        )}
        <Divider />
        <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          <Box>
            <Typography variant="body2" color={theme.palette.secondary.main}>
              LP Tokens Locked
            </Typography>
            <Typography variant="h5">{fNumberWithDecimals(formatEther(lockData.amount))}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color={theme.palette.secondary.dark}>
              Inital Amount Locked
            </Typography>
            <Typography variant="body1">{fNumberWithDecimals(formatEther(lockData.initialAmount))}</Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          <Box>
            <Typography variant="body2" color={theme.palette.secondary.main}>
              Unlocks
            </Typography>
            <Typography variant="h5">{dayjs.unix(unlockDate).fromNow()}</Typography>
            <Typography variant="body2" color="text.secondary">
              {dayjs.unix(unlockDate).toString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color={theme.palette.secondary.dark}>
              Locked
            </Typography>
            <Typography variant="h6">{dayjs.unix(lockDate).fromNow()}</Typography>
            <Typography variant="body2" color="text.secondary">
              {dayjs.unix(lockDate).toString()}
            </Typography>
          </Box>
        </Stack>
        {lockData.owner === account && (
          <IncrementLock account={account} pairAddress={pairAddress} idx={idx} lockData={lockData} />
        )}
        {isUnlocked && <Chip icon={<ReportIcon />} label="Lock Expired" color="warning" variant="filled" />}
      </Stack>
    </Box>
  ) : (
    <div />
  );
}

export default LockData;
