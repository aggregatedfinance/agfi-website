import { createContext, useState, useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { yellow, orange, lightGreen, red, deepOrange } from '@mui/material/colors';

import { Dashboard, Home, Footer } from './components';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    }
  ]);
}

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
          <Router />
          <Footer />
        </>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
