import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Grid, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AddMenuItemForm = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    item_image_base64: null,
    itemPrice: ''
  });

  let locate=useLocation();
  let navigate = useNavigate();
  let email="";
  let res_name="";
  if (locate.state && locate.state.email && locate.state.res_name) 
  {
    email = locate.state.email;
    res_name=locate.state.res_name;
  }
  else{
    console.log("Email not found in location state.",email)
    console.log("Restaurant name not found in location state.",res_name)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      //Converting image to base64 string
      reader.readAsDataURL(file);
      //Extracting base64 string of the image
      reader.onloadend = () => {
        setFormData({ ...formData, item_image_base64: reader.result.split(',')[1] });
      };
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Validating category input to ensure it is comma-separated
    const categoryArray = formData.category.split(',').map((cat) => cat.trim());
    if (categoryArray.length > 1) {
      console.log('Valid categories:', categoryArray);
      const{itemName,itemPrice,description,category,item_image_base64}=formData;
      const response=await axios.post("https://wzdh0w0265.execute-api.us-east-1.amazonaws.com/prod/store-menu-item",{
        'email':email,
        'res_name': res_name,
        'item_name':itemName,
        'item_price':itemPrice,
        'description':description,
        'categories':category,
        'menu_image_base64':item_image_base64
      });
      if(response.data==true){
        console.log(response.data);
        alert("Item added successfully!");
      }
      else{
        console.log(response.data);
        alert("Item could not be added.Please check if the correct inputs were provided.");
      }
    }
    else {
      console.error('Invalid category input. Please provide comma-separated values.');
      alert("Invalid category input. Please provide comma-separated values.");
    }
  };

  const handleAddAnotherItem = () => {
    // Reset the form for another item
    setFormData({
      itemName: '',
      description: '',
      category: '',
      item_image_base64: null,
    });
  };

  const handleDone = () => {
    alert("Restaurant details submitted successfully!");
    navigate("/signin");
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Add Menu Items
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Item Name"
              name="itemName"
              fullWidth
              value={formData.itemName}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Item Price($CAD)"
              name="itemPrice"
              fullWidth
              type="number" 
              value={formData.itemPrice}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Categories (separate multiple values with comma like vegan, dairy-free etc.)"
              name="category"
              fullWidth
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="image-upload">Upload Item Image*</InputLabel>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="image-upload"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" onClick={handleFormSubmit}>
              Submit Item
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" onClick={handleAddAnotherItem}>
              Add Another Item
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleDone}>
              Done
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddMenuItemForm;
