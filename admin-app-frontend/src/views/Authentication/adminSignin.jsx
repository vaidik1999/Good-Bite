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
        if(user_role=="admin")
        {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User signed in successfully:', user);
            localStorage.setItem("admin_id", email);
            console.log('admin_id:', email);
            navigate('/top-restaurants');
          } catch (error) {
            console.error('Error signing in:', error.message);
            alert("There was an error signing in. Please use the correct credentials")
          }
        }
        else
        {
          alert("You are not an Admin. You can not sign into this page!")
        }

     }catch(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing in:',errorCode, errorMessage);
        alert("There was an error signing in. Please try again.")
    }
    }};
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center', minWidth: '300px' }}>
        <Typography variant="h5" gutterBottom>
          Admin Sign In
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
            Sign in
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SignInWithEmailForm;
