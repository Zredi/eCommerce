import { useState } from 'react'
import axios from "axios";
import AdminLayout from './AdminLayout/AdminLayout1';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './AdminLayout/components/Login';

import Dashboard from './AdminLayout/components/dashboard/Dashboard';
import Order from './AdminLayout/components/order/Orders';
import Inventory from './AdminLayout/components/inventory/Inventory';
import OrderDetails from './AdminLayout/components/order/OrderDetails';
import Products from './AdminLayout/components/inventory/Products';
import AddProductForm from './AdminLayout/components/inventory/product/AddProductForm';
import ViewProduct from './AdminLayout/components/inventory/product/ViewProduct';
import Users from './AdminLayout/components/user/Users';
import UserDetails from './AdminLayout/components/user/UserDetails';
import CreateUser from './AdminLayout/components/user/CreateUser';
import Category from './AdminLayout/components/Category/Category';
import AddCategoryForm from './AdminLayout/components/Category/Create-Category';
import AddSubCategoryForm from './AdminLayout/components/Category/Create-SubCategory';
import Profile from './AdminLayout/components/Profile';
import Staffs from './AdminLayout/components/staff/Staffs';
import CreateStaff from './AdminLayout/components/staff/CreateStaff';
import Sales from './AdminLayout/components/sales/Sales';
import PurchaseForm from './AdminLayout/components/sales/PurchaseForm';
import SaleForm from './AdminLayout/components/sales/SaleForm';

function App() {

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
      <Route path="*" element={<Navigate replace to="/login" />} />
      <Route path='/' element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="order" element={<Order />} />
        <Route path="view-order" element={<OrderDetails />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="add-purchase" element={<PurchaseForm />} />
        <Route path="add-sale" element={<SaleForm />} />
        <Route path="products" element={<Products />} />
        <Route path="add-product" element={<AddProductForm />} />
        <Route path="view-product" element={<ViewProduct />} />
        <Route path="edit-product" element={<AddProductForm />} />
        <Route path="sales" element={<Sales />} />
        <Route path="staffs" element={<Staffs />} />
        <Route path="create-staff" element={<CreateStaff />} />
        <Route path="edit-staff" element={<CreateStaff />} />
        <Route path="customers" element={<Users />} />
        <Route path="view-user" element={<UserDetails />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="edit-user" element={<CreateUser />} />
        <Route path="category" element={<Category />} />
        <Route path="add-category" element={<AddCategoryForm />} />
        <Route path="add-subcategory" element={<AddSubCategoryForm />} />
        <Route path="edit-category/:id" element={<AddCategoryForm />} />
        <Route path="edit-subcategory/:id" element={<AddSubCategoryForm />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
