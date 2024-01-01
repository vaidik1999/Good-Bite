import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import MenuItemCard from "./MenuItemCard";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Footer from "../../common/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";

function Booking() {
  const [menuItems, setMenuItems] = useState([]);
  const [fetchMenu, setFetchMenu] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [numGuests, setNumGuests] = useState();
  const [special_requests, setSpecial_requests] = useState();
  const [date, setDate] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [tableNumbers, setTableNumbers] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotsData, setTimeSlotsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant } = location.state || {};

  useEffect(() => {
    const fetchTableDetails = async () => {
      setLoading(true);

      try {
        const requestBody = {
          restaurant_id: restaurant.restaurant_id,
          booking_date: date,
          opening_time: restaurant.res_opening_time,
          closing_time: restaurant.res_closing_time,
          no_of_tables: restaurant.res_total_tables,
        };

        // Call the API to get table details
        const response = await axios.post(
          "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/available-tables",
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const data = JSON.parse(response.data.body);

          const tableNumbersData = Object.keys(data.availability);
          setTableNumbers(tableNumbersData);
          setTableNumber(tableNumbersData[0]);
          setTimeSlotsData(data.availability);
          setTimeSlots(data.availability[tableNumbersData[0]]);
        }
      } catch (error) {
        console.error("Failed to fetch table details:", error);
      }

      setLoading(false);
    };

    fetchTableDetails();
  }, [date, restaurant]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);

      try {
        const apiUrl =
          "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/get-menu-items";

        // Define the request data to be sent in the request body
        const requestData = {
          restaurantId: restaurant.restaurant_id, // Replace with the appropriate value
        };

        const response = await axios.post(apiUrl, requestData); // Use the post method and send the requestData in the request body
        const data = JSON.parse(response.data.body);
        setMenuItems(data[0].items);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }

      setLoading(false);
    };

    if (fetchMenu) {
      fetchMenuItems();
    } else {
      setMenuItems([]);
    }
  }, [fetchMenu, restaurant]);

  const handleCheckboxChange = () => {
    setFetchMenu(!fetchMenu);
  };

  const handleTableNumberChange = (e) => {
    const selectedTable = e.target.value;
    setTableNumber(selectedTable);
    setTimeSlots(timeSlotsData[selectedTable]);
  };

  const handleItemSelect = (item) => {
    const index = selectedItems.findIndex((i) => i.item_id === item.item_id);

    if (index !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[index].quantity = item.quantity;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleBookClick = () => {
    setLoading(true);
    const customer_id = localStorage.getItem("customer_id");
    const requestBody = {
      customer_id,
      restaurant_id: restaurant.restaurant_id,
      reservation_date: date,
      reservation_time: timeSlot,
      number_of_guests: numGuests,
      special_requests: special_requests,
      table_number: tableNumber,
      menu_items: selectedItems,
    };

    axios
      .post(
        "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/book-reservation",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Booking successful:", response.data);
        setLoading(false);
        alert("Booking Successful");
        navigate("/listrestaurants");
      })
      .catch((error) => {
        setLoading(false);
        console.error("Booking error:", error);
      });
  };

  return (
    <>
      <Typography variant="h4">Table Booking Page</Typography>
      <Box m={2} p={2} display="flex" flexDirection="column">
        <Box mb={2}>
          <TextField
            label="Number of Guests"
            type="number"
            value={numGuests}
            onChange={(e) => setNumGuests(e.target.value)}
            variant="outlined"
            style={{ width: "100%" }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            variant="outlined"
            style={{ width: "100%" }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Table Number"
            value={tableNumber}
            onChange={handleTableNumberChange}
            variant="outlined"
            style={{ width: "100%" }}
          >
            {tableNumbers.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Time Slot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            variant="outlined"
            style={{ width: "100%" }}
          >
            {timeSlots.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            label="Special Requests"
            type="text"
            value={special_requests}
            onChange={(e) => setSpecial_requests(e.target.value)}
            variant="outlined"
            style={{ width: "100%" }}
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={fetchMenu}
              onChange={handleCheckboxChange}
              color="primary"
            />
          }
          label="Add Items From Menu to this Order (Optional)"
        />
        {loading ? (
          <Loader />
        ) : (
          <Grid container spacing={2}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.item_id}>
                <MenuItemCard item={item} onItemSelect={handleItemSelect} />
              </Grid>
            ))}
          </Grid>
        )}
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleBookClick}>
            Book
          </Button>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default Booking;
