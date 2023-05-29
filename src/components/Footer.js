import { Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Container maxWidth="md">
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
      <Typography variant="body2" sx={{ color: 'text.secondary', pb: 4, fontSize: 10 }}>
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
