import { createContext, useState, useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { yellow, orange, lightGreen, red, deepOrange } from '@mui/material/colors';

import { Dashboard, Launchpad, Home, Footer, Locker, NFT } from './components';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: yellow.A400
      },
      secondary: {
        main: orange[800]
      },
      success: {
        main: lightGreen.A400
      },
      error: {
        main: red.A400
      },
      warning: {
        main: deepOrange[600]
      }
    },
    typography: {
      fontFamily: [
        'Montserrat',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(',')
    }
  });

  return (
    <ColorModeContext.Provider>
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* <Route path="launchpad" element={<Launchpad />} /> */}
            <Route path="locker/:addr?" element={<Locker />} />
            <Route path="nft" element={<NFT />} />
          </Routes>
          <Footer />
        </>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
