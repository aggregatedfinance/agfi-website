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
import { ethers } from 'ethers';
import { useEthers, useToken } from '@usedapp/core';
import TopBar from './TopBar';
import LockLiquidity from './locker/LockLiquidity';
import WithdrawLiquidity from './locker/WithdrawLiquidity';

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

  const onChangeTokenAddress = (e) => {
    if (ethers.utils.isAddress(e.target.value)) {
      setPairAddress(e.target.value);
    }
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
      <TopBar colorMode={colorMode} title="Locker" />
      <Container maxWidth="md">
        <Grid container spacing={2} sx={{ my: 2 }} justifyContent="center">
          <Grid item xs={12} textAlign="center">
            <Typography variant="h3" component="h1" gutterBottom>
              Liquidity Locker
            </Typography>
            <Typography variant="body1" component="p">
              Lock liquidity tokens to protect them, provide assurance, and optionally get extra regulatory protection
              and access control using{' '}
              <Link
                href="https://signata.net/"
                target="_blank"
                rel="noopener noreferrer"
                color={theme.palette.success.main}
              >
                Signata
              </Link>
              . Fees collected are distributed to the AGFI rewards contract.
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
                  </Stack>
                  {validPairAddress && tokenInfo && (
                    <LockLiquidity account={account} mode={mode} tokenInfo={tokenInfo} pairAddress={pairAddress} />
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
                  </Stack>
                  {validPairAddress && tokenInfo && (
                    <WithdrawLiquidity account={account} mode={mode} tokenInfo={tokenInfo} pairAddress={pairAddress} />
                  )}
                </TabPanel>
              </Grid>
              <Grid item xs={12} textAlign="center">
                {mode === 'dark' ? (
                  <img src="secured-by-dark.png" style={{ width: 200 }} alt="Secured by Signata" />
                ) : (
                  <img src="secured-by-light.png" style={{ width: 200 }} alt="Secured by Signata" />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Locker;
