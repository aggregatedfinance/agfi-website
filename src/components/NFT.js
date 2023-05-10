import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Grid,
  Typography,
  Alert,
  AlertTitle
} from '@mui/material';
import { useEthers } from '@usedapp/core';
import TransactionStatus from './dashboard/TransactionStatus';
import Links from './dashboard/Links';
import TopBar from './TopBar';
import { useApproveUsdt, useMint } from '../hooks';
import { NFT_ADDRESS } from '../config';

const isStateLoading = (txnState) => {
  console.log(txnState);
  if (txnState.status === 'PendingSignature') {
    return true;
  }
  if (txnState.status === 'Exception') {
    return false;
  }
  if (txnState.status === 'None') {
    return false;
  }
  if (txnState.status === 'Mining') {
    return true;
  }
  if (txnState.status === 'Success') {
    return false;
  }
  return false;
};

function NFT(props) {
  const { colorMode } = props;
  const { account } = useEthers();
  // const ethPrice = useCoingeckoPrice('ethereum', 'usd');
  const [isLoadingMint, setLoadingMint] = useState(false);
  const [isLoadingApprove, setLoadingApprove] = useState(false);

  const { state: mintState, send: mintSend, resetState: mintResetState } = useMint();
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApproveUsdt();

  useEffect(() => {
    if (approveState) {
      setLoadingApprove(isStateLoading(approveState));
    }
    if (mintState) {
      setLoadingMint(isStateLoading(mintState));
    }
  }, [mintState, approveState]);

  const onClickMint = () => {
    mintResetState();
    approveResetState();
    mintSend();
  };

  const onClickApprove = () => {
    mintResetState();
    approveResetState();
    approveSend(NFT_ADDRESS, BigNumber.from('400000000'));
  };

  return (
    <>
      <TopBar colorMode={colorMode} title="NFT" />
      <Container maxWidth="md">
        <Grid container spacing={1} sx={{ my: 2, justifyContent: 'center' }}>
          {!account && (
            <Grid item xs={12}>
              <Alert severity="error">
                <AlertTitle>Wallet Not Connected!</AlertTitle>
                Please use the "Connect" button at the top of the page to connect your browser wallet and view this
                page.
              </Alert>
            </Grid>
          )}
          {account && (
            <Grid item xs={6}>
              <Card sx={{ display: 'flex', p: 2, m: 2, borderRadius: 4 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" textAlign="center" sx={{ textTransform: 'uppercase' }}>
                    Mint NFT
                  </Typography>
                  <Typography variant="body1" textAlign="center" gutterBottom>
                    Mint price: USDT$400
                  </Typography>
                  <Typography variant="body2" textAlign="center">
                    Each wallet can mint a maximum of 10 NFTs
                  </Typography>
                  <ButtonGroup size="large" orientation="vertical" fullWidth sx={{ mt: 2 }}>
                    <Button
                      onClick={onClickApprove}
                      disabled={isLoadingMint || isLoadingApprove}
                      variant="outlined"
                      color="success"
                      sx={{ borderRadius: 2 }}
                    >
                      Approve USDT
                    </Button>
                    <Button
                      onClick={onClickMint}
                      disabled={isLoadingMint || isLoadingApprove}
                      variant="contained"
                      color="success"
                      sx={{ borderRadius: 2 }}
                    >
                      Mint NFT
                    </Button>
                  </ButtonGroup>
                  {mintState && mintState.status === 'PendingSignature' && (
                    <TransactionStatus isLoading message="Waiting for Wallet Signature..." />
                  )}
                  {mintState && mintState.status === 'Mining' && (
                    <TransactionStatus isLoading message="Transaction Pending..." />
                  )}
                  {mintState && mintState.status === 'Success' && (
                    <TransactionStatus isSuccess message="Mint Complete!" />
                  )}
                  {mintState && mintState.status === 'Exception' && (
                    <TransactionStatus isError message={mintState.errorMessage} />
                  )}
                  {approveState && approveState.status === 'PendingSignature' && (
                    <TransactionStatus isLoading message="Waiting for Wallet Signature..." />
                  )}
                  {approveState && approveState.status === 'Mining' && (
                    <TransactionStatus isLoading message="Transaction Pending..." />
                  )}
                  {approveState && approveState.status === 'Success' && (
                    <TransactionStatus isSuccess message="Approval Complete!" />
                  )}
                  {approveState && approveState.status === 'Exception' && (
                    <TransactionStatus isError message={approveState.errorMessage} />
                  )}
                </Box>
              </Card>
            </Grid>
          )}
          <Grid item xs={12} sx={{ mt: 20 }}>
            <Links />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default NFT;
