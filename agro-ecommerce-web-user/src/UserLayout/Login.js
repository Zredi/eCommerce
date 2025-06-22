import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signinApi } from "../features/authReducer";
import * as Yup from 'yup';
import { showErrorSnackbar, showSuccessSnackbar } from "../utils/snackbar";

const Login = ({ onRegisterClick, initialEmail="" }) => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({email:initialEmail,password:""});
  const [error, setError] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Please enter a valid email address"),
    password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
  });

  const validateField = async(name, value)=>{
    try{
      const fieldSchema = Yup.reach(validationSchema, name);
      await fieldSchema.validate(value);
      setError(prev=>({...prev, [name]: ""}));
    }catch(err){
      setError(prev=>({...prev, [name]: err.message}));
    }
    }

  const handleChange =(e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev,[name]: value}));
    validateField(name, value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(signinApi({ email: formData.email, password: formData.password }))
      .then((data) => {
        if (data.payload === undefined) {
          showErrorSnackbar(dispatch,"Invalid email or password!");
        } else {
          if (data.payload.role === "ROLE_USER") {
            localStorage.setItem("isLoggedIn", true);
            showSuccessSnackbar(dispatch, "Login successful!")
            navigate("/home");
          } else {
            showErrorSnackbar(dispatch,"Email password mismatch!");
          }
        }
      })
      .catch((e) => {
        showErrorSnackbar(dispatch,"Invalid email or password!");
        setLoading(false);
      });
  };

  // if (isLoggedIn) {
  //   return <Navigate to="/profile" />;
  // }

  return (
    <div className="w-[400px] px-8 py-6 bg-white rounded-xl shadow-lg">
      <form noValidate onSubmit={handleLogin}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col items-center justify-center gap-2 mb-8">
            <a href="https://amethgalarcio.web.app/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.logo.com/hotlink-ok/logo-social.png" className="w-32" alt="Logo" />
            </a>
            <p className="m-0 text-base font-semibold">Login to your Account</p>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="font-semibold text-xs text-gray-500">Email</label>
            <input 
              className={`border rounded-lg px-3 py-2 mb-2 text-sm w-full outline-none transition-colors duration-200 ${
                error.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {error.email && (
              <div className="text-red-500 text-sm">{error.email}</div>
            )}
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="font-semibold text-xs text-gray-500">Password</label>
            <input 
              type="password"
              name="password"
              className={`border rounded-lg px-3 py-2 text-sm w-full outline-none transition-colors duration-200 ${
                error.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {error.password && (
              <div className="text-red-500 text-sm">{error.password}</div>
            )}
          </div>

          {apiError && (
            <div className="text-red-500 text-sm mt-4 text-center">{apiError}</div>
          )}

          <div className="w-full text-center mt-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={onRegisterClick}
                className="text-blue-500 hover:text-blue-700"
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="w-full mt-4">
            <button 
              type="submit"
              className="py-2 px-8 bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
