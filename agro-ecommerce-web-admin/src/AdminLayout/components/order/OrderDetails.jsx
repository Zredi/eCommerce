import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { fetchAddressById } from '../../../features/checkoutReducer';
import { Alert, AlertTitle, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ArrowLeft } from '@mui/icons-material';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { clearStatusUpdateError, updateOrderStatus } from '../../../features/OrderReducer';

function OrderDetails() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = useSelector((state) => state.order.selectedOrder);
  const [address, setAddress] = useState(null);
  const {statusUpdateLoading, statusUpdateError} = useSelector((state) => state.order);
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
    if(status === order.orderStatus) return;
    try{
      await dispatch(updateOrderStatus({orderId: order.id, status})).unwrap();
      showAlert('success', 'Order status updated successfully');
    }catch(error){
      console.log(error);
    }
  };

  if (!order) {
    return (
      <div className="p-8 mt-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Order not found</h2>
          <Button onClick={() => navigate('/order')} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="p-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-gray-500">Order #{order.id}</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className='flex gap-2 pb-2'>
                <h3 className="font-medium text-gray-500">Order Date :</h3>
                <p>{order.orderDate}</p>
              </div>
              {order.items.map((item) => (
                <div key={item.productId} className="grid grid-cols-3">
                  <h4 className="font-medium">{item.productName}<span className='text-gray-500'>({item.productBrand})</span></h4>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-gray-500">Price: ₹ {item.price}</p>
                </div>
              ))}
              <div className='flex justify-end gap-2 pt-2'>
                <h3 className="font-medium">Total Amount :</h3>
                <p>₹ {order.totalAmount}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardBody>
              {address ? (
                <div>
                  <p className="font-medium">{address.name}</p>
                  <p>{address.street}</p>
                  <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                </div>
              ) : (
                <p className="text-gray-500">Loading address...</p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex gap-4 items-center">
                <FormControl variant="outlined" className="w-48">
                  <InputLabel id="order-status-label">Order Status</InputLabel>
                  <Select
                    labelId="order-status-label"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    label="Order Status"
                  >
                    {orderStatuses.map((statusOption) => (
                      <MenuItem key={statusOption} value={statusOption}>
                        {statusOption}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={statusUpdateLoading || status === order.status}
                >
                  {statusUpdateLoading ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails