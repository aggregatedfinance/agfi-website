import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useEthers, useToken, useTokenBalance } from '@usedapp/core';
import TopBar from './TopBar';
import LockLiquidity from './locker/LockLiquidity';
import WithdrawLiquidity from './locker/WithdrawLiquidity';
import { useGetToken0, useGetToken1 } from '../hooks';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function Locker(props) {
  const { colorMode, mode } = props;
  const theme = useTheme();
  const { account } = useEthers();
  const [pairAddress, setPairAddress] = useState('');
  const [validPairAddress, setValidPairAddress] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const tokenInfo = useToken(pairAddress || '');
  const token0 = useGetToken0(pairAddress || '');
  const token1 = useGetToken1(pairAddress || '');
  const token0Info = useToken(token0 || '');
  const token1Info = useToken(token1 || '');
  const lpBalance = useTokenBalance(pairAddress || '', account || '');

  const onChangeTokenAddress = (e) => {
    setPairAddress(e.target.value);
  };

  const handleChangeTab = (e, newTabValue) => {
    setTabValue(newTabValue);
  };

  useEffect(() => {
    if (tokenInfo && tokenInfo.symbol === 'UNI-V2') {
      setValidPairAddress(true);
    }
  }, [tokenInfo]);

  return (
    <>
      <TopBar colorMode={colorMode} title="Liquidity Locker" />
      <Container maxWidth="md">
        <Grid container spacing={2} sx={{ my: 2 }} justifyContent="center">
          <Grid item xs={12} textAlign="center">
            <Typography variant="h3" component="h1" gutterBottom>
              Liquidity Locker
            </Typography>
            <Typography variant="body1" component="p">
              Lock liquidity tokens to protect them, provide assurance, and optionally get extra regulatory protection
              and access control using Signata. Fees collected are distributed to the AGFI rewards contract.
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} textAlign="center">
                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleChangeTab}
                    textColor="secondary"
                    indicatorColor="secondary"
                    centered
                  >
                    <Tab label="Lock Liquidity" />
                    <Tab label="Withdraw Liquidity" />
                  </Tabs>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabValue} index={0}>
                  <Stack spacing={2}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }} textAlign="center">
                      Lock Liquidity
                    </Typography>
                    <Divider>
                      <i>Liquidity Pair Address</i>
                    </Divider>
                    <TextField
                      required
                      label="Uniswap V2 Pair Address"
                      fullWidth
                      color={mode === 'dark' ? 'primary' : 'secondary'}
                      value={pairAddress}
                      onChange={onChangeTokenAddress}
                    />
                    {lpBalance && token0Info && token1Info && (
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Your Balance
                      </Typography>
                    )}
                    {lpBalance && token0Info && token1Info && (
                      <Typography variant="h5" sx={{ fontWeight: 700 }} textAlign="center">
                        {lpBalance.toString()} {token0Info.symbol}/{token1Info.symbol}
                      </Typography>
                    )}
                  </Stack>
                  {validPairAddress && tokenInfo && (
                    <LockLiquidity account={account} mode={mode} tokenInfo={tokenInfo} lpBalance={lpBalance} />
                  )}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <Stack spacing={2}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }} textAlign="center">
                      Withdraw Liquidity
                    </Typography>
                    <Divider>
                      <i>Liquidity Pair Address</i>
                    </Divider>
                    <TextField
                      required
                      label="Uniswap V2 Pair Address"
                      fullWidth
                      color={mode === 'dark' ? 'primary' : 'secondary'}
                      value={pairAddress}
                      onChange={onChangeTokenAddress}
                    />
                    {lpBalance && token0Info && token1Info && (
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Your Balance
                      </Typography>
                    )}
                    {lpBalance && token0Info && token1Info && (
                      <Typography variant="h5" textAlign="center">
                        {lpBalance.toString()} {token0Info.symbol}/{token1Info.symbol}
                      </Typography>
                    )}
                  </Stack>
                  {validPairAddress && tokenInfo && (
                    <WithdrawLiquidity account={account} mode={mode} tokenInfo={tokenInfo} />
                  )}
                </TabPanel>
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Link
                  href="https://signata.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  color={theme.palette.success.main}
                >
                  <i>Secured by Signata</i>
                </Link>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Locker;
