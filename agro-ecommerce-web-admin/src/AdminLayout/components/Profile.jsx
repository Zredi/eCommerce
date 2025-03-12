import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, IconButton, TextField, Button, Box, Typography, Card, CardContent } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { fetchUserById, updateUser } from "../../features/userReducer";
import styled from '@emotion/styled';

const StyledCard = styled(Card)`
  max-width: 600px;
  margin: 40px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

const AvatarContainer = styled(Box)`
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  border: 4px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EditButton = styled(IconButton)`
  position: absolute;
  bottom: 0;
  right: 40%;
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #1565c0;
  }
`;

const FormContainer = styled(Box)`
  padding: 0 24px 24px;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

const Profile = () => {
  const { authData: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
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
        if (userData.payload && !userData.payload.message) {
          const { firstName, lastName, phoneNo, email, profileImg } = userData.payload;
          
          if (profileImg) {
            // Image fetching logic remains the same
            setProfileImage(profileImg);
          }

          setFormData({
            firstName: firstName || '',
            lastName: lastName || '',
            phoneNo: phoneNo || '',
            email: email || '',
            profileImg: profileImg || '',
          });
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
      await dispatch(updateUser({ id: userId, userData: formData })).unwrap();
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditIconClick = () => {
    // Add image upload logic here
  };

  return (
    <StyledCard>
      <CardContent>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Admin Profile
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your profile details
          </Typography>
        </Box>

        {/* <AvatarContainer>
          <StyledAvatar src={profileImage} alt="Profile" />
          <EditButton onClick={handleEditIconClick}>
            <EditIcon />
          </EditButton>
        </AvatarContainer> */}

        <FormContainer component="form" onSubmit={handleFormSubmit}>
          <StyledTextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            variant="outlined"
          />
          <StyledTextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            variant="outlined"
          />
          <StyledTextField
            fullWidth
            label="Phone Number"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleInputChange}
            variant="outlined"
          />
          <StyledTextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            variant="outlined"
            InputProps={{ readOnly: true }}
            disabled
          />

          <ButtonContainer>
            <Button
              component={Link}
              to="/admin/dashboard"
              variant="outlined"
              color="error"
              size="large"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
            >
              Save Changes
            </Button>
          </ButtonContainer>
        </FormContainer>
      </CardContent>
    </StyledCard>
  );
};

export default Profile;