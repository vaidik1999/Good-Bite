import React, { useState } from 'react';
import {createUserWithEmailAndPassword } from "firebase/auth";
import axios from 'axios';
import { auth } from '../../common/firebaseConfig';
import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, Grid, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contact: ''
  });
  let navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Skip password validation for Gmail accounts
    if (name === 'password' && formData.email.trim().toLowerCase().includes('@gmail.com')) {
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
  
      // Validating the input fields
      setErrors({
        ...errors,
        [name]: value.trim() === '' ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required.` : ''
      });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validating form before submission
    const formErrors = {};
    for (const key in formData) {
      if (key === 'contact') {
        if (formData[key].trim().length !== 10) {
          formErrors[key] = 'Contact number must be 10 digits.';
        } else {
          formErrors[key] = '';
        }
      } else if (key === 'password') {
        // Check if the email contains '@gmail.com'
      const isGmailAccount = formData.email.trim().toLowerCase().includes('@gmail.com');
        if (!isGmailAccount && formData[key].trim().length < 8) {
          formErrors[key] = 'Password must be at least 8 characters long.';
        } else {
          formErrors[key] = '';
        }
      } else {
        formErrors[key] = formData[key].trim() === '' ? `${key.charAt(0).toUpperCase() + key.slice(1)} is required.` : '';
      }
    }
  

    setErrors(formErrors);

    // Checking if there are no errors before proceeding with signup logic
    if (Object.values(formErrors).every((error) => error === '')) {
      const { email,password,firstName,lastName,contact} = formData;
      let user=null;
      try {
         const isRestaurantRegistered= await axios.post("https://wzdh0w0265.execute-api.us-east-1.amazonaws.com/prod/is-restaurant-registered",
         {
          "email_id":email
        });
        console.log(isRestaurantRegistered)
        if(isRestaurantRegistered.data==true)
        {
          alert("You are already registered as a restaurant!");
        }

        else
        {
         // Check if the email contains '@gmail.com'
        const isGmailAccount = email.trim().toLowerCase().includes('@gmail.com');
         // If it's not a Gmail account, perform Firebase authentication sign-up
      if (!isGmailAccount) {
        // Creating user with email and password using Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // User created successfully
        user = userCredential.user;
        if(user)
        {
          console.log('Restaurant User created successfully in Firebase Authentication', user);
        }
        
      }
       //calling lambda to store the restaurant information
      try {
            const response = await axios.post('https://wzdh0w0265.execute-api.us-east-1.amazonaws.com/prod/restaurant-sign-up', {
              "email_id":email,
              "first_name":firstName,
              "last_name":lastName,
              "contact_number":contact,
            });
             console.log('API Response:', response.data);
          } catch (error) {
            console.error('Error calling API:', error);
          }
          console.log("Restuarant owner details stored sucessfully.")
          navigate("/addRestaurantDetails",{ state: { email } });
      }
     } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error doing registration:',errorCode, errorMessage);
        alert("Error doing registration. Please try again.")
      }
  
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} component={Box} p={3} mt={5}>
        <Typography variant="h5" component="div" mb={3}>
          Restaurant Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Email or Gmail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Password (non-gmail accounts only)"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Owner's First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Owner's Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Contact Number"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                error={!!errors.contact}
                helperText={errors.contact}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" fullWidth mt={2}>
            Sign Up
          </Button>
        </form>
        <Grid container justifyContent="center" mt={2}>
          <Grid item>
            <Link to="/signin">Already registered? Sign In</Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SignupForm;
