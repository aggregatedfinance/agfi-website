/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { Alert, Divider, Stack, Typography } from '@mui/material';
import { BigNumber } from 'ethers';
import { useGetNumLocksForToken } from '../../hooks';
import LockData from './LockData';

function Locks({ account, pairAddress }) {
  const numLocksForToken = useGetNumLocksForToken(pairAddress);
  const [rows, setRows] = useState([]);
  // const userNumLocksForToken = useGetNumLocksForToken(pairAddress, account);
  useEffect(() => {
    if (numLocksForToken && BigNumber.isBigNumber(numLocksForToken)) {
      const num = numLocksForToken.toNumber();
      const newRows = [];
      for (let i = 0; i < num; i++) {
        newRows.push(<LockData key={i} account={account} pairAddress={pairAddress} idx={i} />);
      }
      setRows(newRows);
    }
  }, [numLocksForToken, account, pairAddress]);

  return (
    <Stack spacing={2} sx={{ pt: 8 }}>
      <Divider />
      <Typography variant="h5" textAlign="center" sx={{ fontWeight: 700 }}>
        Current Locks for Token
      </Typography>
      {rows}
      {rows.length === 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No locked liquidity found for token
        </Alert>
      )}
    </Stack>
  );
}

export default Locks;
