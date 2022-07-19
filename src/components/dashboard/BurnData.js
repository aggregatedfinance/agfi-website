import {
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Chip,
  TableRow,
  TableHead,
  Card,
  IconButton
} from '@mui/material';
import OpenInNewTwoToneIcon from '@mui/icons-material/OpenInNewTwoTone';
import { formatUnits } from '@ethersproject/units';
import { fNumber } from '../../formatNumber';

export default function BurnData({ burnEvents }) {
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
                    {fNumber(formatUnits(row.value, 9))} AGFI 🔥
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
