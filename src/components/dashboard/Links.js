import { Grid, Button } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import TableChartIcon from '@mui/icons-material/TableChart';
import TelegramIcon from '@mui/icons-material/Telegram';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BallotIcon from '@mui/icons-material/Ballot';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import SchoolIcon from '@mui/icons-material/School';
import {
  BLOG_URL,
  DAO_MGMT_URL,
  DAO_URL,
  DEXT_URL,
  DOCS_URL,
  ETHERSCAN_URL,
  TREASURY_URL,
  TWITTER_URL,
  UNISWAP_URL,
  TG_URL
} from '../../config';

export default function Links() {
  return (
    // <RootStyle>
    <Grid container spacing={1}>
      {[
        { xs: 12, sm: 6, md: 6, name: 'DAO Proposals', url: DAO_MGMT_URL, logo: <BallotIcon /> },
        { xs: 12, sm: 6, md: 6, name: 'DAO Voting', url: DAO_URL, logo: <HowToVoteIcon /> },
        { xs: 12, sm: 6, md: 6, name: 'Treasury', url: TREASURY_URL, logo: <PieChartOutlineIcon /> },
        { xs: 12, sm: 6, md: 6, name: 'News', url: BLOG_URL, logo: <NewspaperIcon /> },
        { xs: 12, sm: 6, md: 6, name: 'Twitter', url: TWITTER_URL, logo: <TwitterIcon /> },
        { xs: 12, sm: 6, md: 6, name: 'Telegram', url: TG_URL, logo: <TelegramIcon /> },
        { xs: 12, sm: 6, md: 4, name: 'Uniswap', url: UNISWAP_URL, logo: <CurrencyExchangeIcon /> },
        { xs: 12, sm: 6, md: 4, name: 'Etherscan', url: ETHERSCAN_URL, logo: <TableChartIcon /> },
        { xs: 12, sm: 6, md: 4, name: 'Chart', url: DEXT_URL, logo: <CandlestickChartIcon /> },
        { xs: 12, sm: 12, md: 12, name: 'Documentation', url: DOCS_URL, logo: <SchoolIcon /> }
      ].map((link) => (
        <Grid key={link.name} item xs={link.xs} sm={link.sm} md={link.md} textAlign="center">
          <Button
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={link.logo}
            size="large"
            fullWidth
            variant="outlined"
            color="info"
            sx={{ height: 56, borderRadius: 0 }}
          >
            {link.name}
          </Button>
        </Grid>
      ))}
    </Grid>
    // </RootStyle>
  );
}
