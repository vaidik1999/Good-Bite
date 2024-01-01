import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import MenuItemCard from "./MenuItemCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormControlLabel, Checkbox } from "@mui/material";
import Loader from "../../common/Loader";
import Footer from "../../common/Footer";
import { useNavigate, useParams } from "react-router-dom";

function EditReservation() {
  const [menuItems, setMenuItems] = useState([]);
  const [fetchMenu, setFetchMenu] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [numGuests, setNumGuests] = useState("");
  const [special_requests, setSpecial_requests] = useState("");
  const [restaurant_id, setRestaurant_id] = useState("");
  const [date, setDate] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [tableNumbers, setTableNumbers] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotsData, setTimeSlotsData] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  let reservationData = {};
  const { reservationId } = useParams();

  // Function to fetch reservation data
  const fetchReservationData = useCallback(() => {
    setLoading(true); // Start loading

    axios
      .post(
        "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/get-single-reservation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId: reservationId,
          }),
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const res = JSON.parse(response.data.body);
          const reservationData = res.reservation;
          setNumGuests(reservationData.number_of_guests);
          setSpecial_requests(reservationData.special_requests);
          setDate(reservationData.reservation_date);
          setTableNumber(reservationData.table_number);
          setTimeSlot(reservationData.reservation_time);
          setRestaurant_id(reservationData.restaurant_id);
          setSelectedItems(reservationData.menu_items);

          const selectedItemsData = {};
          const itemQuantitiesData = {};
          if (
            Array.isArray(reservationData.menu_items) &&
            reservationData.menu_items.length > 0
          ) {
            for (const item of reservationData.menu_items) {
              selectedItemsData[item.item_id] = item;
              itemQuantitiesData[item.item_id] = item.quantity;
            }
          }

          setSelectedItems(selectedItemsData);
          setItemQuantities(itemQuantitiesData);

          const requestBody = {
            restaurant_id: reservationData.restaurant_id,
            booking_date: reservationData.reservation_date,
            opening_time: "07:00",
            closing_time: "18:00",
            no_of_tables: "10",
          };

          axios
            .post(
              "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/available-tables",
              requestBody,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((response) => {
              const data = JSON.parse(response.data.body);
              const tableDetails = data.availability;

              const currentBookingTable = reservationData.table_number;
              const currentBookingTimeSlot = reservationData.reservation_time;

              if (currentBookingTable && currentBookingTimeSlot) {
                if (tableDetails[currentBookingTable]) {
                  tableDetails[currentBookingTable].push(
                    currentBookingTimeSlot
                  );
                } else {
                  tableDetails[currentBookingTable] = [currentBookingTimeSlot];
                }

                tableDetails[currentBookingTable].sort();
              }

              const tableNumbersData = Object.keys(tableDetails);
              setTableNumbers(tableNumbersData);
              setTableNumber(reservationData.table_number);
              setTimeSlotsData(tableDetails);
              setTimeSlots(data.availability[reservationData.table_number]);
              setLoading(false); // Stop loading
            })
            .catch((error) => {
              console.error("Failed to fetch table details:", error);
              setLoading(false); // Stop loading on error
            });

          if (
            Array.isArray(reservationData.menu_items) &&
            reservationData.menu_items.length > 0
          ) {
            setFetchMenu(true);
            axios
              .post(
                "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/get-menu-items",
                {
                  restaurantId: reservationData.restaurant_id,
                }
              )
              .then((response) => {
                const data = JSON.parse(response.data.body);
                const quantities = {};
                const updatedMenuItems = data[0].items.map((item) => {
                  const quantity =
                    itemQuantities[item.item_id] || item.quantity;
                  quantities[item.item_id] = quantity;
                  return { ...item, quantity };
                });

                setMenuItems(updatedMenuItems);
                setItemQuantities(quantities);
              })
              .catch((error) => {
                console.error("Failed to fetch menu items:", error);
                setLoading(false); // Stop loading on error
              });
          } else {
            setMenuItems([]);
            setLoading(false); // Stop loading
          }
        }
      })
      .catch((error) => {
        console.error("Failed to fetch reservation details:", error);
        setLoading(false); // Stop loading on error
      });
  }, [reservationId]);

  useEffect(() => {
    fetchReservationData(); // Fetch reservation data on component mount
  }, [fetchReservationData]);

  const handleCheckboxChange = () => {
    setFetchMenu(!fetchMenu);
  };

  const handleTableNumberChange = (e) => {
    const selectedTable = e.target.value;
    setTableNumber(selectedTable);
    setTimeSlots(timeSlotsData[selectedTable]);
  };

  const handleItemSelect = (item) => {
    const itemId = item.item_id;
    const updatedItems = { ...selectedItems };

    if (itemQuantities[itemId] !== undefined) {
      updatedItems[itemId] = { ...item, quantity: itemQuantities[itemId] + 1 };
      setItemQuantities({
        ...itemQuantities,
        [itemId]: itemQuantities[itemId] + 1,
      });
    } else {
      updatedItems[itemId] = { ...item, quantity: 1 };
      setItemQuantities({ ...itemQuantities, [itemId]: 1 });
    }
    setSelectedItems(updatedItems);
  };

  const handleEditClick = () => {
    const customer_id = localStorage.getItem("customer_id");
    const restaurant_id = localStorage.getItem("restaurant_id");
    const requestBody = {
      customer_id,
      restaurant_id,
      reservation_id: reservationId,
      reservation_date: date,
      reservation_time: timeSlot,
      number_of_guests: numGuests,
      special_requests: special_requests,
      table_number: tableNumber,
      menu_items: Object.values(selectedItems),
    };

    axios
      .post(
        "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/edit-reservation",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Booking successful:", response.data);
        alert("Update Successful");
        navigate("/listrestaurants");
      })
      .catch((error) => {
        console.error("Booking error:", error);
        alert("Update Unsuccessful");
        navigate("/listrestaurants");
      });
  };

  return (
    <>
      <Typography variant="h4">Edit Reservation</Typography>
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
        {fetchMenu ? (
          loading ? (
            <Loader />
          ) : (
            <Grid container spacing={2}>
              {menuItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.item_id}>
                  <MenuItemCard
                    item={item}
                    onItemSelect={handleItemSelect}
                    quantity={itemQuantities[item.item_id] || 0}
                  />
                </Grid>
              ))}
            </Grid>
          )
        ) : null}
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleEditClick}>
            Update
          </Button>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default EditReservation;
