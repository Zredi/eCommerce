import { useEffect } from 'react';
import './Order.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../../../features/OrderReducer';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { getReturnByOrder, getUserReturns } from '../../../features/ReturnReducer';

const statusStyles = {
  PENDING: {
    background: "blue",
    border: "blue",
    height: "10px",
    width: "10px",
  },
  PROCESSING: {
    background: "orange",
    border: "orange",
    height: "10px",
    width: "10px",
  },
  SHIPPED: {
    background: "orange",
    border: "orange",
    height: "10px",
    width: "10px",
  },
  DELIVERED: {
    background: "green",
    border: "green",
    height: "10px",
    width: "10px",
  },
  CANCELLED: {
    background: "red",
    border: "red",
    height: "10px",
    width: "10px",
  },
  RETURNED: {
    background: "orange",
    border: "orange",
    height: "10px",
    width: "10px",
  }
};

const getReturnStatusLabel = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Return Requested';
    case 'APPROVED':
      return 'Return Approved';
    case 'COMPLETED':
      return 'Return Completed';
    default:
      return null;
  }
};

function UserOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userOrders, loading, error } = useSelector((state) => state.order);
  const { returns } = useSelector((state) => state.return);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserOrders(userId));
      dispatch(getUserReturns(userId));
    }
  }, [dispatch, userId]);

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-green-600"></div>
  </div>;
  if (error) return <div>Error: {error.message}</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (userOrders.length === 0) {
    const imgurl = "https://cdn-icons-png.flaticon.com/128/17569/17569003.png";
    return <Box className="w-full h-screen p-10 flex justify-center items-center">
      <Box className="text-center">
        <img src={imgurl} alt="Empty Cart" className="w-56 mx-auto" />
        <Typography variant="h6" className="mt-6 text-gray-800">
          You don't have any orders!
        </Typography>
        <Button variant="contained" onClick={() => navigate('/home')} className="mt-5" sx={{
          backgroundColor: "#3498DB",
          "&:hover": { backgroundColor: "#2980B9" }
        }}>Continue Shopping</Button>

      </Box>
    </Box>
  }

  const getReturnStatus = (orderId) => {
    const returnRequest = returns.find((ret) => ret.orderId === orderId);
    return returnRequest ? returnRequest.status.toUpperCase() : null;
  }

  return (
    <div className='mt-20 mb-20'>
      <h2 className="mt-16 text-3xl font-bold text-center">My Orders</h2>
      {userOrders?.map((order) => {
        const returnStatus = getReturnStatus(order.id);
        const returnStatusLabel = getReturnStatusLabel(returnStatus);
        return (
          <div className="container mt-10 px-32">
            <div className="card border mb-3 cursor-pointer" key={order.id} onClick={() => navigate(`/${userId}/orders/${order.id}`)}>
              <div className="card-header d-flex justify-content-between">
                <span>Order Date: {formatDate(order.orderDate)}</span>
                <span>Order ID: #{order.id}</span>
                <span>Total Amount: ₹{order.totalAmount}</span>
              </div>

              {order.items.map((item, itemIndex) => (
                <div className="row p-3" key={itemIndex} style={{ alignItems: 'center' }}>
                  <div className="col-md-4">
                    <div className="desc">
                      <h6 className="mb-1">{item.productName}</h6>
                      <small className="text-muted">{item.productBrand}</small>
                    </div>
                  </div>
                  <div className='col-md-2 text-center'>
                    <label>Quantity: {item.quantity}</label>
                  </div>
                  <div className="col-md-2 text-center">
                    <label>₹{item.price}</label>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center">
                      <span
                        className="rounded-circle"
                        style={statusStyles[order.status]}
                      />
                      <span className="ms-2">{order.status}</span>
                      {returnStatusLabel && (
                        <>
                          <span
                            className="rounded-circle ms-3"
                            style={statusStyles.RETURNED}
                          />
                          <span className="ms-2">{returnStatusLabel}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UserOrder;