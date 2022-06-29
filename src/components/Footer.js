import { Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Container>
      <Typography
        component="p"
        variant="body2"
        sx={{
          mt: 10,
          pb: 5,
          fontSize: 13,
          color: 'text.secondary',
          textAlign: { xs: 'center' }
        }}
      >
        © {new Date().getFullYear()} Aggregated Finance. All rights reserved.
      </Typography>
    </Container>
  );
}
