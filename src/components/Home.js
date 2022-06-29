import { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Link } from '@reach/router';
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

import { DEXT_URL, DOCS_URL, ETHERSCAN_URL, TWITTER_URL, TG_URL } from '../config';

const api = new GhostContentAPI({
  url: 'https://aggregated-finance.ghost.io',
  key: '85a4d049a908d7d990c7bd53fd',
  version: 'v5.0'
});

const RootStyle = styled('div')({
  height: '100%'
});

const HeroRootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  // backgroundColor: theme.palette.common.black,
  backgroundColor: '#171717',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center'
  }
}));

const HeroContentStyle = styled((props) => <Stack spacing={2} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 520,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(40),
  paddingBottom: theme.spacing(40),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left'
  }
}));

const HeroOverlayStyle = styled('img')({
  zIndex: 1,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

const HeroImgStyle = styled('img')(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  margin: 'auto',
  [theme.breakpoints.down('md')]: {
    zIndex: 2
  },
  position: 'absolute',
  [theme.breakpoints.up('md')]: {
    right: '5%',
    top: '2%',
    width: 'auto',
    height: '28vh',
    zIndex: 3
  },
  [theme.breakpoints.up('lg')]: {
    right: '10%',
    top: '2%',
    width: 'auto',
    height: '35vh',
    zIndex: 3
  },
  [theme.breakpoints.up('xl')]: {
    right: '15%',
    top: '2%',
    width: 'auto',
    height: '48vh',
    zIndex: 3
  }
}));

const OverviewRootStyle = styled('div')(({ theme }) => ({
  // padding: theme.spacing(4, 0),
  paddingTop: theme.spacing(4),
  backgroundImage: 'none'
}));

const MainContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

const ContentStyle = styled('div')(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  // marginBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    marginBottom: 0
  }
}));

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
            { name: 'Multi Reward Staking', v1Ticked: false, v2Ticked: true },
            { name: 'Auto Burn', v1Ticked: false, v2Ticked: true },
            { name: 'DAO Community Ownership', v1Ticked: false, v2Ticked: true },
            { name: 'Customizable Tax Channels', v1Ticked: false, v2Ticked: true },
            { name: 'Flexible Token Contract', v1Ticked: false, v2Ticked: true },
            { name: 'Automatically Deflationary', v1Ticked: false, v2Ticked: true },
            { name: 'Tax Free Compounding Rewards', v1Ticked: false, v2Ticked: true },
            { name: 'Alpha Association', v1Ticked: false, v2Ticked: true }
          ].map((row, index) => (
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
    <Container maxWidth="lg">
      {/* <HeroOverlayStyle alt="overlay" src="BG2.jpg" />
      <HeroImgStyle alt="hero" src="agfiv2.png" />
      <Container maxWidth="lg">
        <HeroContentStyle>
          <Typography
            variant="h4"
            sx={{
              letterSpacing: '0.2em'
              // lineHeight: 2
            }}
            gutterBottom
          >
            JOIN THE FUTURE OF
            <Typography
              component="span"
              variant="h2"
              sx={{
                color: 'primary.main',
                letterSpacing: '0.2em'
                // lineHeight: 2
              }}
              gutterBottom
            >
              {' '}
              COMMUNITY POWERED INVESTING
            </Typography>
          </Typography>
          <Typography variant="body1" sx={{ paddingBottom: 3 }} gutterBottom>
            AGFI leads the world of <u>truly</u> decentralized investing by leveraging the power of
            Farming-as-a-Service. Hold to grow your portfolio. Vote to control the treasury. The future rests with{' '}
            <u>you</u>.
          </Typography>
          <ButtonGroup orientation={isMd ? 'vertical' : 'horizontal'} size="medium" fullWidth={isMd}>
            <Button
              size="large"
              variant="contained"
              href="/dashboard"
              startIcon={<DashboardIcon />}
              sx={{
                background: 'linear-gradient(45deg, #CE800D 30%, #f7e51a 90%)',
                color: '#000'
              }}
            >
              DASHBOARD
            </Button>
            <Button variant="outlined" href={DOCS_URL} target="_blank">
              LEARN
            </Button>
            <Button variant="outlined" href={TG_URL} target="_blank">
              TELEGRAM
            </Button>
            <Button target="_blank" variant="outlined" href={TWITTER_URL}>
              TWITTER
            </Button>
            <Button target="_blank" variant="outlined" href={ETHERSCAN_URL}>
              ETHERSCAN
            </Button>
            <Button variant="outlined" target="_blank" href={DEXT_URL}>
              CHART
            </Button>
          </ButtonGroup>
        </HeroContentStyle>
      </Container> */}
      {/* <Box sx={{ height: { md: '100vh' } }} /> */}
      <Grid container spacing={4} alignItems="center" sx={{ my: 15 }}>
        <Grid item xs={12} md={4}>
          {/* <Typography variant="h2" sx={{ mb: 3, letterSpacing: '0.5rem', lineHeight: 1.5 }}> */}
          <Typography
            variant="h4"
            sx={{
              letterSpacing: '0.2em'
              // lineHeight: 2
            }}
            gutterBottom
          >
            JOIN THE FUTURE OF
            <Typography
              component="span"
              variant="h2"
              sx={{
                color: 'primary.main',
                letterSpacing: '0.2em'
                // lineHeight: 2
              }}
              gutterBottom
            >
              {' '}
              COMMUNITY POWERED INVESTING
            </Typography>
          </Typography>
          <Typography variant="body1" sx={{ paddingBottom: 3 }} gutterBottom>
            AGFI leads the world of <u>truly</u> decentralized investing by leveraging the power of
            Farming-as-a-Service. Hold to grow your portfolio. Vote to control the treasury. The future rests with{' '}
            <u>you</u>.
          </Typography>
          <ButtonGroup orientation={isMd ? 'vertical' : 'horizontal'} size="medium" fullWidth={isMd}>
            <Button
              size="large"
              variant="contained"
              href="/dashboard"
              startIcon={<DashboardIcon />}
              sx={{
                background: 'linear-gradient(45deg, #CE800D 30%, #f7e51a 90%)',
                color: '#000'
              }}
            >
              DASHBOARD
            </Button>
            <Button variant="outlined" href={DOCS_URL} target="_blank">
              LEARN
            </Button>
            <Button variant="outlined" href={TG_URL} target="_blank">
              TELEGRAM
            </Button>
            <Button target="_blank" variant="outlined" href={TWITTER_URL}>
              TWITTER
            </Button>
            <Button target="_blank" variant="outlined" href={ETHERSCAN_URL}>
              ETHERSCAN
            </Button>
            <Button variant="outlined" target="_blank" href={DEXT_URL}>
              CHART
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} md={8}>
          {/* img max width */}
          <img src="agfiv2.png" alt="Aggregated Finance" width="100%" />
        </Grid>
      </Grid>

      <Grid container spacing={4} alignItems="center" sx={{ my: 15 }}>
        <Grid item xs={12} md={8}>
          {/* <Typography variant="h2" sx={{ mb: 3, letterSpacing: '0.5rem', lineHeight: 1.5 }}> */}
          <Typography variant="h2">FINANCE, AGGREGATED.</Typography>
          <Typography variant="body1" gutterBottom>
            Farming-as-a-Service (FaaS) has ushered in a host of new community-influenced investment vehicles. AGFI is
            leading the charge, setting the standard for <i>all of DeFi</i>.
          </Typography>
          <Button variant="outlined" href={DOCS_URL} target="_blank" color="secondary" startIcon={<SchoolIcon />}>
            Learn More
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* img max width */}
          <img src="overview2.png" alt="Aggregated Finance" width="100%" />
        </Grid>
      </Grid>

      <Grid container spacing={4} alignItems="center" sx={{ my: 15 }}>
        <Grid item xs={12}>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center'
            }}
          >
            TOKENOMICS
          </Typography>
        </Grid>
        <Grid item xs={12} paddingBottom={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="token1.png" alt="Tokenomics" width="100%" />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="tokenom1.png"
            alt="Tokenomics1"
            width="100%"
            // sx={{ maxWidth: '100%', margin: 'auto', marginLeft: 'auto', marginRight: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="tokenom2.png"
            alt="Tokenomics2"
            width="100%"
            // sx={{ maxWidth: '100%', margin: 'auto', marginLeft: 'auto', marginRight: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="tokenom3.png"
            alt="Tokenomics3"
            width="100%"
            // sx={{ maxWidth: '100%', margin: 'auto', marginLeft: 'auto', marginRight: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="tokenom4.png"
            alt="Tokenomics4"
            width="100%"
            // sx={{ maxWidth: '100%', margin: 'auto', marginLeft: 'auto', marginRight: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="tokenom5.png"
            alt="Tokenomics5"
            width="100%"
            // sx={{ maxWidth: '100%', margin: 'auto', marginLeft: 'auto', marginRight: 'auto' }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} alignItems="center" sx={{ my: 15 }}>
        {!isMd && (
          <Grid item xs={12} md={8}>
            <FeaturesTable />
          </Grid>
        )}
        <Grid item xs={12} md={4}>
          {/* <Typography variant="h2" sx={{ mb: 3, letterSpacing: '0.5rem', lineHeight: 1.5 }}> */}
          <Typography variant="h3" gutterBottom>
            UPGRADE TO THE NEXT LEVEL
          </Typography>
          <Typography variant="body1">
            AGFI V1 built the foundation for a truly unique FaaS protocol. The new AGFI brings the next step of absolute
            power to the community for rewards, growth, and voting.
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
          {/* <Typography variant="h2" sx={{ mb: 3, letterSpacing: '0.5rem', lineHeight: 1.5 }}> */}
          <Typography variant="h3" gutterBottom>
            COMMUNITY POWERED
          </Typography>
          <Typography variant="body1">
            Your vote matters, controlling the AGFI treasury, the tokenomics, the taxes, the rewards, and much more. The
            future of AGFI is controlled by <u>you</u>.
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          {/* img max width */}
          <img src="dao.png" alt="Aggregated Finance DAO" width="100%" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* <Typography variant="h2" sx={{ textAlign: 'center', letterSpacing: '0.5rem', paddingBottom: 5 }}> */}
          <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
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
                  <Typography variant="h4" paddingBottom>
                    {post.title}
                  </Typography>
                  {post.tags && post.tags.map((tag) => <Chip key={tag.id} label={tag.name} size="small" />)}
                  <Typography variant="body1" paddingTop>
                    {post.excerpt && post.excerpt.length <= 150 ? post.excerpt : `${post.excerpt.slice(0, 150)}...`}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;
