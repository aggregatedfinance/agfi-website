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
import { useMint } from '../hooks';

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

  const { state: mintState, send: mintSend, resetState: mintResetState } = useMint();

  useEffect(() => {
    if (mintState) {
      setLoadingMint(isStateLoading(mintState));
    }
  }, [mintState]);
  const onClickMint = () => {
    mintResetState();
    mintSend();
  };

  return (
    <>
      <TopBar colorMode={colorMode} title="NFT" />
      <Container maxWidth="md">
        <Grid container spacing={1} sx={{ my: 2 }}>
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
            <Grid item xs={12}>
              <Card sx={{ display: 'flex', p: 2, borderRadius: 0 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" textAlign="center">
                    Mint NFT
                  </Typography>
                  <Typography variant="h4" textAlign="center">
                    Mint NFT
                  </Typography>
                  <ButtonGroup size="large" orientation="horizontal" fullWidth>
                    <Button
                      onClick={onClickMint}
                      disabled={isLoadingMint}
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
                </Box>
              </Card>
            </Grid>
          )}
          <Grid item xs={12}>
            <Links />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default NFT;
