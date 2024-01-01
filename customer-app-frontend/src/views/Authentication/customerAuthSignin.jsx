import React, { useState } from 'react';
import { auth } from '../../common/firebaseConfig';
import {signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

const SignInWithEmailForm = () => {
  let navigate = useNavigate();
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
         //check if the email exists in the db
         const userExists = await axios.post('https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/user-exists', {
              "email":email,
            });
        console.log(userExists);
        if(userExists.data==false)
        {
          alert("Error Singing in.\n Please make sure:\n1.You Sign Up before Signing in\n 2.You are using correct credentials.")
        }
        else{
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem("customer_id", email);
            console.log('User Signed in successfully:', user);
            navigate("/listrestaurants");
        } catch (error) {
            console.error('Error signing in:', error.message);
            alert('Error signing in. Please check your credentials and try again.');
        }
        }

     }catch(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing up:',errorCode, errorMessage);
        alert("Error signing in. Please make sure you are using the correct credentials.")
    }
    }};

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
      try{
        const provider = new GoogleAuthProvider();
        const result=await signInWithPopup(auth, provider);
        localStorage.setItem("customer_id", result.user.email);
        // User signed in with Google
        console.log('User signed in with Google',result.user);
        navigate("/listrestaurants");
    }
    catch (error) {
        // Handle sign-in with Google error
        console.error('Error signing in with Google:', error);
      }
  };
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center', minWidth: '300px' }}>
        <Typography variant="h5" gutterBottom>
          Customer Sign In
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
