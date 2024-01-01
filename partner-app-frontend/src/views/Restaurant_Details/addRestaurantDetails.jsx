import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Grid,InputLabel,Select,MenuItem } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//addig comment to trigger CI/CD pipelie.
const RestaurantDetailsForm = () => {
  let locate=useLocation();
  let navigate = useNavigate();
  let email="";
  if (locate.state && locate.state.email) 
  {
    email = locate.state.email;
  }
  else{
    console.log("Email not found in location state.",email)
  }
  const [formData, setFormData] = useState({
    res_name: '',
    res_closing_time: '',
    res_opening_time: '',
    res_address: '',
    res_total_tables: '',
    res_image_base64: '',
  });


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      //Converting image to base64 string
      reader.readAsDataURL(file);
      //Extracting base64 string of the image
      reader.onloadend = () => {
        setFormData({ ...formData, res_image_base64: reader.result.split(',')[1] });
      };
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'res_total_tables') {
      const intValue = parseInt(value, 10);
      if (intValue < 0) {
        alert("Number of tables cannot be a negative value.");
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!formData.res_image_base64) {
      alert("Please upload a restaurant image.");
      return;
    }
  const openingTime = parseInt(formData.res_opening_time.split(':')[0]);
  const closingTime = parseInt(formData.res_closing_time.split(':')[0]);

  if (openingTime >= closingTime) {
    alert("Opening time must be before closing time.");
    return;
  }
    try {
      const {res_name,res_closing_time, res_opening_time, res_address,res_total_tables,res_image_base64}=formData;
      const response = await axios.post('https://wzdh0w0265.execute-api.us-east-1.amazonaws.com/prod/storeRestaurantDetails',
      {
        "email":email,
        "name":res_name.toLowerCase(),
        "closing_time":res_closing_time,
        "opening_time":res_opening_time,
        "address":res_address.toLowerCase(),
        "total_tables": res_total_tables,
        "image_base64":res_image_base64
      });
      console.log(response.data);
      if(response.data==true){
        navigate("/addRestaurantMenu",{ state: { email,res_name } });
      }
      else{
        return false;
      }
    } catch (error) {
      alert("Error submitting restaurant details")
      console.error('Error submitting form:', error);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    let hour=0;
    for (let i = 0; i <=23; i++) {
      if(i<10)
      {
        hour=`0${i}:00`
      }
      hour = `${i}:00`;
      options.push(
        <MenuItem key={hour} value={hour}>
          {hour}
        </MenuItem>
      );
    }
    return options;
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Provide Restaurant Details
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Restaurant Name"
              name="res_name"
              fullWidth
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Restaurant Address"
              name="res_address"
              fullWidth
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Opening Time in 24 hour format*</InputLabel>
            <Select
              label="Opening Time"
              name="res_opening_time"
              fullWidth
              value={formData.res_opening_time}
              onChange={handleInputChange}
              required>
              {generateTimeOptions()}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Closing Time in 24 hour format*</InputLabel>
            <Select
              label="Closing Time"
              name="res_closing_time"
              fullWidth
              value={formData.res_closing_time}
              onChange={handleInputChange}
              required>
              {generateTimeOptions()}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Tables"
              name="res_total_tables"
              fullWidth
              type="number"
              onChange={handleInputChange}
              required
              inputProps={{ min: 0 }} 
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="image-upload">Upload Restaurant Image*</InputLabel>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="image-upload"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RestaurantDetailsForm;
