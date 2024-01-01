import React, { useState } from 'react';
import { auth } from '../../common/firebaseConfig';
import {signInWithEmailAndPassword} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

const SignInWithEmailForm = () => {
  let navigate = useNavigate();
  let user_role="";
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Performing input validation
    setErrors({
      ...errors,
      [name]: value.trim() === '' ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required.` : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Performing form validation
    const formErrors = {};
    for (const key in formData) {
      formErrors[key] = formData[key].trim() === '' ? `${key.charAt(0).toUpperCase() + key.slice(1)} is required.` : '';
    }

    setErrors(formErrors);

    if (Object.values(formErrors).every((error) => error === '')) {
     const { email,password} = formData;
     try{
        //get the role associated with the email id.
        const response = await axios.post('https://wzdh0w0265.execute-api.us-east-1.amazonaws.com/prod/get-user-role',
        {
            "email_id":email
        });
        console.log(response)
        user_role=response.data.role;
        console.log(user_role);
        if(user_role=="restaurant")
        {
          const userCredential = signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          localStorage.setItem("customer_id", email);
          console.log('User Signed in successfully:', user);
          localStorage.setItem("restaurant_id", email);
          navigate("/holistic");
        }
        else
        {
          alert("You are not a restaurant!. Please login as customer or register yourself as a restaurant.")
        }

     }catch(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing in:',errorCode, errorMessage);
        alert("There was an error signing in. Please try again.")
    }
    }};

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    navigate("/googleSignIn");
  };
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center', minWidth: '300px' }}>
        <Typography variant="h5" gutterBottom>
          Restaurant Sign In
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            required
            sx={{ width: '100%', marginBottom: '1rem' }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            required
            sx={{ width: '100%', marginBottom: '1rem' }}
          />
          <Button variant="contained" type="submit" fullWidth>
            Sign in with email
          </Button>
          <Button variant="contained" onClick={handleGoogleSignIn} sx={{ mt: 2, bgcolor: '#4285F4', color: '#fff',width:"100%" }}>
            Sign in with Google
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SignInWithEmailForm;
