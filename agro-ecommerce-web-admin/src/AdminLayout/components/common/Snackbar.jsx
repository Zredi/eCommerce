import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { hideSnackbar } from '../../../features/snackbarReducer';

const CustomSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity, duration } = useSelector((state) => state.snackbar);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        marginTop: '50px',
        marginRight: '20px'
      }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        sx={{ 
          width: '100%',
          minWidth: '300px',
          backgroundColor: severity === 'success' ? '#2e7d32' : 
                         severity === 'error' ? '#d32f2f' :
                         severity === 'warning' ? '#ed6c02' : '#0288d1',
          color: '#fff',
          '& .MuiAlert-message': {
            fontSize: '0.9rem',
            fontWeight: 500
          },
          '& .MuiAlert-icon': {
            color: '#fff'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;