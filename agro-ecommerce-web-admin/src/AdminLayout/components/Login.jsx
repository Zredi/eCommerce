
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signinApi } from "../../features/authReducer";
import * as Yup from 'yup';


const Login = () => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({email:"",password:""});
  const [error, setError] = useState({});
  const [apiError, setApiError] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");
    try{
       await validationSchema.validate(formData,{abortEarly: false});
       dispatch(signinApi(formData))
      .then((data) => {
        
        if (data.payload === undefined) {
          setApiError("Invalid email or password!");
        } else {
            localStorage.setItem("isLoggedIn", true);
            navigate("/admin/dashboard");
        }
      })
      .catch(() => {
        setApiError("An error occurred while logging in.");
      });
    }catch(validationErr){
      const newErr={};
      if(validationErr.inner){
        validationErr.inner.forEach(err=>{
          newErr[err.path]=err.message;
        });
      }
      setError(newErr);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full sm:max-w-sm px-8 py-6 bg-gray-200 rounded-xl shadow-lg">
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


            <div className="w-full mt-4">
              <button 
                type="submit"
                className="py-2 px-8 bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] hover:from-[#2DD4BF] hover:to-[#5A9A7A] text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-lg cursor-pointer select-none"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
