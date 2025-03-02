

import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
// import UploadFilesService from "../../services/upload-file";
import { fetchUserById, updateUser } from "../../features/userReducer";

const Profile = () => {
  const { authData: currentUser } = useSelector((state) => state.auth);
  // const uploadFilesService = new UploadFilesService();
  const dispatch = useDispatch();
  const [profileImage, setprofileImage] = useState(null);
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    profileImg: "",
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
                  setprofileImage(imageUrl);
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
            console.log(formData);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId, dispatch]);


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(updateUser({ id: userId, userData: formData })).unwrap();
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };


  
  // if (!currentUser) {
  //   return <Navigate to="/login" />;
  // }

  return (

    <div>
      <div className="container mt-20">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            <div className="mt-3 text-center text-xl" >
              <strong>Update Profile</strong>
            </div>
            <div className="card-body">
              <form onSubmit={handleFormSubmit}>

                <div className="mb-4">
                  <Avatar src={profileImage} alt="Profile" className="circle-image" style={{ width: 85, height: 85, margin: "auto" }} />
                  {/* <IconButton onClick={handleEditIconClick} style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'transparent', color: 'white' }}>
                    <EditIcon />
                  </IconButton> */}
                </div>


                <div className="form-group mb-3">
                  <label>First Name:</label>
                  <input
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Last Name:</label>
                  <input
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Phone Number:</label>
                  <input
                    name="phoneNo"
                    className="form-control"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Email:</label>
                  <input name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>

                <div className="flex justify-end">

                <button
                    className="btn btn-danger btn m-1 p-1 h-50 text-white"

                    style={{ marginLeft: "10px" }}
                  >
                    <Link to="/user/shopping" className="text-white" >
                      Cancel
                    </Link>
                  </button>
                  <button
                    className="btn btn-success btn m-1 p-1 h-50"
                    type="submit"
                  >
                    Save
                  </button>
                  
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div >

  );
};

export default Profile;