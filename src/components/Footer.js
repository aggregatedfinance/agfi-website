import { Container, Typography, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';

export default function Footer(props) {
  const { colorMode } = props;
  const theme = useTheme();
  return (
    <Container maxWidth="md">
      <Box textAlign="center" sx={{ mt: 5, mb: 2 }}>
        <IconButton sx={{ mx: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Typography
        variant="body1"
        component="p"
        sx={{
          pb: 2,
          fontSize: 13,
          textAlign: { xs: 'center' }
        }}
      >
        © {new Date().getFullYear()} Aggregated Finance. All rights reserved.
      </Typography>
      <Typography component="i" variant="body2" sx={{ color: 'text.secondary', pb: 4, fontSize: 8 }}>
        Disclaimer: The Content on this Site is for informational purposes only, you should not construe any such
        information or other material as legal, tax, investment, financial, or other advice. Nothing contained on our
        Site constitutes a solicitation, recommendation, endorsement, or offer by Aggregated Finance or any third party
        service provider to buy or sell any securities or other financial instruments in this or in in any other
        jurisdiction in which such solicitation or offer would be unlawful under the securities laws of such
        jurisdiction. All Content on this site is information of a general nature and does not address the circumstances
        of any particular individual or entity. Nothing in the Site constitutes professional and/or financial advice,
        nor does any information on the Site constitute a comprehensive or complete statement of the matters discussed
        or the law relating thereto. Aggregated Finance is not a fiduciary by virtue of any person's use of or access to
        the Site or Content. You alone assume the sole responsibility of evaluating the merits and risks associated with
        the use of any information or other Content on the Site before making any decisions based on such information or
        other Content. In exchange for using the Site, you agree not to hold Aggregated Finance, its affiliates or any
        third party service provider liable for any possible claim for damages arising from any decision you make based
        on information or other Content made available to you through the Site.
      </Typography>
    </Container>
  );
}
