import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  Stack,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  AlertTitle,
  InputAdornment,
  Divider
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEthers, useTokenBalance, useTokenAllowance } from '@usedapp/core';
import TopBar from './TopBar';

function Launchpad() {
  const { account } = useEthers();
  const [showCreate, setShowCreate] = useState(true);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [liquidityLockFor, setLiquidityLockFor] = useState('1');
  const [website, setWebsite] = useState('');
  const [whitepaper, setWhitepaper] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [blog, setBlog] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('TEST');
  const [validTokenAddress, setValidTokenAddress] = useState(true);
  const [requiresKycForLauncher, setRequiresKycForLauncher] = useState(false);
  const [requiresKycForBuyers, setRequiresKycForBuyers] = useState(false);
  const [exclusiveToAgfi, setExclusiveToAgfi] = useState(false);
  const [percentageLocked, setPercentageLocked] = useState('75');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onClickCreateLaunch = () => {
    setShowCreate(!showCreate);
  };

  const onChangeTokenAddress = (e) => {
    setTokenAddress(e.target.value);
  };

  const onSubmitPresale = (e) => {
    e.preventDefault();
  };

  const onClickApprovePresale = (e) => {
    e.preventDefault();
  };

  const onChangeRequiresKycForLauncher = (e) => {
    setRequiresKycForLauncher(e.target.checked);
  };

  const onChangeRequiresKycForBuyers = (e) => {
    setRequiresKycForBuyers(e.target.checked);
  };

  const onChangeExclusiveToAgfi = (e) => {
    setExclusiveToAgfi(e.target.checked);
  };

  const onChangeTwitter = (e) => {
    // TODO: validate URL
    setTwitter(e.target.value);
  };

  const onChangeWhitepaper = (e) => {
    // TODO: validate URL
    setWhitepaper(e.target.value);
  };

  const onChangeTelegram = (e) => {
    // TODO: validate URL
    setTelegram(e.target.value);
  };

  const onChangeBlog = (e) => {
    // TODO: validate URL
    setBlog(e.target.value);
  };

  const onChangeDescription = (e) => {
    // TODO: validate URL
    setDescription(e.target.value);
  };

  const onChangeLogo = (e) => {
    // TODO: validate URL
    setLogo(e.target.value);
  };

  const onChangeWebsite = (e) => {
    // TODO: validate URL
    setWebsite(e.target.value);
  };

  const onChangePercentageLocked = (e) => {
    setPercentageLocked(e.target.value);
  };

  const onChangeListingPrice = (e) => {
    setListingPrice(e.target.value);
  };

  const onChangeLiquidityLockFor = (e) => {
    setLiquidityLockFor(e.target.value);
  };

  const onChangeStartDate = (e) => {
    setStartDate(e);
  };
  const onChangeEndDate = (e) => {
    setEndDate(e);
  };

  return (
    <>
      <TopBar title="Launchpad" />
      <Container maxWidth="md">
        <Grid container spacing={2} sx={{ my: 2 }} justifyContent="center">
          <Grid item sx={12} textAlign="center">
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome to the AGFI Launchpad
            </Typography>
            <Typography variant="body1" component="p">
              The AGFI launchpad is a unique launchpad offering projects the ability to launch new tokens and liquidity
              with added security and trust provided by Signata. Welcome to the first Decentralized KYC-enforcing
              launchpad.
            </Typography>
            <Alert severity="warning">
              Token launches listed in this launchpad are not officially endorsed by the AGFI community. Always do your
              own research and understand all risks before participating in a launch.
            </Alert>
          </Grid>
          {account && (
            <Grid item xs={12} textAlign="center">
              <Button
                size="large"
                color={showCreate ? 'secondary' : 'primary'}
                variant="contained"
                onClick={onClickCreateLaunch}
              >
                {showCreate ? 'Hide Create Launch' : 'Create Launch'}
              </Button>
            </Grid>
          )}
          {account && showCreate && (
            <Grid item xs={8}>
              <form onSubmit={onSubmitPresale}>
                <Stack spacing={2} textAlign="center">
                  <Typography variant="h5" component="h2" gutterBottom>
                    Launch Your Project
                  </Typography>
                  <TextField
                    required
                    label="Token Address"
                    fullWidth
                    value={tokenAddress}
                    onChange={onChangeTokenAddress}
                  />
                  {validTokenAddress && (
                    <Typography variant="body2" component="p">
                      Pair to be created:
                    </Typography>
                  )}
                  {validTokenAddress && (
                    <Typography variant="body1" component="p">
                      {tokenSymbol} / WETH
                    </Typography>
                  )}
                  {validTokenAddress && (
                    <Typography variant="h6" component="h1" gutterBottom>
                      How many {tokenSymbol} tokens will you presale?
                    </Typography>
                  )}
                  {validTokenAddress && (
                    <TextField
                      label={`Total ${tokenSymbol} Presale Tokens`}
                      fullWidth
                      required
                      placeholder="100000"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">{tokenSymbol}</InputAdornment>
                      }}
                    />
                  )}
                  <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
                    <TextField
                      label={`Price of 1 ${tokenSymbol}`}
                      fullWidth
                      required
                      placeholder="0.001"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">WETH</InputAdornment>
                      }}
                    />
                    <TextField
                      label="WETH Limit Per User"
                      fullWidth
                      required
                      placeholder="1"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">WETH</InputAdornment>
                      }}
                    />
                  </Stack>
                  <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
                    <TextField
                      label="WETH Softcap"
                      fullWidth
                      required
                      placeholder="20"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">WETH</InputAdornment>
                      }}
                    />
                    <TextField
                      label="WETH Hardcap"
                      fullWidth
                      required
                      placeholder="100"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">WETH</InputAdornment>
                      }}
                    />
                  </Stack>
                  <Divider />
                  <Typography variant="h6" component="h1">
                    Presale Period
                  </Typography>
                  {validTokenAddress && (
                    <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="Start Date"
                          value={startDate}
                          onChange={onChangeStartDate}
                          renderInput={(params) => <TextField {...params} />}
                          minDateTime={dayjs().add(7, 'day')}
                          maxDateTime={dayjs().add(3, 'month')}
                        />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="End Date"
                          value={endDate}
                          onChange={onChangeEndDate}
                          renderInput={(params) => <TextField {...params} />}
                          minDateTime={dayjs().add(8, 'day')}
                          maxDateTime={dayjs().add(3, 'month').add(1, 'day')}
                        />
                      </LocalizationProvider>
                    </Stack>
                  )}
                  <Divider />
                  <Typography variant="h6" component="h2">
                    Liquidity
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    size="large"
                    fullWidth
                    value={percentageLocked}
                    onChange={onChangePercentageLocked}
                  >
                    <ToggleButton value="25">25%</ToggleButton>
                    <ToggleButton value="50">50%</ToggleButton>
                    <ToggleButton value="75">75%</ToggleButton>
                    <ToggleButton value="100">100%</ToggleButton>
                  </ToggleButtonGroup>
                  <Typography variant="body1" component="p">
                    Select the percentage of raised WETH to lock in liquidity
                  </Typography>
                  <TextField
                    label="Listing Price"
                    value={listingPrice}
                    onChange={onChangeListingPrice}
                    required
                    placeholder="0.001"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">WETH</InputAdornment>
                    }}
                  />
                  <TextField
                    label="Liquidity Lock for"
                    value={liquidityLockFor}
                    onChange={onChangeLiquidityLockFor}
                    required
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">Years</InputAdornment>
                    }}
                  />
                  <Divider />
                  <Typography variant="h6" component="h2">
                    Project Information
                  </Typography>
                  <TextField
                    required
                    label="Website"
                    value={website}
                    onChange={onChangeWebsite}
                    placeholder="https://myproject.com/"
                  />
                  <TextField
                    required
                    label="Whitepaper"
                    value={whitepaper}
                    onChange={onChangeWhitepaper}
                    placeholder="https://myproject.com/whitepaper.pdf"
                  />
                  <TextField
                    required
                    label="Twitter"
                    value={twitter}
                    onChange={onChangeTwitter}
                    placeholder="https://twitter.com/myproject"
                  />
                  <TextField
                    required
                    label="Telegram"
                    value={telegram}
                    onChange={onChangeTelegram}
                    placeholder="https://t.me/myproject"
                  />
                  <TextField
                    required
                    label="Blog"
                    value={blog}
                    onChange={onChangeBlog}
                    placeholder="https://medium.com/myproject"
                  />
                  <TextField
                    required
                    label="Description"
                    value={description}
                    placeholder="My Project is..."
                    onChange={onChangeDescription}
                    multiline
                    rows={4}
                  />
                  <TextField
                    required
                    label="Logo"
                    value={logo}
                    onChange={onChangeLogo}
                    placeholder="https://myproject.com/logo.png"
                  />
                  <Divider />
                  <Typography variant="h6" component="h1">
                    KYC
                  </Typography>
                  <FormControlLabel
                    control={<Checkbox checked={requiresKycForLauncher} onChange={onChangeRequiresKycForLauncher} />}
                    label="Requires Signata KYC for Creator"
                  />
                  {requiresKycForLauncher && (
                    <Alert severity="success" sx={{ textAlign: 'left' }}>
                      To create this presale you must hold a valid Signata KYC NFT. You can use this to help improve the
                      trust of your project launch, or launch in a regulatory-friendly way.
                    </Alert>
                  )}
                  <FormControlLabel
                    control={<Checkbox checked={requiresKycForBuyers} onChange={onChangeRequiresKycForBuyers} />}
                    label="Requires Signata KYC for Buyers"
                  />
                  {requiresKycForBuyers && (
                    <Alert severity="success" sx={{ textAlign: 'left' }}>
                      All buyers in your presale must hold a valid Signata KYC NFT. You can use this if your local
                      regulators require KYC enforcement of token distribution. This will only enforce KYC for presale
                      buyers, not buyers after the token launch.
                    </Alert>
                  )}
                  <FormControlLabel
                    control={<Checkbox checked={exclusiveToAgfi} onChange={onChangeExclusiveToAgfi} />}
                    label="Exclusive to AGFI Holders (No Launch Fee)"
                  />
                  {exclusiveToAgfi && (
                    <Alert severity="success" sx={{ textAlign: 'left' }}>
                      All buyers in this presale must hold AGFI tokens to participate. By enabling this option you will
                      not be charged the 0.5 ETH launch fee.
                    </Alert>
                  )}
                  <ButtonGroup size="large" orientation="horizontal" fullWidth color="primary" variant="contained">
                    <Button onClick={onClickApprovePresale}>Approve</Button>
                    <Button type="submit">Launch Presale</Button>
                  </ButtonGroup>
                </Stack>
              </form>
            </Grid>
          )}
          <Grid item xs={12} textAlign="center">
            <img src="sig-protected.png" alt="Protected by Signata" style={{ width: 200 }} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Launchpad;
