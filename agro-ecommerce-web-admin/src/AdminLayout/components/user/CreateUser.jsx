import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Alert, AlertTitle } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { adminUpdateUser, createUser } from "../../../features/userReducer";

function CreateUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    role: "ROLE_USER",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        phoneNo: selectedUser.phoneNo,
        role: "ROLE_USER"
      })
    }
  }, [selectedUser])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        navigate('/admin/customers');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: yup
      .string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNo: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: selectedUser ? yup.string()
       : yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    console.log('form data', formData);
    console.log('selected user', selectedUser);
    

    try {
      await schema.validate(formData, { abortEarly: false }); 
      console.log('valid form data', formData);
           
      if(selectedUser){
        await dispatch(adminUpdateUser({id:selectedUser.id, userData:formData})).unwrap();
        setSuccessMessage("User updated successfully!");
      }else{
        await dispatch(createUser(formData)).unwrap();
        setSuccessMessage("User created successfully!");
      }
      
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        role: "ROLE_USER",
        password: "",
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setApiError(error.message || "Failed to process user.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mt-24 mb-20 mx-auto p-6 bg-white border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{selectedUser ? "Edit User": "Create New User"}</h2>

      {successMessage && (
        <Alert severity="success" className="mb-4">
          <AlertTitle>Success</AlertTitle>
          {successMessage}
        </Alert>
      )}

      {(apiError || error) && (
        <Alert severity="error" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          {apiError || error}
        </Alert>
      )}

      <div className="mb-4 flex gap-4">
        <div className="w-1/2">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            className={`shadow appearance-none border ${errors.firstName ? 'border-red-500' : ''
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs italic">{errors.firstName}</p>
          )}
        </div>

        <div className="w-1/2">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            className={`shadow appearance-none border ${errors.lastName ? 'border-red-500' : ''
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs italic">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className={`shadow appearance-none border ${errors.email ? 'border-red-500' : ''
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs italic">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="phoneNo">
          Phone Number
        </label>
        <input
          className={`shadow appearance-none border ${errors.phoneNo ? 'border-red-500' : ''
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="phoneNo"
          name="phoneNo"
          type="text"
          value={formData.phoneNo}
          onChange={handleChange}
          placeholder="Enter phone number"
        />
        {errors.phoneNo && (
          <p className="text-red-500 text-xs italic">{errors.phoneNo}</p>
        )}
      </div>

      { !selectedUser &&
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className={`shadow appearance-none border ${errors.password ? 'border-red-500' : ''
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">{errors.password}</p>
          )}
        </div>
      }

      <div className="flex justify-end gap-4">
        <Link
          to="/admin/customers"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </Link>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? 'saving...' : selectedUser ?'Update':'Create'}
        </button>
      </div>
    </form>
  );
}

export default CreateUser;