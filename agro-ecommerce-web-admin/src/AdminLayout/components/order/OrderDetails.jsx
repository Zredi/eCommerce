import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { fetchAddressById } from '../../../features/checkoutReducer';
import { Alert, AlertTitle, Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { ArrowLeft } from '@mui/icons-material';
import { clearStatusUpdateError, updateOrderStatus } from '../../../features/OrderReducer';

function OrderDetails() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = useSelector((state) => state.order.selectedOrder);
  const [address, setAddress] = useState(null);
  const { statusUpdateLoading, statusUpdateError } = useSelector((state) => state.order);
  const [status, setStatus] = useState("");
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', message: '' });


  console.log("order", order);

  const clearAlert = useCallback(() => {
    setAlertInfo({ show: false, type: '', message: '' });
    dispatch(clearStatusUpdateError());
  }, [dispatch]);

  const showAlert = useCallback((type, message) => {
    setAlertInfo({ show: true, type, message });
    setTimeout(clearAlert, 3000);
  }, [clearAlert]);

  useEffect(() => {
    if (statusUpdateError) {
      showAlert('error', statusUpdateError);
    }
  }, [statusUpdateError, showAlert]);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  useEffect(() => {
    if (order?.addressId) {
      dispatch(fetchAddressById(order.addressId))
        .unwrap()
        .then((address) => {
          setAddress(address);
        })
        .catch((error) => {
          console.error('Error fetching address:', error);
        });
    }
  }, [order?.addressId, dispatch]);

  const orderStatuses = [
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  ];

  const handleStatusUpdate = async () => {
    if (status === order.orderStatus) return;
    try {
      await dispatch(updateOrderStatus({ orderId: order.id, status })).unwrap();
      showAlert('success', 'Order status updated successfully');
    } catch (error) {
      console.log(error);
    }
  };

  if (!order) {
    return (
      <div className="p-8 mt-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Order not found</h2>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Back
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Typography variant="h3" className="text-lg font-extrabold bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] bg-clip-text text-transparent mb-2">
              Order Details
            </Typography>
            {/* <Typography variant="subtitle1" className="text-gray-500">
              Order #{order.id}
            </Typography> */}
          </div>
          {/* <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/order')}
            className="border-[#5A9A7A] text-[#5A9A7A] hover:bg-[#5A9A7A] hover:text-white transition-all duration-200"
          >
            Back to Orders
          </Button> */}
        </div>

        {alertInfo.show && (
          <Alert
            severity={alertInfo.type}
            className="mb-6"
            onClose={clearAlert}
          >
            <AlertTitle>
              {alertInfo.type === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            {alertInfo.message}
          </Alert>
        )}

        <div className="space-y-6">
          <Paper elevation={3} className="p-6 rounded-lg bg-white shadow-md">
            <Typography variant="h6" className="font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              Order Information
            </Typography>
            <div className="space-y-4">
              <div className="flex items-center gap-5 text-gray-600">
                <Typography variant="subtitle1" className="font-medium">
                  Order Date:
                </Typography>
                <Typography variant="body1">{order.orderDate}</Typography>
              </div>
              {order.items.map((item) => (
                <div key={item.productId} className="grid grid-cols-3 gap-6 items-center border-b border-gray-200 py-3">
                  <Typography variant="body1" className="font-medium text-gray-900">
                    {item.productName} <span className="text-gray-500">({item.productBrand})</span>
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 text-center">
                    Qty: {item.quantity}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 text-right">
                    Price: ₹ {item.price}
                  </Typography>
                </div>
              ))}
              <div className="flex justify-end items-center pt-4">
                <Typography variant="subtitle1" className="font-medium text-gray-700 mr-2">
                  Total Amount:
                </Typography>
                <Typography variant="body1" className="font-bold text-gray-900">
                  ₹ {order.totalAmount}
                </Typography>
              </div>
            </div>
          </Paper>

          <Paper elevation={3} className="p-6 rounded-lg">
            <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
              Shipping Address
            </Typography>
            {address ? (
              <div className="space-y-1">
                <Typography variant="subtitle1" className="font-medium text-gray-800">
                  {address.name}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {address.street}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {`${address.city}, ${address.state} ${address.zipCode}`}
                </Typography>
              </div>
            ) : (
              <Typography variant="body2" className="text-gray-500">
                Loading address...
              </Typography>
            )}
          </Paper>

          <Paper elevation={3} className="p-6 rounded-lg">
            {/* <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
              Order Status
            </Typography> */}
            <div className="flex gap-4 items-center">
              <FormControl variant="outlined" className="w-48">
                <InputLabel id="order-status-label">Order Status</InputLabel>
                <Select
                  labelId="order-status-label"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Order Status"
                  className="bg-white"
                >
                  {orderStatuses.map((statusOption) => (
                    <MenuItem key={statusOption} value={statusOption}>
                      {statusOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleStatusUpdate}
                disabled={statusUpdateLoading || status === order.status}
                className="bg-[#5A9A7A] hover:bg-[#2DD4BF] text-white transition-all duration-200"
              >
                {statusUpdateLoading ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails