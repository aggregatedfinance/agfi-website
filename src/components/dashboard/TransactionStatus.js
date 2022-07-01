import { CircularProgress, Typography, Box } from '@mui/material';

function TransactionStatus(props) {
  const { isLoading, isSuccess, isError, message } = props;
  return (
    <Box sx={{ textAlign: 'center', padding: 2 }}>
      {isLoading && <CircularProgress color="info" />}
      {isSuccess && <CircularProgress variant="determinate" value={100} color="success" />}
      {isError && <CircularProgress variant="determinate" value={75} color="error" />}
      {message && (
        <Typography variant="body2" color={isError ? 'error' : 'text.secondary'}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default TransactionStatus;
