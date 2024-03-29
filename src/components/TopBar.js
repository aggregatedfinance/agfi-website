import { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useEthers, shortenAddress } from '@usedapp/core';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { UNISWAP_URL } from '../config';

const infuraId = 'dab56da72e89492da5a8e77fbc45c7fa';

const customNetworkOptions = {
  rpcUrl: 'https://rpc-mainnet.maticvigil.com',
  chainId: 137
};

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId
    }
  },
  binancechainwallet: {
    package: true
  },
  fortmatic: {
    package: Fortmatic,
    options: {
      key: 'pk_live_1BC1ABDD1464609D',
      network: customNetworkOptions
    }
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: 'AGFI Dashboard', // Required
      infuraId, // Required
      rpc: '', // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      darkMode: false // Optional. Use dark theme, defaults to false
    }
  }
};

const web3Modal = new Web3Modal({
  providerOptions
});

function TopBar(props) {
  const { title } = props;

  const { account, activate, chainId, activateBrowserWallet } = useEthers();

  const handleConnect = async () => {
    try {
      const provider = await web3Modal.connect();

      await provider.enable();

      activate(provider);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    activateBrowserWallet();
  }, [activateBrowserWallet]);

  useEffect(() => {
    if (chainId && chainId !== 1 && chainId !== 5) {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }]
      });
    }
  }, [chainId]);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ width: 40, height: 40, mx: 2 }} src="/logo-new.png" component="img" />
        <IconButton href="/" sx={{ mr: 1 }} color="inherit">
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {account && (
          <Box sx={{ px: 1, mx: 1, backgroundColor: 'palette.secondary.dark', borderRadius: 2 }}>
            <Typography variant="subtitle1" noWrap>
              {account && shortenAddress(account)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {chainId === 1 ? 'Ethereum' : 'Wrong Network - Please switch to Ethereum!'}
            </Typography>
          </Box>
        )}
        {/* <IconButton sx={{ mx: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton> */}
        <Button target="_blank" href={UNISWAP_URL} color="primary" variant="text">
          Buy AGFI
        </Button>
        {!account && (
          <Button onClick={handleConnect} color="primary" variant="contained" sx={{ mx: 1 }}>
            Connect
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
