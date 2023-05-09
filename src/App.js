import { createContext, useState, useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { yellow, orange, lightGreen, red, deepOrange } from '@mui/material/colors';

import { Dashboard, Launchpad, Home, Footer, Locker, NFT } from './components';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function App() {
  const [mode, setMode] = useState('dark');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      }
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
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
        }
      }),
    [mode]
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="dashboard" element={<Dashboard colorMode={colorMode} />} />
            {/* <Route path="launchpad" element={<Launchpad colorMode={colorMode} />} /> */}
            <Route path="locker/:addr?" element={<Locker colorMode={colorMode} mode={mode} />} />
            <Route path="nft" element={<NFT colorMode={colorMode} mode={mode} />} />
          </Routes>
          <Footer colorMode={colorMode} />
        </>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
