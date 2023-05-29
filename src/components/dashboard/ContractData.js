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
  useTheme
} from '@mui/material';
import { formatUnits } from '@ethersproject/units';
import { fShortenNumber, fCurrency } from '../../formatNumber';
import { useGetSingleValue } from '../../hooks';

export default function ContractData({ priceData, ethPrice }) {
  const theme = useTheme();
  const c1Balance = useGetSingleValue('tokensForC1');
  const c2Balance = useGetSingleValue('tokensForC2');
  const c3Balance = useGetSingleValue('tokensForC3');
  const c4Balance = useGetSingleValue('tokensForC4');
  const c5Balance = useGetSingleValue('tokensForC5');
  const swapIndex = useGetSingleValue('swapIndex');
  const buyC1Fee = useGetSingleValue('buyC1Fee');
  const buyC2Fee = useGetSingleValue('buyC2Fee');
  const buyC3Fee = useGetSingleValue('buyC3Fee');
  const buyC4Fee = useGetSingleValue('buyC4Fee');
  const buyC5Fee = useGetSingleValue('buyC5Fee');
  const sellC1Fee = useGetSingleValue('sellC1Fee');
  const sellC2Fee = useGetSingleValue('sellC2Fee');
  const sellC3Fee = useGetSingleValue('sellC3Fee');
  const sellC4Fee = useGetSingleValue('sellC4Fee');
  const sellC5Fee = useGetSingleValue('sellC5Fee');
  const c1Wallet = useGetSingleValue('c1Wallet');
  const c2Wallet = useGetSingleValue('c2Wallet');
  const c2BurningEnabled = useGetSingleValue('c2BurningEnabled');
  const c3Wallet = useGetSingleValue('c3Wallet');
  const c3RewardsEnabled = useGetSingleValue('c3RewardsEnabled');
  const c4Wallet = useGetSingleValue('c4Wallet');
  const c5Wallet = useGetSingleValue('c5Wallet');
  const rewardTracker = useGetSingleValue('rewardTracker');
  const swapC1Enabled = useGetSingleValue('swapC1Enabled');
  const swapC2Enabled = useGetSingleValue('swapC2Enabled');
  const swapC3Enabled = useGetSingleValue('swapC3Enabled');
  const swapC4Enabled = useGetSingleValue('swapC4Enabled');
  const swapC5Enabled = useGetSingleValue('swapC5Enabled');

  return (
    // <RootStyle>
    <Card
      sx={{
        borderRadius: 4,
        border: 1,
        borderColor: theme.palette.secondary.dark,
        boxShadow: '0 0 10px ' + theme.palette.secondary.dark
      }}
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="h4" textAlign="center" color="secondary">
          AGFI Contract Information
        </Typography>
        <Typography variant="h6" textAlign="center">
          <b>Tax Rates and Status</b>
        </Typography>
        <Typography variant="body2">
          Taxes collected on buys and sells are held in the AGFI contract. Every sell on Uniswap executes the sell of
          one of these tax channels, except for the burn channel. When burning is active it will just burn the tokens it
          collects.
        </Typography>
        <TableContainer>
          <Table sx={{ minWidth: 650, borderRadius: 0.5, width: '100%' }} aria-label="tax channels table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Channel Name</TableCell>
                <TableCell align="center">Buy Tax Rate</TableCell>
                <TableCell align="center">Sell Tax Rate</TableCell>
                <TableCell align="right">Collected AGFI</TableCell>
                <TableCell align="right">USD Value</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { name: 'C1 (Treasury)', bal: c1Balance, buyFee: buyC1Fee, sellFee: sellC1Fee },
                { name: 'C2 (Burn)', bal: c2Balance, buyFee: buyC2Fee, sellFee: sellC2Fee },
                { name: 'C3 (Rewards)', bal: c3Balance, buyFee: buyC3Fee, sellFee: sellC3Fee },
                { name: 'C4 (Staking)', bal: c4Balance, buyFee: buyC4Fee, sellFee: sellC4Fee },
                { name: 'C5 (Operations)', bal: c5Balance, buyFee: buyC5Fee, sellFee: sellC5Fee }
              ].map((row, idx) => (
                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">
                    {row.buyFee ? (
                      <Chip
                        label={`${row.buyFee / 100}%`}
                        color="secondary"
                        size="small"
                        sx={{ borderRadius: 0.5, width: '100%' }}
                      />
                    ) : (
                      'Loading...'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {row.sellFee ? (
                      <Chip
                        label={`${row.sellFee / 100}%`}
                        color="secondary"
                        size="small"
                        sx={{ borderRadius: 0.5, width: '100%' }}
                      />
                    ) : (
                      'Loading...'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {row.bal ? `${fShortenNumber(formatUnits(row.bal || 0, 9))} AGFI` : 'Loading...'}
                  </TableCell>
                  <TableCell align="right">
                    {row.bal && ethPrice && priceData
                      ? `${fCurrency(formatUnits(row.bal || 0, 9) * priceData.token.derivedETH * ethPrice)}`
                      : 'Loading...'}
                  </TableCell>
                  <TableCell align="center">
                    {typeof swapIndex === 'number' && idx === swapIndex ? (
                      <Chip
                        label="Swapping Next"
                        color="success"
                        size="small"
                        sx={{ borderRadius: 0.5, width: '100%' }}
                      />
                    ) : (
                      ''
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" textAlign="center">
          <b>Tax Wallet Destinations</b>
        </Typography>

        <Typography variant="body2">
          AGFI is innovative with its 5 modifiable tax channels. Channel 2 is special and can be enabled to burn every
          token it collects. Channel 3 is special and can be enabled to send all tokens it sells to a rewards contract.
        </Typography>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tax channels table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Channel Name</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Optional Features</TableCell>
                <TableCell align="center">Destination Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  C1 (Treasury)
                </TableCell>
                <TableCell align="center">
                  {swapC1Enabled ? (
                    <Chip label="Enabled" color="success" size="small" sx={{ borderRadius: 0.5, width: '100%' }} />
                  ) : (
                    <Chip label="Disabled" color="warning" size="small" sx={{ borderRadius: 0.5, width: '100%' }} />
                  )}
                </TableCell>
                <TableCell align="center" />
                <TableCell align="center" sx={{ fontFamily: 'Roboto Mono' }}>
                  {c1Wallet ? `${c1Wallet.toString()}` : 'Loading...'}
                </TableCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  C2 (Burn)
                </TableCell>
                <TableCell align="center">
                  {swapC2Enabled ? (
                    <Chip label="Enabled" color="success" size="small" sx={{ borderRadius: 0.5, width: '100%' }} />
                  ) : (
                    <Chip label="Disabled" color="warning" size="small" sx={{ borderRadius: 0.5, width: '100%' }} />
                  )}
                </TableCell>
                <TableCell align="center">
                  {c2BurningEnabled ? (
                    <Chip
                      label="Burning Enabled"
                      color="success"
                      size="small"
                      sx={{ borderRadius: 0.5, width: '100%' }}
                    />
                  ) : (
                    ''
                  )}
                </TableCell>
                {c2BurningEnabled ? (
                  <TableCell align="center" sx={{ fontFamily: 'Roboto Mono' }}>
                    0x0000000000000000000000000000000000000000
                  </TableCell>
                ) : (
                  <TableCell align="center" sx={{ fontFamily: 'Roboto Mono' }}>
                    {c2Wallet ? `${c2Wallet.toString()}` : 'Loading...'}
                  </TableCell>
                )}
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  C3 (Rewards)
                </TableCell>
                <TableCell align="center">
                  {swapC3Enabled ? (
                    <Chip label="Enabled" color="success" size="small" sx={{ borderRadius: 0.5, width: '100%' }} />
                  ) : (
                    <Chip label="Disabled" color="warning" size="small" sx={{ borderRadius: 0.5, width: '100%' }} />
                  )}
                </TableCell>
                <TableCell align="center">
                  {c3RewardsEnabled ? (
                    <Chip
                      label="Rewards Enabled"
                      color="success"
                      size="small"
                      sx={{ borderRadius: 0.5, width: '100%' }}
                    />
                  ) : (
                    ''
                  )}
                </TableCell>
                {c3RewardsEnabled ? (
                  <TableCell align="center" sx={{ fontFamily: 'Roboto Mono' }}>
                    {rewardTracker ? `${rewardTracker.toString()}` : 'Loading...'}
                  </TableCell>
                ) : (
                  <TableCell align="center" sx={{ fontFamily: 'Roboto Mono' }}>
                    {c3Wallet ? `${c3Wallet.toString()}` : 'Loading...'}
                  </TableCell>
                )}
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  C4 (Staking)
                </TableCell>
                <TableCell align="center">
                  {swapC4Enabled ? (
                    <Chip label="Enabled" color="success" size="small" sx={{ borderRadius: 0.5, width: '100%' }} />
                  ) : (
                    <Chip label="Disabled" color="warning" size="small" sx={{ borderRadius: 0.5, width: '100%' }} />
                  )}
                </TableCell>
                <TableCell align="center" />
                <TableCell align="center" sx={{ fontFamily: 'Roboto Mono' }}>
                  {c4Wallet ? `${c4Wallet.toString()}` : 'Loading...'}
                </TableCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  C5 (Operations)
                </TableCell>
                <TableCell align="center">
                  {swapC5Enabled ? (
                    <Chip label="Enabled" color="success" size="small" sx={{ borderRadius: 0.5, width: '100%' }} />
                  ) : (
                    <Chip label="Disabled" color="warning" size="small" sx={{ borderRadius: 0.5, width: '100%' }} />
                  )}
                </TableCell>
                <TableCell align="center" />
                <TableCell align="center" sx={{ fontFamily: 'Roboto Mono' }}>
                  {c5Wallet ? `${c5Wallet.toString()}` : 'Loading...'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Card>
    // </RootStyle>
  );
}
