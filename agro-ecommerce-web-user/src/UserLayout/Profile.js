


import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import UploadFilesService from "../services/upload-file";
import { fetchUserById, updateUser } from "../features/userReducer";
import { fetchUserOrders } from "../features/OrderReducer";
import { getUserReturns } from "../features/ReturnReducer";
import { fetchAddresses } from "../features/addressReducer";
import { addNewAddress, updateAddress } from "../features/addressReducer";
import { showErrorSnackbar, showSuccessSnackbar } from "../utils/snackbar";

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

const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');


const Profile = () => {
  const { authData: currentUser } = useSelector((state) => state.auth);
  const { userOrders, loading, error } = useSelector((state) => state.order);
  const { returns } = useSelector((state) => state.return);
  const { addresses } = useSelector((state) => state.address);
  const fileInputRef = useRef(null);
  const uploadFilesService = new UploadFilesService();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const userId = localStorage.getItem('userId');
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    profileImg: "",
  });

  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phoneNo: ""
  });

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editedAddress, setEditedAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phoneNo: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await dispatch(fetchUserById(userId));
        if (userData.payload) {
          if (userData.payload.message) {
            console.error("Error fetching user data:", userData.payload.message);
          } else {
            const { firstName, lastName, phoneNo, email, profileImg } = userData.payload;

            if (profileImg) {
              try {
                const response = await uploadFilesService.getFiles(profileImg, currentUser.token);
                if (response.ok) {
                  const arrayBuffer = await response.arrayBuffer();
                  const blob = new Blob([arrayBuffer]);
                  const imageUrl = URL.createObjectURL(blob);
                  setProfileImage(imageUrl);
                } else {
                  console.error("Error fetching image:", response.statusText);
                }
              } catch (error) {
                console.error("Error fetching image:", error.message);
              }
            }

            setFormData((prevFormData) => ({
              ...prevFormData,
              firstName: firstName || '',
              lastName: lastName || '',
              phoneNo: phoneNo || '',
              email: email || '',
              profileImg: profileImg || '',
            }));
          }
        }
        dispatch(fetchUserOrders(userId));
        dispatch(getUserReturns(userId));
        dispatch(fetchAddresses(userId));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId, dispatch, currentUser]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser({ id: userId, userData: formData })).unwrap();
      alert("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Optionally reset form data to original values if needed
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleNewAddressSubmit = (e) => {
    e.preventDefault();
    try {

      dispatch(addNewAddress({ userId, address: newAddress }));
      setShowNewAddressForm(false);
      setNewAddress({
        name: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        phoneNo: ""
      });
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };


  const handleAddressEditClick = (address) => {
    setEditingAddressId(address.id);
    setEditedAddress({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
      phoneNo: address.phoneNo
    });
  };

  const handleAddressEditChange = (e) => {
    const { name, value } = e.target;
    setEditedAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateAddress({
        addressId: editingAddressId,
        address: editedAddress
      }));
      setEditingAddressId(null);
      dispatch(fetchAddresses(userId));
      showSuccessSnackbar(dispatch,"Address updated successfully");
    } catch (error) {
      console.error('Failed to update address:', error);
      showErrorSnackbar(dispatch,'Failed to update address');
    }
  };

  const handleCancelAddressEdit = () => {
    setEditingAddressId(null);
  };

  const getReturnStatus = (orderId) => {
    const returnRequest = returns.find((ret) => ret.orderId === orderId);
    return returnRequest ? returnRequest.status.toUpperCase() : null;
  }
  // if (!currentUser) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <div className="container mx-auto mt-20 px-4 h-screen">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4 h-80 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-8">
            <Avatar
              src={profileImage}
              alt="Profile"
              style={{ width: 50, height: 50, marginRight: 12 }}
            />
            <div>
              <h3 className="font-semibold text-lg">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-gray-600 text-sm">{formData.email}</p>
            </div>
          </div>
          <nav className="space-y-3">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center px-4 py-2 text-gray-700 rounded-lg ${activeSection === 'profile' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profile
            </button>
            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full flex items-center px-4 py-2 text-gray-700 rounded-lg relative ${activeSection === 'orders' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18l-2 13H5L3 3zm4 16a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"></path>
              </svg>
              Orders
              <span className="absolute right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{userOrders.length >= 1 ? userOrders.length : ""}</span>
            </button>
            <button
              onClick={() => setActiveSection('addresses')}
              className={`w-full flex items-center px-4 py-2 text-gray-700 rounded-lg ${activeSection === 'addresses' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Addresses
            </button>
          </nav>
        </div>


        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6">

            {activeSection === 'profile' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Personal Information</h2>
                    <p className="text-gray-600 text-sm">Update your personal details</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={handleEditClick}
                      className="px-4 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-1">First name</label>
                        <input
                          name="firstName"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Last name</label>
                        <input
                          name="lastName"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                          name="email"
                          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                          value={formData.email}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Phone</label>
                        <input
                          name="phoneNo"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={formData.phoneNo}
                          onChange={handleInputChange}
                        />
                      </div>

                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={handleCancelClick}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex">
                      <p className="text-gray-600 w-1/5">First name:</p>
                      <p className="font-semibold">{formData.firstName}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-600 w-1/5">Last name:</p>
                      <p className="font-semibold">{formData.lastName}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-600 w-1/5">Email:</p>
                      <p className="font-semibold">{formData.email}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-600 w-1/5">Phone:</p>
                      <p className="font-semibold">{formData.phoneNo}</p>
                    </div>
                  </div>
                )}
              </>
            )}


            {activeSection === 'orders' && (

              // <>
              //   <h2 className="text-xl font-bold mb-4">My Orders</h2>
              //   {userOrders.length === 0 ? (
              //     <p className="text-gray-600">You don't have any orders yet.</p>
              //   ) : (
              //     <>
              //       {userOrders?.map((order) => {
              //         const returnStatus = getReturnStatus(order.id);
              //         const returnStatusLabel = getReturnStatusLabel(returnStatus);
              //         return (
              //           <div className="container mt-10">
              //             <div className="card border mb-3 cursor-pointer" key={order.id} onClick={() => navigate(`/${userId}/orders/${order.id}`)}>
              //               <div className="card-header d-flex justify-content-between">
              //                 <span>Order Date: {formatDate(order.orderDate)}</span>
              //                 <span>Order ID: #{order.id}</span>
              //                 <span>Total Amount: ₹{order.totalAmount}</span>
              //               </div>

              //               {order.items.map((item, itemIndex) => (
              //                 <div className="row p-3" key={itemIndex} style={{ alignItems: 'center' }}>
              //                   <div className="col-md-4">
              //                     <div className="desc">
              //                       <h6 className="mb-1">{item.productName}</h6>
              //                       <small className="text-muted">{item.productBrand}</small>
              //                     </div>
              //                   </div>
              //                   <div className='col-md-2 text-center'>
              //                     <label>Quantity: {item.quantity}</label>
              //                   </div>
              //                   <div className="col-md-2 text-center">
              //                     <label>₹{item.price}</label>
              //                   </div>
              //                   <div className="col-md-4">
              //                     <div className="d-flex align-items-center">
              //                       <span
              //                         className="rounded-circle"
              //                         style={statusStyles[order.status]}
              //                       />
              //                       <span className="ms-2">{order.status}</span>
              //                       {returnStatusLabel && (
              //                         <>
              //                           <span
              //                             className="rounded-circle ms-3"
              //                             style={statusStyles.RETURNED}
              //                           />
              //                           <span className="ms-2">{returnStatusLabel}</span>
              //                         </>
              //                       )}
              //                     </div>
              //                   </div>
              //                 </div>
              //               ))}
              //             </div>
              //           </div>
              //         );
              //       })}
              //     </>
              //   )}

              // </>

              <>
                <h2 className="text-xl font-bold mb-6">My Orders</h2>
                {userOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <p className="text-gray-600 text-lg">You haven't placed any orders yet</p>
                    <button
                      onClick={() => navigate('/home')}
                      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userOrders?.map((order) => {
                      console.log("order", order);

                      const returnStatus = getReturnStatus(order.id);
                      const returnStatusLabel = getReturnStatusLabel(returnStatus);

                      return (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">Order Date: {formatDate(order.orderDate)}</p>
                              <p className="text-sm font-medium text-gray-800">Order ID: #{order.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">₹{order.totalAmount.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="divide-y divide-gray-100">
                            {order.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                    <img
                                      src={`${BASE_URL}${item.productImageUrl}`}
                                      alt={item.productName}
                                      className="max-w-full max-h-full object-contain"
                                      onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                                    <p className="text-sm text-gray-600">{item.productBrand}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <p className="font-medium text-gray-800">₹{item.price.toFixed(2)}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className="rounded-full w-3 h-3"
                                      style={statusStyles[order.status]}
                                    />
                                    <span className="text-sm text-gray-700">{order.status}</span>

                                    {returnStatusLabel && (
                                      <>
                                        <span
                                          className="rounded-full w-3 h-3 ml-3"
                                          style={statusStyles.RETURNED}
                                        />
                                        <span className="text-sm text-gray-700">{returnStatusLabel}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button
                              onClick={() => navigate(`/${userId}/orders/${order.id}`)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center"
                            >
                              View Details

                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}


            {activeSection === 'addresses' && (
              <div>
                <h2 className="text-xl font-bold mb-4">My Addresses</h2>
                {addresses.length === 0 ? (
                  <p className="text-gray-600">You haven't added any addresses yet.</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border p-4 rounded-lg flex justify-between items-center">
                        {editingAddressId === address.id ? (
                          <form onSubmit={handleAddressEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                className="p-2 border rounded"
                                value={editedAddress.name}
                                onChange={handleAddressEditChange}
                                required
                              />
                              <input
                                type="text"
                                name="phoneNo"
                                placeholder="Phone Number"
                                className="p-2 border rounded"
                                value={editedAddress.phoneNo}
                                onChange={handleAddressEditChange}
                                required
                              />
                              <input
                                type="text"
                                name="street"
                                placeholder="Street Address"
                                className="p-2 border rounded col-span-2"
                                value={editedAddress.street}
                                onChange={handleAddressEditChange}
                                required
                              />
                              <input
                                type="text"
                                name="city"
                                placeholder="City"
                                className="p-2 border rounded"
                                value={editedAddress.city}
                                onChange={handleAddressEditChange}
                                required
                              />
                              <input
                                type="text"
                                name="state"
                                placeholder="State"
                                className="p-2 border rounded"
                                value={editedAddress.state}
                                onChange={handleAddressEditChange}
                                required
                              />
                              <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                className="p-2 border rounded"
                                value={editedAddress.country}
                                onChange={handleAddressEditChange}
                                required
                              />
                              <input
                                type="text"
                                name="zipCode"
                                placeholder="PIN Code"
                                className="p-2 border rounded"
                                value={editedAddress.zipCode}
                                onChange={handleAddressEditChange}
                                required
                              />
                            </div>
                            <div className="flex justify-between">
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelAddressEdit}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <p className="font-semibold">{address.name}</p>
                              <p className="text-gray-600">
                                {address.street}, {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-gray-600">Phone: {address.phoneNo}</p>
                            </div>

                            <div className="space-x-2">
                              <button
                                onClick={() => handleAddressEditClick(address)}
                                className="px-4 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {!showNewAddressForm ? (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-blue-500 mt-3 font-medium hover:text-blue-600"
                  >
                    + Add New Address
                  </button>
                ) : (
                  <form onSubmit={handleNewAddressSubmit} className="mt-3 space-y-4 border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="p-2 border rounded"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="p-2 border rounded"
                        value={newAddress.phoneNo}
                        onChange={(e) => setNewAddress({ ...newAddress, phoneNo: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Street Address"
                        className="p-2 border rounded col-span-2"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="City"
                        className="p-2 border rounded"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        className="p-2 border rounded"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        className="p-2 border rounded"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="PIN Code"
                        className="p-2 border rounded"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;