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
  AlertTitle,
  Slider,
  Stack
} from '@mui/material';
import { useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import TransactionStatus from './dashboard/TransactionStatus';
import Links from './dashboard/Links';
import TopBar from './TopBar';
import { useApproveUsdt, useBulkMint } from '../hooks';
import { NFT_ADDRESS, USDT_ADDRESS } from '../config';
import { fNumber } from 'formatNumber';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers/lib';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingMint, setLoadingMint] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoadingApprove, setLoadingApprove] = useState(false);
  const usdtBalance = useTokenBalance(USDT_ADDRESS, account);
  const allowance = useTokenAllowance(USDT_ADDRESS, account, NFT_ADDRESS);

  const { state: mintState, send: mintSend, resetState: mintResetState } = useBulkMint();
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
    try {
      setLoadingMint(true);
      setErrorMessage('');
      mintSend(account, BigNumber.from(quantity));
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoadingMint(false);
    }
  };

  const onClickApprove = () => {
    mintResetState();
    approveResetState();
    try {
      setLoadingApprove(true);
      setErrorMessage('');
      approveSend(NFT_ADDRESS, BigNumber.from('400000000').mul(quantity));
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoadingApprove(false);
    }
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
                  <Stack spacing={1}>
                    <Typography variant="h4" textAlign="center" sx={{ textTransform: 'uppercase' }}>
                      <i>The AGFI Vault</i>
                    </Typography>
                    <Typography variant="body1" textAlign="center">
                      Mint price: USDT ${quantity * 400}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: 10 }} textAlign="center">
                      Your USDT Balance
                    </Typography>
                    <Typography variant="body2" textAlign="center" sx={{ fontFamily: 'Roboto' }}>
                      {fNumber(formatUnits(usdtBalance || 0, 6))} USDT
                    </Typography>
                    <Slider
                      defaultValue={quantity}
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                      step={1}
                      marks
                      min={1}
                      max={10}
                      valueLabelDisplay="auto"
                      color="secondary"
                    />
                    <Typography variant="body2" textAlign="center" sx={{ fontSize: 10 }}>
                      Each wallet can mint a maximum of 10 NFTs
                    </Typography>
                    <ButtonGroup size="large" orientation="vertical" fullWidth sx={{ mt: 2 }}>
                      <Button
                        onClick={onClickApprove}
                        disabled={isLoadingMint || isLoadingApprove || allowance >= quantity * 400000000}
                        variant="contained"
                        color="success"
                        sx={{ borderRadius: 2 }}
                      >
                        Approve USDT
                      </Button>
                      <Button
                        onClick={onClickMint}
                        disabled={isLoadingMint || isLoadingApprove || allowance < quantity * 400000000}
                        variant="contained"
                        color="success"
                        sx={{ borderRadius: 2 }}
                      >
                        Mint NFT{quantity > 1 && 's'}
                      </Button>
                    </ButtonGroup>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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
                  </Stack>
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
