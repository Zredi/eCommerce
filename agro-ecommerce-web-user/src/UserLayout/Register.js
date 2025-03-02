import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signUpApi } from "../features/authReducer";
import { Alert, AlertTitle } from "@mui/material";
import * as yup from 'yup';


const Register = ({ onLoginClick }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  // const { loading, error } = useSelector((state) => state.auth);
  const [loading, setloading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: ''
  });

  const schema = yup.object().shape({
    firstName: yup
      .string().required('First name is required').min(2, 'First name must be at least 2 characters'),
    lastName: yup
      .string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
    email: yup
      .string().email('Invalid email format').required('Email is required'),
    phoneNo: yup
      .string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
    password: yup
      .string().required('Password is required').min(6, 'Password must be at least 8 characters')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: yup
      .string().required('Please confirm your password').oneOf([yup.ref('password')], 'Passwords must match')
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setloading(true);
    try {
      await schema.validate(formData, { abortEarly: false });

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNo: formData.phoneNo,
        password: formData.password
      };

      dispatch(signUpApi({ user: userData }));
      setloading(false);
      alert('Registration successful!');
      onLoginClick(formData.email);

    } catch (error) {
      setloading(false);
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setApiError(error.message || 'Registration failed. Please try again.');
      }
    }
  };


  return (
    <div className="flex items-center justify-center">
      <div className="w-full sm:max-w-md px-8 py-6 bg-white rounded-xl shadow-lg">
        <form onSubmit={handleSubmit}>
          {(apiError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{apiError}</AlertTitle>
            </Alert>
          )}
          <div className="flex flex-col justify-center items-center h-full select-none">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
              <a href="https://amethgalarcio.web.app/" target="_blank">
                <img src="https://cdn.logo.com/hotlink-ok/logo-social.png" className="w-32" />
              </a>
              <p className="m-0 text-[16px] font-semibold">Create an Account</p>
            </div>

            <div className="flex gap-2 w-full">
              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-400 ">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`border ${errors.firstName ? 'border-red-500' : ''} rounded-lg px-3 py-2 mb-1 text-sm w-full outline-none`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-400 ">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`border ${errors.lastName ? 'border-red-500' : ''} rounded-lg px-3 py-2 mb-1 text-sm w-full outline-none`}
                  placeholder="Enter last name" />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-400 ">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`border ${errors.email ? 'border-red-500' : ''} rounded-lg px-3 py-2 mb-1 text-sm w-full outline-none`}
                placeholder="Enter email" />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-400 ">Phone</label>
              <input
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className={`border ${errors.phoneNo ? 'border-red-500' : ''} rounded-lg px-3 py-2 mb-1 text-sm w-full outline-none`}
                placeholder="Enter phone number" />
              {errors.phoneNo && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNo}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 w-full">
          <div className="w-full flex flex-col gap-2">
            <label className="font-semibold text-xs text-gray-400 ">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className={`border ${errors.password ? 'border-red-500' : ''} rounded-lg px-3 py-2 mb-1 text-sm w-full outline-none`}
              placeholder="••••••••" />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="font-semibold text-xs text-gray-400 ">Confirm Password</label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              className={`border ${errors.confirmPassword ? 'border-red-500' : ''} rounded-lg px-3 py-2 mb-1 text-sm w-full outline-none`}
              placeholder="••••••••" />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          </div>

          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={()=> onLoginClick(formData.email)}
                className="text-blue-500 hover:text-blue-700"
              >
                Login
              </button>
            </p>
          </div>

          <div className="mt-4">
            <button type="submit" disabled={loading} className="py-1 px-8 bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none">{loading ? 'Creating Account...' : 'Sign Up'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
