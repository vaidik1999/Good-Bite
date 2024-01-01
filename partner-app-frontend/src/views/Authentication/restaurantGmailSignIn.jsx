import React, { useState } from 'react';
import { Button, Container, TextField, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { auth } from '../../common/firebaseConfig';
import {signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const GmailSignInForm = () => {
  let navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Input validation
    setErrors({
      ...errors,
      [name]: value.trim() === '' ? 'Gmail is required.' : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Additional validation for Gmail ID
    if (!formData.email.toLowerCase().includes('@gmail.com')) {
      setErrors({
        ...errors,
        email: 'Please enter a valid Gmail ID.',
      });
      return;
    }
    const {email}=formData;
    try{
        //checking if the gmail is registered as restautrant or not
        const isRestaurantRegistered= await axios.post("https://wzdh0w0265.execute-api.us-east-1.amazonaws.com/prod/is-restaurant-registered",
         {
          "email_id":email
        });
        console.log(isRestaurantRegistered)
        if(isRestaurantRegistered.data==false)
        {
          alert("You are not registered as a restaurant!. Please register first.");
        }
        else
        {
        const provider = new GoogleAuthProvider();
        const result=await signInWithPopup(auth, provider);
        if(result.user.email != email)
        {
          alert("Please login with the correct Gmail Id")
        }
        localStorage.setItem("customer_id", result.user.email);
        // User signed in with Google
        console.log('User signed in with Google',result.user);
        localStorage.setItem("restaurant_id", email);
        navigate("/holistic");
     }
    }
    catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error Singing in with Google',errorCode, errorMessage);
        alert("Error Singing with Google. Please try again.")
      }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center', marginTop: '5rem' }}>
        <Typography variant="h5" gutterBottom>
          Sign in using Gmail
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Gmail ID"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Sign in using Gmail
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default GmailSignInForm;
