import React, { useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import './OrderAddress.css';
import { useDispatch, useSelector } from "react-redux";
import { addressToSaveApi } from "../../../features/addressReducer";
import { userAddressToSaveApi } from "../../../features/userAddressReducer";
import { useNavigate } from "react-router-dom";
// import { Client } from 'whatsapp-web.js';
// import nodemailer from 'nodemailer';

// const client = new Client();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'bibhutisahani430@gmail.com',
//     pass: '',
//   },
// });

// authenticate client and connect to WhatsApp servers
// client.initialize();

function OrderAddress() {
  const initialState = () => {
    return {
      name: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      googleMapLink: "",
    };
  };
  const { autocomplete } = useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { message } = useSelector((state) => state.message);
  const { authData } = useSelector((state) => state.auth);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [landmark, setLandmark] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
// useEffect(() => {
//   first

//   return () => {
//     second
//   }
// }, [authData])

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event.target.firstName.value)
    const errors = {};
    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!address.trim()) {
      errors.address = "Address is required";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{9,12}$/.test(phone)) {
      errors.phone = "Invalid phone number";
    }
    if (!district.trim()) {
      errors.district = "District is required";
    }
    if (!state.trim()) {
      errors.state = "State is required";
    }
    if (!country.trim()) {
      errors.country = "Country is required";
    }
    if (!pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(pincode)) {
      errors.pincode = "Invalid pincode";
    }
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      // console.log("Form is valid. Submitting...");
      let addressToSave = {
        firstName: event.target.firstName.value,
        lastName: event.target.lastName.value,
        phone_no: event.target.phone.value,
        address: event.target.address.value,
        landmark: event.target.landmarks.value,
        district: event.target.district.value,
        state: event.target.state.value,
        country: event.target.country.value,
        pincode: event.target.pincode.value,
        phone: event.target.phone.value
      }
      // console.log(address)
      let message1 = {
        text: "Hiii",
        type: "MAIL",
        to: "bibhutisahani431@gmail.com",
        from: "bibhutisahani430@gmail.com"
      }
      let message2 = {
        text: "Bingo! There is an order from "+addressToSave.firstName+" "+addressToSave.lastName+","+ addressToSave.address+","+ addressToSave.landmark+","+addressToSave.district+","+addressToSave.state+","+addressToSave.country+","+ addressToSave.pincode+","+addressToSave.phone+". Please check the validity of the order and confirm in the admin login.",
        type: "MAIL",
        to: "bibhutisahani431@gmail.com",
        from: "bibhutisahani430@gmail.com"
      }
      console.log(addressToSave)
      dispatch(addressToSaveApi({address:addressToSave,token:authData?.token})).then(
        (data) => {
          console.log(authData)
          alert("Address saved successfully")
          let userAddress = {
            id:null,
            address: data.payload,
            profile: authData?.id
          }
          dispatch(userAddressToSaveApi({userAddress: userAddress, token: authData?.token})).then(
            (data) =>{
              if(data.payload?.id){
                navigate("/user")
              }
            }
          )
        }
      )
      // dispatch(sendMailMessage({ message: message1, token: authData?.token }))
      // dispatch(sendWpMessage({ message: message2, token: authData?.token }))
      // console.log(message);
    }



  };

  // const handleSendWhatsApp = () => {
  //   // code to send WhatsApp message using phone number and message state
  //   client.sendMessage(`${327762384}@c.us`, "No need to come");
  // };

  // const handleSendEmail = () => {
  //   // code to send email using email and message state
  //   console.log("email called")
  //   const mailOptions = {
  //     from: 'bibhutisahani430@gmail.com',
  //     to: 'bibhutisahani431@gmail.com',
  //     subject: 'New message from customer',
  //     text: "A new message from bibhutibhusana430",
  //   };
  //   transporter.sendMail(mailOptions);
  // };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const onFirstNameChange = (event) => {
    console.log(event.target.value)
    if (event.target.value.match(/[a-z]/)) {

      return false;
    }
    return true;
  }
  return (
    <div className="container">
      <div className="card">
        <div className="card-head border text-center">
          <h1>Add Order Address</h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row text-center">
              <div className="col-md-6">
                <TextField
                  label="Enter your First Name"
                  id="outlined-start-adornment"
                  name="firstName"

                  sx={{ m: 1, width: "25ch" }}
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  label="Enter your Last Name"
                  id="outlined-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  name="lastName"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </div>
            </div>
            <div className="row text-center">
              <div  className="col-md-1"></div>
              <div className="col-md-10 " style={{ paddingRight: '20px' }}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Address
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={
                      <InputAdornment position="start"></InputAdornment>
                    }
                    name="address"
                    label="Address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                </FormControl>
              </div>

            </div>
            <div className="row text-center">
              <div className="col-md-6">
                <TextField
                  label="Phone No."
                  id="outlined-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  name="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  label="Landmarks"
                  id="outlined-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  name="landmarks"
                  value={landmark}
                  onChange={(event) => setLandmark(event.target.value)}
                />
              </div>
            </div>
            <div className="row text-center">
              <div className="col-md-6">
                <TextField
                  label="District"
                  id="filled-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                  }}
                  name="district"
                  variant="filled"
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  error={!!errors.district}
                  helperText={errors.district}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  label="State"
                  id="filled-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                  }}
                  name="state"
                  variant="filled"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </div>
            </div>
            <div className="row text-center">
              <div className="col-md-6">
                <TextField
                  label="Country"
                  id="filled-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                  }}
                  name="country"
                  variant="filled"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  error={!!errors.country}
                  helperText={errors.country}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  label="Pincode"
                  id="filled-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                  }}
                  name="pincode"
                  variant="filled"
                  value={pincode}
                  onChange={(event) => setPincode(event.target.value)}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4"></div>
              <div className="col-md-5">
                <button className=" btn btn-primary mx-4" type="submit">
                  Submit
                </button>
              </div>

            </div>

          </form>
        </div>
      </div>

    </div>
  );
}
export default OrderAddress;
