import { useEffect, useState } from 'react';
import {
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Card,
  Grid,
  Paper,
  useTheme,
  Box,
  LinearProgress,
  Alert,
  AlertTitle,
  CardHeader,
  CardContent,
  CardActionArea,
  IconButton
} from '@mui/material';
import OpenInNewTwoToneIcon from '@mui/icons-material/OpenInNewTwoTone';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import { formatUnits } from '@ethersproject/units';
import moment from 'moment';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" color="success" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function OpenLaunches({ account }) {
  const theme = useTheme();
  const [openLaunches, setOpenLaunches] = useState([
    {
      id: 0,
      name: 'Test Token',
      symbol: 'TST',
      decimals: 18,
      totalSupply: '1000000000',
      address: '0x5f7295Cae500E73a59478af958771c5b68FA448E',
      website: 'https://test.com',
      twitter: 'https://twitter.com/test',
      telegram: 'https://t.me/test',
      description: 'Description of the project.',
      logo: 'https://test.com/logo.png',
      startBlock: 100,
      endBlock: 200,
      status: 'open',
      softCap: 100,
      hardCap: 200,
      raised: 5,
      price: '0'
    }
  ]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ pt: 2 }}>
        Open Launches
      </Typography>
      {openLaunches.length === 0 && (
        <Box sx={{ p: 1 }}>
          <Alert severity="info">
            <AlertTitle>No Open Launches</AlertTitle>
            There are no open launches yet.
          </Alert>
        </Box>
      )}
      <Grid container spacing={1}>
        {openLaunches.map((launch) => (
          <Grid item xs={12} sm={6} md={4} key={launch.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {launch.name} ({launch.symbol})
                </Typography>
                <Typography variant="body2">{launch.description}</Typography>
                <Typography variant="body2">Start Block: {launch.startBlock}</Typography>
                <Typography variant="body2">End Block: {launch.endBlock}</Typography>
                <Typography variant="body2">Soft Cap: {launch.softCap} ETH</Typography>
                <Typography variant="body2">Hard Cap: {launch.hardCap} ETH</Typography>
                <LinearProgressWithLabel value={(launch.raised / launch.softCap) * 100} />
              </CardContent>
              <CardActionArea sx={{ textAlign: 'center' }}>
                <IconButton href={launch.website} target="_blank">
                  <LanguageIcon />
                </IconButton>
                <IconButton href={launch.telegram} target="_blank">
                  <TelegramIcon />
                </IconButton>
                <IconButton href={launch.twitter} target="_blank">
                  <TwitterIcon />
                </IconButton>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
