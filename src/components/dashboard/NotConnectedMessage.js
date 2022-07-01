/* eslint-disable jsx-a11y/accessible-emoji */
import { styled } from '@mui/material/styles';
import { Card, Typography, Stack } from '@mui/material';
// utils

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  boxShadow: 'none',
  position: 'relative',
  borderRadius: 0,
  color: theme.palette.error.lighter,
  backgroundColor: theme.palette.error.darker
}));

export default function NotConnectedMessage({ altMessage }) {
  return (
    <RootStyle>
      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography sx={{ typography: 'h4' }}>Wallet Not Connected!</Typography>
        {altMessage ? (
          <Typography sx={{ typography: 'body1' }}>
            Some of this dashboard needs an active wallet connection to work. Please use the "Connect" button at the top
            of the page to connect your browser wallet to view the entire dashboard.
          </Typography>
        ) : (
          <Typography sx={{ typography: 'body1' }}>
            Please use the "Connect" button at the top of the page to connect your browser wallet and view this
            dashboard.
          </Typography>
        )}
      </Stack>
    </RootStyle>
  );
}
