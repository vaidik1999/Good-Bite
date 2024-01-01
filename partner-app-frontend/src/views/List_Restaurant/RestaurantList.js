// RestaurantList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "@mui/material";
import Footer from "../../common/Footer";
import { useNavigate } from "react-router-dom";

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "400px",
  margin: "auto",
  padding: "20px",
  backgroundColor: "#f8f8f8",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const submitButtonStyle = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#4CAF50",
  color: "white",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const EditRestaurantForm = ({ restaurant, onSave }) => {
  const [name, setName] = useState(restaurant.name);
  const [closingTime, setClosingTime] = useState(restaurant.res_closing_time);
  const [openingTime, setOpeningTime] = useState(restaurant.res_opening_time);
  const [address, setAddress] = useState(restaurant.res_address);
  const [totalTables, setTotalTables] = useState(restaurant.res_total_tables);
  const [imageBase64, setImageBase64] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedData = {
        name,
        closing_time: closingTime,
        opening_time: openingTime,
        address,
        total_tables: totalTables,
        image_base64: imageBase64,
      };
      await axios.post(
        `https://3jrylw767ysukc5zqonluno4vi0xmrpq.lambda-url.us-east-1.on.aws/${restaurant.restaurant_id}`,
        updatedData
      );
      onSave();
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Container style={{ flex: 1 }}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Restaurant Name"
            style={inputStyle}
          />
          <input
            type="time"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            placeholder="Closing Time"
            style={inputStyle}
          />
          <input
            type="time"
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            placeholder="Opening Time"
            style={inputStyle}
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            style={inputStyle}
          />
          <input
            type="number"
            value={totalTables}
            onChange={(e) => setTotalTables(e.target.value)}
            placeholder="Total Tables"
            style={inputStyle}
          />
          <input type="file" onChange={handleImageChange} style={inputStyle} />
          <button type="submit" style={submitButtonStyle}>
            Update Restaurant
          </button>
        </form>
      </Container>
      <Footer />
    </div>
  );
};

const RestaurantList = () => {
  const navigate = useNavigate();
  const restaurantId = localStorage.getItem("restaurant_id");
  const [restaurant, setRestaurant] = useState(null);
  //const [restaurantId, setRestaurantId] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantById(restaurantId);
    }
  }, [restaurantId]);

  const fetchRestaurantById = async (id) => {
    try {
      const response = await axios.get(
        `https://kp63y524bjey432waococeq6w40wmjuf.lambda-url.us-east-1.on.aws/?id=${id}`
      );
      setRestaurant(response.data);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      setRestaurant(null);
    }
  };

  // const handleInputChange = (event) => {
  //   setRestaurantId(event.target.value);
  // };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleViewMenuClick = () => {
    //alert("View Menu clicked. Implement navigation here.");
    navigate("/menu");
  };

  const handleSave = () => {
    setEditMode(false);
    fetchRestaurantById(restaurantId);
  };

  if (editMode && restaurant) {
    return <EditRestaurantForm restaurant={restaurant} onSave={handleSave} />;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Container style={{ flex: 1 }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {restaurant && (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={restaurant.res_image_url}
                alt={restaurant.res_name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <div style={{ padding: "15px" }}>
                <h2 style={{ marginTop: "0", color: "#333" }}>
                  {restaurant.res_name}
                </h2>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  <strong>Opening Time:</strong> {restaurant.res_opening_time}
                </p>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  <strong>Closing Time:</strong> {restaurant.res_closing_time}
                </p>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  <strong>Address:</strong> {restaurant.res_address}
                </p>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  <strong>Total Tables:</strong> {restaurant.res_total_tables}
                </p>
                <button
                  style={{
                    padding: "10px 15px",
                    margin: "5px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#FFA07A",
                  }}
                  onClick={handleEditClick}
                >
                  Edit Information
                </button>
                <button
                  style={{
                    padding: "10px 15px",
                    margin: "5px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#90EE90",
                  }}
                  onClick={handleViewMenuClick}
                >
                  View Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default RestaurantList;
