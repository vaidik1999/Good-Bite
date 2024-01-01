import React, { useState } from 'react';
import {createUserWithEmailAndPassword } from "firebase/auth";
import axios from 'axios';
import { auth } from '../../common/firebaseConfig';
import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, Grid, Box, Paper } from '@mui/material';
const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contact: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validating the input fields
    setErrors({
      ...errors,
      [name]: value.trim() === '' ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required.` : ''
    });
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
        if (formData[key].trim().length < 8) {
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
      try {
        // Creating user with email and password using Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // User created successfully
        const user = userCredential.user;
        //sending user data to the database after successful sign up with Firebase Authentiction
        if(user)
        {
          try {
            const response = await axios.post('https://brene180q1.execute-api.us-east-1.amazonaws.com/dev/customer-sign-up', {
              "email_id":email,
              "first_name":firstName,
              "last_name":lastName,
              "contact_number":contact,
            });
             console.log('API Response:', response.data);
          } catch (error) {
            console.error('Error calling API:', error);
          }
        }
        console.log('User created successfully:', user);
        console.log('User created successfully');
        alert("Registration Successful")
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing up:',errorCode, errorMessage);
        alert("Error signing up. Please make sure:\n 1. You are putting a valid email address.\n2. You have not already registered with the same email.")
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} component={Box} p={3} mt={5}>
        <Typography variant="h5" component="div" mb={3}>
          Customer Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
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
                label="Password"
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
                label="First Name"
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
                label="Last Name"
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
            <Link to="/signin">Already registered or have a Gmail? Sign In</Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SignupForm;
