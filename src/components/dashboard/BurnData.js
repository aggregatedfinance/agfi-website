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
  IconButton,
  Paper,
  useTheme
} from '@mui/material';
import OpenInNewTwoToneIcon from '@mui/icons-material/OpenInNewTwoTone';
import { formatUnits } from '@ethersproject/units';
import moment from 'moment';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer, Legend } from 'recharts';
import { fShortenNumber } from '../../formatNumber';

export default function BurnData({ burnEvents }) {
  const [burnData, setBurnData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (burnEvents) {
      const newData = [];
      burnEvents.forEach((event) => {
        const { timestamp, value } = event;
        newData.push({
          timestamp,
          amount: formatUnits(value || 0, 9) / 1000000
        });
      });
      setBurnData(newData.sort((a, b) => a.timestamp - b.timestamp));
    }
  }, [burnEvents]);

  return (
    // <RootStyle>
    <Card>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="h5" textAlign="center">
          Recent Auto Burns
        </Typography>
        <Typography variant="body2">
          AGFI Burns a percentage of every sell transaction. The rate and amount of burns scales according to
          transaction size and volume. You can view the last 10 burns here that have been performed automatically by the
          AGFI contract.
        </Typography>
        <Paper elevation={3}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={burnData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.warning.main} stopOpacity={0.9} />
                  <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(tstamp) => moment(tstamp * 1000).fromNow()} />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Area
                name="Amount Burned (in millions)"
                type="monotone"
                dataKey="amount"
                stroke={theme.palette.error.main}
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
        <TableContainer>
          <Table aria-label="burn events table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left">Time</TableCell>
                <TableCell align="right">Amount Burned</TableCell>
                <TableCell align="left">Etherscan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {burnEvents.map((row) => (
                <TableRow key={row.transactionHash}>
                  <TableCell align="left">{new Date(row.timestamp * 1000).toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'Roboto Mono' }}>
                    {fShortenNumber(formatUnits(row.value, 9))} AGFI 🔥
                  </TableCell>
                  <TableCell align="left">
                    <IconButton
                      href={`https://etherscan.io/tx/${row.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      <OpenInNewTwoToneIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Card>
    // </RootStyle>
  );
}
