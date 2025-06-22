import { showSnackbar } from '../features/snackbarReducer';

export const showSuccessSnackbar = (dispatch, message) => {
  dispatch(showSnackbar({
    message,
    severity: 'success',
    duration: 3000
  }));
};

export const showWarningSnackbar = (dispatch, message) => {
  dispatch(showSnackbar({
    message,
    severity: 'warning',
    duration: 3000
  }));
};

export const showErrorSnackbar = (dispatch, message) => {
  dispatch(showSnackbar({
    message,
    severity: 'error',
    duration: 5000
  }));
}; 