import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Card,
  Container,
  Typography,
  CardContent,
  CardMedia,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableContainer,
  CardActionArea,
  Chip,
  ButtonGroup,
  Button,
  Stack
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import useMediaQuery from '@mui/material/useMediaQuery';
import GhostContentAPI from '@tryghost/content-api';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DnsIcon from '@mui/icons-material/Dns';
import InventoryIcon from '@mui/icons-material/Inventory';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

import { DEXT_URL, DOCS_URL, ETHERSCAN_URL, TWITTER_URL, TG_URL } from '../config';

const api = new GhostContentAPI({
  url: 'https://blog.aggregated.finance',
  key: '6b89710eedcdf2bad628401f2a',
  version: 'v5.0'
});

function FeaturesTable() {
  return (
    <TableContainer>
      <Table aria-label="migration table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">
              <Typography variant="h5">AGFI V1</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="h5">NEW AGFI</Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {[
            { name: 'Reflections', v1Ticked: true, v2Ticked: false },
            { name: 'ETH Rewards', v1Ticked: false, v2Ticked: true },
            // { name: 'Multi Reward Staking', v1Ticked: false, v2Ticked: true },
            { name: 'Auto Burn', v1Ticked: false, v2Ticked: true },
            { name: 'DAO Community Ownership', v1Ticked: false, v2Ticked: true },
            { name: 'Customizable Tax Channels', v1Ticked: false, v2Ticked: true },
            { name: 'Flexible Token Contract', v1Ticked: false, v2Ticked: true },
            { name: 'Automatically Deflationary', v1Ticked: false, v2Ticked: true },
            { name: 'Tax Free Compounding Rewards', v1Ticked: false, v2Ticked: true }
            // { name: 'Alpha Association', v1Ticked: false, v2Ticked: true }
          ].map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row" align="right">
                <Typography variant="h6">{row.name}</Typography>
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {row.v1Ticked && <DoneIcon fontSize="large" />}
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {row.v2Ticked && <DoneIcon fontSize="large" color="success" />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Home() {
  const theme = useTheme();
  const [blogPosts, setBlogPosts] = useState([]);
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await api.posts.browse({ limit: 6, include: 'tags' });
        setBlogPosts(posts);
        console.log(posts);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div
        style={{
          background: theme.palette.mode === 'dark' ? 'url(hero-bg-dark.jpg)' : 'url(hero-bg-white.jpg)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          height: '100vh'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ position: 'absolute', top: '50%', my: 0, transform: 'translateY(-50%)' }}>
            <Grid container justifyContent="center" direction={isMd ? 'column-reverse' : 'reverse'}>
              <Grid item xs={12} md={4} textAlign={isMd ? 'center' : 'left'}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ lineHeight: 0, letterSpacing: '0.2rem', fontFamily: 'Montserrat' }}
                >
                  JOIN THE FUTURE OF
                  <Typography
                    component="span"
                    variant="h2"
                    gutterBottom
                    sx={{
                      letterSpacing: '0.4rem',
                      color: theme.palette.primary.main,
                      fontFamily: 'Montserrat'
                    }}
                  >
                    {' '}
                    COMMUNITY POWERED INVESTING
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ paddingBottom: 3, fontFamily: 'Montserrat' }} gutterBottom>
                  AGFI leads the world of <u>truly</u> decentralized investing by leveraging the power of
                  Farming-as-a-Service. Hold to grow your portfolio. Vote to control the treasury. The future rests with{' '}
                  <u>you</u>.
                </Typography>
                <ButtonGroup
                  sx={{ my: 2 }}
                  orientation={isMd ? 'vertical' : 'horizontal'}
                  variant={theme.palette.mode === 'dark' ? 'outlined' : 'contained'}
                  size="large"
                  fullWidth={isMd}
                >
                  <Button
                    variant="contained"
                    href="/#/dashboard"
                    startIcon={<DashboardIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #CE800D 30%, #f7e51a 90%)',
                      color: '#000',
                      fontFamily: 'Montserrat'
                    }}
                  >
                    DASHBOARD
                  </Button>
                  <Button target="_blank" href="/#/locker" sx={{ fontFamily: 'Montserrat' }}>
                    LOCKER
                  </Button>
                  <Button target="_blank" href={DOCS_URL} sx={{ fontFamily: 'Montserrat' }}>
                    LEARN
                  </Button>
                  <Button target="_blank" href={TG_URL} sx={{ fontFamily: 'Montserrat' }}>
                    TELEGRAM
                  </Button>
                  <Button target="_blank" href={TWITTER_URL} sx={{ fontFamily: 'Montserrat' }}>
                    TWITTER
                  </Button>
                  <Button target="_blank" href={ETHERSCAN_URL} sx={{ fontFamily: 'Montserrat' }}>
                    ETHERSCAN
                  </Button>
                  <Button target="_blank" href={DEXT_URL} sx={{ fontFamily: 'Montserrat' }}>
                    CHART
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid item xs={12} md={8} textAlign="center">
                <img src="agfiv2.png" alt="Aggregated Finance" width={isMd ? 256 : 512} height={isMd ? 256 : 512} />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" sx={{ my: 15 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h2" sx={{ fontFamily: 'Montserrat' }}>
              FINANCE, AGGREGATED.
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }} gutterBottom>
              Farming-as-a-Service (FaaS) has ushered in a new era of DeFi. AGFI is setting ths standard for
              decentralized FaaS, ensuring this emerging segment can maintain the <i>Decentralized</i> in{' '}
              <i>Decentralized Finance</i>.
            </Typography>
            <Button variant="outlined" href={DOCS_URL} target="_blank" color="secondary" startIcon={<SchoolIcon />}>
              Learn More
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <img src="agfiv2.png" alt="Aggregated Finance" width="100%" />
          </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="center" textAlign="center" sx={{ my: 15 }}>
          <Grid item xs={12}>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                fontFamily: 'Montserrat'
              }}
            >
              TOKENOMICS
            </Typography>
          </Grid>
          {[
            {
              title: 'ETH Rewards',
              body: '3% of buy, and 2% of sell volume paid directly in ETH to token holders',
              icon: <EmojiEventsIcon sx={{ fontSize: 64 }} />
            },
            // {
            //   title: 'Staking Rewards',
            //   body: '3% of buy & sell volume distributed to stakers',
            //   icon: <MilitaryTechIcon sx={{ fontSize: 64 }} />
            // },
            {
              title: 'Auto Burn',
              body: '1% of sell volume automatically burned, with 36% supply already burned',
              icon: <LocalFireDepartmentIcon sx={{ fontSize: 64 }} />
            },
            {
              title: 'Stronger Treasury',
              body: '3% of buy & 3% of sell volume funds the treasury',
              icon: <AccountBalanceIcon sx={{ fontSize: 64 }} />
            },
            // {
            //  title: 'Operations',
            //  body: '1% of buy & 3% of sell volume funds operational costs',
            //  icon: <DnsIcon sx={{ fontSize: 64 }} />
            // },
            {
              title: 'Token Supply',
              body: 'Fixed token supply of 1 Trillion AGFI',
              icon: <InventoryIcon sx={{ fontSize: 64 }} />
            },
            {
              title: 'Decentralized',
              body: 'All AGFI is circulating with no presale or team allocations',
              icon: <ChangeCircleIcon sx={{ fontSize: 64 }} />
            }
          ].map((item) => (
            <Grid
              key={item.title}
              item
              xs={12}
              sm={3}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
            >
              <Stack>
                <Typography variant="h6" component="span" sx={{ fontFamily: 'Montserrat' }}>
                  {item.title}
                </Typography>

                <Box sx={{ border: 2, borderRadius: 2, p: 0.5, height: 350, maxWidth: 225 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      height: '100%',
                      background: 'linear-gradient(0deg, rgba(251,140,0,1) 0%, rgba(255,234,0,1) 100%)',
                      verticalAlign: 'middle'
                    }}
                  >
                    <Typography variant="h5" color="black" sx={{ py: 3, height: 220, fontFamily: 'Montserrat' }}>
                      <b>{item.body}</b>
                    </Typography>
                    {item.icon}
                  </Box>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} alignItems="center" sx={{ my: 15 }}>
          {!isMd && (
            <Grid item xs={12} md={8}>
              <FeaturesTable />
            </Grid>
          )}
          <Grid item xs={12} md={4}>
            <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Montserrat' }}>
              UPGRADE TO THE NEXT LEVEL
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>
              AGFI V1 built the foundation for a truly unique FaaS protocol. The new AGFI brings the next step of
              absolute power to the community for rewards, growth, and voting.
            </Typography>
          </Grid>
          {isMd && (
            <Grid item xs={12} md={8}>
              <FeaturesTable />
            </Grid>
          )}
        </Grid>

        <Grid container spacing={4} alignItems="center" sx={{ my: 15 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Montserrat' }}>
              COMMUNITY POWERED
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>
              Your vote matters, controlling the AGFI treasury, the tokenomics, the taxes, the rewards, and much more.
              The future of AGFI is controlled by <u>you</u>.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            {/* img max width */}
            <img src="dao.png" alt="Aggregated Finance DAO" width="100%" />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', fontFamily: 'Montserrat' }}>
              LATEST NEWS
            </Typography>
          </Grid>
          {blogPosts.map((post) => (
            <Grid item key={post.id} xs={12} md={6}>
              <Card sx={{ minHeight: 450 }}>
                <CardActionArea href={post.url} target="_blank">
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.feature_image || 'post-default.png'}
                    alt="Feature Image"
                  />
                  <CardContent>
                    <Typography variant="h4" paddingBottom sx={{ fontFamily: 'Montserrat' }}>
                      {post.title}
                    </Typography>
                    {post.tags &&
                      post.tags.map((tag) => (
                        <Chip key={tag.id} label={tag.name} size="small" sx={{ fontFamily: 'Montserrat' }} />
                      ))}
                    <Typography variant="body1" paddingTop sx={{ fontFamily: 'Montserrat' }}>
                      {post.excerpt && post.excerpt.length <= 150 ? post.excerpt : `${post.excerpt.slice(0, 150)}...`}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
