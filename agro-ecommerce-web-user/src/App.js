
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";



import "bootstrap/dist/css/bootstrap.min.css";
import UserLayout from "./UserLayout/UserLayout";
import UserOrder from "./UserLayout/components/Order/Order";
import Shopping from "./UserLayout/components/Shopping/Shopping";
import ShoppingCart from "./UserLayout/components/ShoppingCart/ShoppingCart";
import axios from "axios";
import ProductList from "./UserLayout/components/Shopping/ProductList";
import ProductDetails from "./UserLayout/components/Shopping/ProductDetails";
import Checkout from "./UserLayout/components/Checkout/Checkout";
import UserOrderDetails from "./UserLayout/components/Order/OrderDetails";
import Profile from "./UserLayout/Profile";
import ShippingPolicy from "./UserLayout/CustomerService/ShippingPolicy";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {

  axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      console.log("token is ", token)

      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      return config;
    },
    error => {
      Promise.reject(error)
    });

  

  return (

    <Routes>
      <Route path="*" element={<Navigate replace to="/home" />} />
      <Route path="/home" element={<UserLayout />} >
        <Route index element={<Shopping />} />
      </Route>

      <Route path="/" element={<UserLayout />}>
        <Route index element={<Shopping />} />
        <Route path={`orders`} element={<ProtectedRoute><UserOrder /></ProtectedRoute>} />
        <Route path={`:userId/orders/:orderId`} element={<ProtectedRoute><UserOrderDetails /></ProtectedRoute>} />
        {/* <Route path={`address`} element={<OrderAddress />} /> */}
        {/* <Route path={`home`} element={<Shopping />} /> */}
        <Route path={`shopping-bag`} element={<ProtectedRoute><ShoppingCart /></ProtectedRoute>} />
        <Route path={`checkout`} element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path={`products/:name`} element={<ProductList />} />
        <Route path={`product-details/:id`} element={<ProductDetails />} />
        <Route path={`account`} element={<ProtectedRoute><Profile /></ProtectedRoute>} />


        <Route path="shipping-policy" element={<ShippingPolicy/>}/>
      </Route>

    </Routes>

  );
};


export default App;
