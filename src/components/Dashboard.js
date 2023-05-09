import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Stack,
  Typography,
  Alert,
  AlertTitle,
  useTheme
} from '@mui/material';
import { BigNumber } from 'ethers';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DoneIcon from '@mui/icons-material/Done';
import moment from 'moment';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { useCoingeckoPrice } from '@usedapp/coingecko';
import { useEthers, useTokenBalance, useTokenAllowance } from '@usedapp/core';
import {
  BarChart,
  LineChart,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  Bar,
  Line,
  ResponsiveContainer,
  Legend
} from 'recharts';

import TransactionStatus from './dashboard/TransactionStatus';
import ContractData from './dashboard/ContractData';
import Links from './dashboard/Links';
import BurnData from './dashboard/BurnData';
import { fNumber, fCurrency, fNumberWithDecimals, fPercent } from '../formatNumber';
import { useUniswapPriceData } from '../uniswap';
import { getTokenSupply, getBurns } from '../etherscan';
import {
  useApprove,
  useClaim,
  useCompound,
  useDeposit,
  useGetAccountInfo,
  useGetPendingReward,
  useGetStakingInfo,
  useGetVotes,
  useWithdraw,
  useFetch
} from '../hooks';
import { AGFI_ADDRESS, STAKING_ADDRESS, DEPLOYER_ADDRESS, LAUNCH_SUPPLY, TREASURY_ADDRESS } from '../config';
import TopBar from './TopBar';

const startingSupply = BigNumber.from(LAUNCH_SUPPLY);

const supplyHistory = [
  { timestamp: 1651756352000, supply: 1000 },
  { timestamp: 1651844460000, supply: 731.66 },
  { timestamp: 1651932697000, supply: 634.15 },
  { timestamp: 1657972403000, supply: 633.33 },
  { timestamp: 1663291646000, supply: 632.84 },
  { timestamp: 1665547483000, supply: 632.75 },
  { timestamp: 1670152965000, supply: 632.36 },
  { timestamp: 1675991494000, supply: 631.79 },
  { timestamp: 1683511141000, supply: 631.36 },
];

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

function a11yProps(mode) {
  return {
    id: `simple-tab-${mode}`,
    'aria-controls': `simple-tabpanel-${mode}`
  };
}

function Dashboard(props) {
  const { colorMode } = props;
  const { account } = useEthers();
  const theme = useTheme();

  const agfiBalance = useTokenBalance(AGFI_ADDRESS, account);
  const deployerBalance = useTokenBalance(AGFI_ADDRESS, DEPLOYER_ADDRESS);
  const totalStaked = useTokenBalance(AGFI_ADDRESS, STAKING_ADDRESS);
  const totalTreasury = useTokenBalance(AGFI_ADDRESS, TREASURY_ADDRESS);
  const priceData = useUniswapPriceData();
  const ethPrice = useCoingeckoPrice('ethereum', 'usd');
  const [circSupply, setCircSupply] = useState('');
  const [burnedSupply, setBurnedSupply] = useState('');
  const [isLoadingClaim, setLoadingClaim] = useState(false);
  const [isLoadingCompound, setLoadingCompound] = useState(false);
  const [isLoadingWithdraw, setLoadingWithdraw] = useState(false);
  const [isLoadingDeposit, setLoadingDeposit] = useState(false);
  const [isLoadingApprove, setLoadingApprove] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [unstakeAmount, setUnstakeAmount] = useState(0);
  const [actualStakeAmount, setActualStakeAmount] = useState(0);
  const [actualUnstakeAmount, setActualUnstakeAmount] = useState(0);
  const [treasuryDataFormatted, setTreasuryDataFormatted] = useState([]);
  const [latestTreasuryBalance, setLatestTreasuryBalance] = useState(0);
  const [burnEvents, setBurnEvents] = useState([]);

  const accountInfo = useGetAccountInfo(account);
  const stakingInfo = useGetStakingInfo(account);
  const pendingReward = useGetPendingReward(account);
  const votes = useGetVotes(account);

  const { state: claimState, send: claimSend, resetState: claimResetState } = useClaim();
  const { state: compoundState, send: compoundSend, resetState: compoundResetState } = useCompound();
  const { state: withdrawState, send: withdrawSend, resetState: withdrawResetState } = useWithdraw();
  const { state: depositState, send: depositSend, resetState: depositResetState } = useDeposit();
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApprove();
  const { data: treasuryData, loading: treasuryLoading } = useFetch(
    'https://id-api.signata.net/api/v1/sheet/17JL5-xeKOA1w7KKMlh_kAc3dKdxVV64aEeTbrnAIjxU'
  );

  useEffect(() => {
    async function getData() {
      const response = await getBurns(AGFI_ADDRESS);
      if (response.data && response.data.operations) {
        setBurnEvents(response.data.operations);
      }
    }
    if (burnEvents.length === 0) {
      getData();
    }
  }, [burnEvents]);

  useEffect(() => {
    if (treasuryData) {
      console.log(treasuryData);
      const newData = [];
      setLatestTreasuryBalance(treasuryData[treasuryData.length - 1][1]);
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < treasuryData.length; i++) {
        const row = treasuryData[i];
        newData.push({
          date: row[0],
          amt: parseFloat(row[1].replace(/,/g, '')),
          difference: row[2]
        });
      }
      setTreasuryDataFormatted(newData);
    }
  }, [treasuryData]);

  useEffect(() => {
    if (supplyHistory) {
      console.log(supplyHistory);
    }
  }, []);

  useEffect(() => {
    async function getData() {
      const response = await getTokenSupply(AGFI_ADDRESS);
      if (
        response.data &&
        response.data.result &&
        response.data.result !== 'Max rate limit reached' &&
        deployerBalance
      ) {
        setCircSupply(BigNumber.from(response.data.result).sub(deployerBalance));
        setBurnedSupply(startingSupply.sub(response.data.result));
      }
    }
    // only doing this when circSupply is blank so we don't keep calling etherscan on balance updates
    if (circSupply === '') {
      getData();
    }
  }, [setCircSupply, deployerBalance, circSupply]);

  useEffect(() => {
    if (withdrawState) {
      setLoadingWithdraw(isStateLoading(withdrawState));
    }
    if (claimState) {
      setLoadingClaim(isStateLoading(claimState));
    }
    if (approveState) {
      setLoadingApprove(isStateLoading(approveState));
    }
    if (depositState) {
      setLoadingDeposit(isStateLoading(depositState));
    }
    if (compoundState) {
      setLoadingCompound(isStateLoading(compoundState));
    }
  }, [withdrawState, claimState, approveState, depositState, compoundState]);

  const handleChangeToStake = (e) => {
    e.preventDefault();
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, 9);
      if (parsedAmount.gt(agfiBalance) || parsedAmount.isNegative()) {
        setActualStakeAmount(agfiBalance);
        setStakeAmount(formatUnits(agfiBalance || 0, 9));
      } else {
        setActualStakeAmount(parsedAmount);
        setStakeAmount(newAmount);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleChangeToUnstake = (e) => {
    e.preventDefault();
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, 9);
      if (parsedAmount.gt(stakingInfo.depositedAmount || 0) || parsedAmount.isNegative()) {
        setActualUnstakeAmount(stakingInfo.depositedAmount);
        setUnstakeAmount(formatUnits(stakingInfo.depositedAmount || 0, 9));
      } else {
        setActualUnstakeAmount(parsedAmount);
        setUnstakeAmount(newAmount);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleClickToStakePercentage = (e, val) => {
    e.preventDefault();
    const newAmount = agfiBalance.div(100).mul(val);
    setActualStakeAmount(newAmount);
    setStakeAmount(formatUnits(newAmount || 0, 9));
  };

  const handleClickToUnstakePercentage = (e, val) => {
    e.preventDefault();
    const newAmount = BigNumber.from(stakingInfo.depositedAmount).div(100).mul(val);
    setActualUnstakeAmount(newAmount);
    setUnstakeAmount(formatUnits(newAmount || 0, 9));
  };

  const resetStates = () => {
    claimResetState();
    compoundResetState();
    withdrawResetState();
    depositResetState();
    approveResetState();
  };

  const onClickUnstake = () => {
    resetStates();
    withdrawSend(BigNumber.from(actualUnstakeAmount));
  };

  const onClickStake = () => {
    resetStates();
    depositSend(BigNumber.from(actualStakeAmount));
  };

  const onClickCompound = () => {
    resetStates();
    compoundSend();
  };

  const onClickClaim = () => {
    resetStates();
    claimSend();
  };

  const onClickHarvest = () => {
    resetStates();
    withdrawSend(0);
  };

  const onClickApprove = () => {
    resetStates();
    approveSend(STAKING_ADDRESS, BigNumber.from(actualStakeAmount));
  };

  return (
    <>
      <TopBar colorMode={colorMode} title="Dashboard" />
      <Container maxWidth="md">
        <Grid container spacing={1} sx={{ my: 2 }}>
          {!account && (
            <Grid item xs={12}>
              <Alert severity="error">
                <AlertTitle>Wallet Not Connected!</AlertTitle>
                Please use the "Connect" button at the top of the page to connect your browser wallet and view this
                dashboard.
              </Alert>
            </Grid>
          )}
          {account && (
            <Grid item xs={12}>
              <Card
                sx={{
                  display: 'flex',
                  textAlign: 'center',
                  padding: 2,
                  borderRadius: 0
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ typography: 'h4' }}>Your AGFI Balance</Typography>
                  <Typography variant="h3" sx={{ fontFamily: 'Roboto' }}>
                    {fNumber(formatUnits(agfiBalance || 0, 9))} AGFI
                  </Typography>
                  {priceData && priceData.token && (
                    <Typography
                      variant="h5"
                      sx={{ fontFamily: 'Roboto', textAlign: 'center', color: 'text.secondary' }}
                    >
                      {fCurrency(formatUnits(agfiBalance || 0, 9) * priceData.token.derivedETH * ethPrice)} USD
                    </Typography>
                  )}
                  <Typography sx={{ typography: 'h6' }}>Your DAO Voting Power</Typography>
                  {votes && (
                    <Typography variant="body1" sx={{ fontFamily: 'Roboto', color: 'text.primary' }}>
                      {fNumber(formatUnits(votes || 0, 9))} Votes
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} textAlign="center">
                    USD prices derived from CoinGecko ETH USD price
                  </Typography>
                </Box>
              </Card>
            </Grid>
          )}
          {account && !ethPrice && !priceData && (
            <Grid item xs={12}>
              <Alert severity="warning">
                Adblockers can stop this page from loading price data. Disable your adblocker to see market cap and
                prices.
              </Alert>
            </Grid>
          )}
          {account && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ flexGrow: 1, textAlign: 'center', p: 1, borderRadius: 0 }}>
                <Typography variant="body1">Current AGFI Price</Typography>
                <Typography variant="h4" sx={{ fontFamily: 'Roboto' }}>
                  {priceData && priceData.token
                    ? `$${(priceData.token.derivedETH * ethPrice).toFixed(8)}`
                    : 'Loading...'}
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} textAlign="center">
                    AGFI/WETH Uniswap Price
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          )}
          {account && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ flexGrow: 1, textAlign: 'center', p: 1, borderRadius: 0 }}>
                <Typography variant="body1">Market Cap</Typography>
                <Typography variant="h4" sx={{ fontFamily: 'Roboto' }}>
                  {circSupply && priceData && ethPrice
                    ? `$${fNumber(formatUnits(circSupply || 0, 9) * priceData.token.derivedETH * ethPrice)}`
                    : 'Loading...'}
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} textAlign="center">
                    Derived from AGFI/WETH Uniswap Price
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          )}
          {account && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ flexGrow: 1, textAlign: 'center', p: 1, borderRadius: 0 }}>
                <Typography variant="body2">Circulating Supply</Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Roboto' }}>
                  {circSupply ? `${fNumber(formatUnits(circSupply || 0, 9))} AGFI` : 'Loading...'}
                </Typography>
                {circSupply && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} textAlign="center">
                    {fPercent((circSupply.toString() / startingSupply.toString()) * 100)} of Launch Supply
                  </Typography>
                )}
              </Box>
            </Grid>
          )}
          {account && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ flexGrow: 1, textAlign: 'center', p: 1, borderRadius: 0 }}>
                <Typography variant="body2">Burned Supply 🔥</Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Roboto' }}>
                  {burnedSupply ? `${fNumber(formatUnits(burnedSupply || 0, 9))} AGFI` : 'Loading...'}
                </Typography>
                {burnedSupply && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} textAlign="center">
                    {fPercent((burnedSupply.toString() / startingSupply.toString()) * 100)} of Launch Supply
                  </Typography>
                )}
              </Box>
            </Grid>
          )}
          {account && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ flexGrow: 1, textAlign: 'center', p: 1, borderRadius: 0 }}>
                <Typography variant="body2">Total Staked</Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Roboto' }}>
                  {totalStaked ? `${fNumber(formatUnits(totalStaked || 0, 9))} AGFI` : 'Loading...'}
                </Typography>
                {totalStaked && circSupply && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} textAlign="center">
                    {fPercent((totalStaked.toString() / circSupply.toString()) * 100)} of Circulating Supply
                  </Typography>
                )}
              </Box>
            </Grid>
          )}
          {account && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ flexGrow: 1, textAlign: 'center', p: 1, borderRadius: 0 }}>
                <Typography variant="body2">DAO Treasury Balance</Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Roboto' }}>
                  {totalTreasury ? `${fNumber(formatUnits(totalTreasury || 0, 9))} AGFI` : 'Loading...'}
                </Typography>
                {totalTreasury && circSupply && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} textAlign="center">
                    {fPercent((totalTreasury.toString() / circSupply.toString()) * 100)} of Circulating Supply
                  </Typography>
                )}
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box sx={{ flexGrow: 1, textAlign: 'center', p: 1, borderRadius: 0 }}>
              <Typography variant="body2">Trader Treasury Balance</Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Roboto' }}>
                {latestTreasuryBalance ? `${fCurrency(latestTreasuryBalance)}` : 'Loading...'}
              </Typography>
            </Box>
          </Grid>
          {!treasuryLoading && treasuryDataFormatted && (
            <Grid item xs={12}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={treasuryDataFormatted} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTreasury" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.9} />
                      <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(tstamp) => moment(tstamp, 'DD/MM/YYYY').fromNow()} />
                  <YAxis
                    domain={['dataMin - 10000', 'dataMax + 500']}
                    tickFormatter={(value) => `$${Math.round(value.toFixed(0) / 1000) * 1000}`}
                  />
                  <Tooltip
                    formatter={(value) => `$${value.toFixed(0)}`}
                    labelStyle={{ color: 'black' }}
                    labelFormatter={(tstamp) => moment(tstamp, 'DD/MM/YYYY').fromNow()}
                    wrapperStyle={{ color: 'black' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    name="Treasury Value (in USD)"
                    type="monotone"
                    dataKey="amt"
                    stroke="url(#colorTreasury)"
                    fillOpacity={1}
                    fill="url(#colorTreasury)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          )}
          <Grid item xs={12}>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={supplyHistory} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(tstamp) => moment(tstamp).fromNow()} />
                <YAxis domain={['dataMin - 100', 'dataMax']} tickFormatter={(value) => `${value.toFixed(0)}B`} />
                <Tooltip
                  formatter={(value) => `${value}B AGFI`}
                  labelFormatter={(tstamp) => moment(tstamp).fromNow()}
                  labelStyle={{ color: 'black' }}
                  wrapperStyle={{ color: 'black' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area
                  name="Total Supply (in billions)"
                  type="monotone"
                  dataKey="supply"
                  stroke={theme.palette.secondary.main}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Grid>
          {account && (
            <Grid item xs={12}>
              <Card sx={{ display: 'flex', p: 2, borderRadius: 0 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" textAlign="center">
                    Your Claimable Rewards
                  </Typography>
                  {accountInfo && (
                    <Typography variant="h3" sx={{ fontFamily: 'Roboto', textAlign: 'center' }}>
                      {fNumberWithDecimals(formatUnits(accountInfo.withdrawableRewards || 0, 18))} ETH
                    </Typography>
                  )}
                  {accountInfo && ethPrice && (
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'Roboto', textAlign: 'center', color: 'text.secondary' }}
                      gutterBottom
                    >
                      {fCurrency(formatUnits(accountInfo.withdrawableRewards || 0, 18) * ethPrice)} USD
                    </Typography>
                  )}
                  <ButtonGroup size="large" orientation="horizontal" fullWidth>
                    <Button
                      onClick={onClickClaim}
                      disabled={isLoadingClaim || isLoadingCompound}
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: 0 }}
                    >
                      Claim ETH
                    </Button>
                    <Button
                      onClick={onClickCompound}
                      disabled={isLoadingClaim || isLoadingCompound}
                      variant="outlined"
                      color="secondary"
                      sx={{ borderRadius: 0 }}
                    >
                      Swap to AGFI
                    </Button>
                  </ButtonGroup>
                  {claimState && claimState.status === 'PendingSignature' && (
                    <TransactionStatus isLoading message="Waiting for Wallet Signature..." />
                  )}
                  {claimState && claimState.status === 'Mining' && (
                    <TransactionStatus isLoading message="Transaction Pending..." />
                  )}
                  {claimState && claimState.status === 'Success' && (
                    <TransactionStatus isSuccess message="Claim Complete!" />
                  )}
                  {claimState && claimState.status === 'Exception' && (
                    <TransactionStatus isError message={claimState.errorMessage} />
                  )}
                  {compoundState && compoundState.status === 'PendingSignature' && (
                    <TransactionStatus isLoading message="Waiting for Wallet Signature..." />
                  )}
                  {compoundState && compoundState.status === 'Mining' && (
                    <TransactionStatus isLoading message="Transaction Pending..." />
                  )}
                  {compoundState && compoundState.status === 'Success' && (
                    <TransactionStatus isSuccess message="Swap Complete!" />
                  )}
                  {compoundState && compoundState.status === 'Exception' && (
                    <TransactionStatus isError message={compoundState.errorMessage} />
                  )}
                  <Typography variant="body1" textAlign="center" sx={{ paddingTop: 1 }}>
                    Total Claimed Rewards
                  </Typography>
                  {accountInfo && (
                    <Typography variant="h5" sx={{ fontFamily: 'Roboto', textAlign: 'center' }}>
                      {fNumberWithDecimals(formatUnits(accountInfo.totalRewards || 0, 18))} ETH
                    </Typography>
                  )}
                  {accountInfo && ethPrice && (
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'Roboto', textAlign: 'center' }}
                      color="text.secondary"
                    >
                      {fCurrency(formatUnits(accountInfo.totalRewards || 0, 18) * ethPrice)} USD
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          )}
          {account && (
            <Grid item xs={12}>
              <Card sx={{ display: 'flex', p: 2, borderRadius: 0 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', marginBottom: 2 }}>
                    <Tabs
                      value={tabIndex}
                      onChange={(e, newValue) => setTabIndex(newValue)}
                      aria-label="mode tabs"
                      centered
                    >
                      <Tab label="STAKE" {...a11yProps(0)} />
                      <Tab label="UNSTAKE" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={tabIndex} index={0} sx={{ marginBottom: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="h4" textAlign="center">
                        Staking
                      </Typography>
                      <Typography variant="body2" textAlign="center">
                        Stake AGFI to earn a percentage of all AGFI swaps on Uniswap. The yield is not fixed and scales
                        according to how much trading volume there is. If you want to claim your ETH rewards as well,
                        just unstake and claim those separately.
                      </Typography>
                      <Typography variant="body2" textAlign="center" sx={{ color: 'text.secondary' }}>
                        Your Unstaked Balance
                      </Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'Roboto' }} textAlign="center">
                        {fNumber(formatUnits(agfiBalance || 0, 9))} AGFI
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                          label="Amount to Stake"
                          value={stakeAmount}
                          onChange={handleChangeToStake}
                          variant="standard"
                          color="primary"
                          InputProps={{
                            endAdornment: <InputAdornment position="start">AGFI</InputAdornment>,
                            inputMode: 'numeric'
                          }}
                        />
                      </Box>
                      <Alert severity="warning">
                        <AlertTitle>Staking Disabled</AlertTitle>A recent DAO vote decided to turn off staking rewards.
                        No tokens are currently being sent to anyone staked. If you have staked AGFI, it is best to
                        unstake it so you can vote in future DAO proposals.
                      </Alert>
                      <ButtonGroup variant="outlined" fullWidth size="large">
                        <Button
                          onClick={(e) => handleClickToStakePercentage(e, 100)}
                          disabled
                          // disabled={isLoadingDeposit || isLoadingApprove}
                          sx={{ borderRadius: 0 }}
                        >
                          ALL
                        </Button>
                        <Button
                          onClick={onClickApprove}
                          variant="contained"
                          disabled
                          // disabled={stakingAllowance >= actualStakeAmount || isLoadingDeposit || isLoadingApprove}
                          startIcon={<DoneIcon />}
                          sx={{ borderRadius: 0 }}
                        >
                          APPROVE
                        </Button>
                        <Button
                          onClick={onClickStake}
                          variant="contained"
                          disabled
                          // disabled={
                          //   stakingAllowance < actualStakeAmount ||
                          //   stakeAmount < 1 ||
                          //   isLoadingDeposit ||
                          //   isLoadingApprove
                          // }
                          startIcon={<AddBoxIcon />}
                          sx={{ borderRadius: 0 }}
                        >
                          STAKE
                        </Button>
                      </ButtonGroup>
                      {/* <Typography variant="body2" textAlign="center" sx={{ marginTop: 2 }}>
                        If you stake AGFI, you cannot vote in the DAO. Only unstaked and delegated tokens can vote on
                        proposals.
                      </Typography> */}
                    </Stack>
                  </TabPanel>

                  <TabPanel value={tabIndex} index={1} sx={{ marginBottom: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="body2" textAlign="center">
                        Your Staked Balance
                      </Typography>
                      <Typography variant="h5" sx={{ fontFamily: 'Roboto' }} textAlign="center">
                        {fNumber(formatUnits(stakingInfo.depositedAmount || 0, 9))} AGFI
                      </Typography>
                      {stakingInfo && priceData && priceData.token && (
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'Roboto', color: 'text.secondary' }}
                          textAlign="center"
                        >
                          $
                          {fNumber(
                            formatUnits(stakingInfo.depositedAmount || 0, 9) * priceData.token.derivedETH * ethPrice
                          )}
                        </Typography>
                      )}
                      <Typography variant="body2" textAlign="center">
                        Your Pending Rewards
                      </Typography>
                      {pendingReward && (
                        <Typography variant="h5" sx={{ fontFamily: 'Roboto' }} textAlign="center">
                          {fNumber(formatUnits(pendingReward || 0, 9))} AGFI
                        </Typography>
                      )}
                      {pendingReward && priceData && priceData.token && (
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'Roboto', color: 'text.secondary' }}
                          textAlign="center"
                          gutterBottom
                        >
                          ${fNumber(formatUnits(pendingReward || 0, 9) * priceData.token.derivedETH * ethPrice)} USD
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                          label="Amount to Unstake"
                          value={unstakeAmount}
                          onChange={handleChangeToUnstake}
                          variant="standard"
                          color="primary"
                          InputProps={{
                            endAdornment: <InputAdornment position="start">AGFI</InputAdornment>,
                            inputMode: 'numeric'
                          }}
                        />
                      </Box>
                      <ButtonGroup variant="outlined" fullWidth size="large">
                        <Button
                          onClick={(e) => handleClickToUnstakePercentage(e, 100)}
                          disabled={isLoadingWithdraw}
                          sx={{ borderRadius: 0 }}
                        >
                          ALL
                        </Button>
                        <Button
                          onClick={onClickUnstake}
                          variant="contained"
                          sx={{ borderRadius: 0 }}
                          disabled={isLoadingWithdraw || actualUnstakeAmount < 1}
                        >
                          UNSTAKE
                        </Button>
                        <Button
                          onClick={onClickHarvest}
                          variant="contained"
                          color="secondary"
                          sx={{ borderRadius: 0 }}
                          disabled={isLoadingWithdraw || pendingReward > 0}
                        >
                          HARVEST REWARDS
                        </Button>
                      </ButtonGroup>
                      <Typography variant="body2" textAlign="center" sx={{ marginTop: 2 }}>
                        Unstaking your AGFI will also automatically harvest all pending rewards.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} textAlign="center">
                        USD value of rewards is based on the current price of AGFI.
                      </Typography>
                    </Stack>
                  </TabPanel>

                  {withdrawState && withdrawState.status === 'PendingSignature' && (
                    <TransactionStatus isLoading message="Waiting for Wallet Signature..." />
                  )}
                  {withdrawState && withdrawState.status === 'Mining' && (
                    <TransactionStatus isLoading message="Transaction Pending..." />
                  )}
                  {withdrawState && withdrawState.status === 'Success' && (
                    <TransactionStatus isSuccess message="Harvest Complete!" />
                  )}
                  {withdrawState && withdrawState.status === 'Exception' && (
                    <TransactionStatus isError message={withdrawState.errorMessage} />
                  )}
                  {depositState && depositState.status === 'PendingSignature' && (
                    <TransactionStatus isLoading message="Waiting for Wallet Signature..." />
                  )}
                  {depositState && depositState.status === 'Mining' && (
                    <TransactionStatus isLoading message="Transaction Pending..." />
                  )}
                  {depositState && depositState.status === 'Success' && (
                    <TransactionStatus isSuccess message="Stake Complete!" />
                  )}
                  {depositState && depositState.status === 'Exception' && (
                    <TransactionStatus isError message={depositState.errorMessage} />
                  )}
                  {approveState && approveState.status === 'PendingSignature' && (
                    <TransactionStatus isLoading message="Waiting for Wallet Signature..." />
                  )}
                  {approveState && approveState.status === 'Mining' && (
                    <TransactionStatus isLoading message="Transaction Pending..." />
                  )}
                  {approveState && approveState.status === 'Exception' && (
                    <TransactionStatus isError message={approveState.errorMessage} />
                  )}
                  {/* <Typography variant="h6">APR (7D)</Typography>
                  {totalStaked && (
                    <Typography variant="body1" sx={{ fontFamily: 'Roboto' }}>
                      {fPercent(formatUnits(totalStaked || 0, 9))}
                    </Typography>
                  )} */}
                </Box>
              </Card>
            </Grid>
          )}
          {account && (
            <Grid item xs={12}>
              <ContractData priceData={priceData} ethPrice={ethPrice} />
            </Grid>
          )}
          {burnEvents && (
            <Grid item xs={12}>
              <BurnData burnEvents={burnEvents} />
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

export default Dashboard;
