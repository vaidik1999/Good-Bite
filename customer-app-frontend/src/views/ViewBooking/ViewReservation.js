import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import {
  CheckCircleOutline, // Approved icon
  HighlightOff, // Rejected icon
  Schedule, // Pending icon
} from "@mui/icons-material";
import "./ViewBooking.css";
import Footer from "../../common/Footer";
import { useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import { format } from "date-fns";

function ViewBooking() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve the user ID from localStorage (you need to implement this)
    const customer_id = localStorage.getItem("customer_id");

    // Fetch the user's bookings from your API
    const fetchUserBookings = async (customer_id) => {
      try {
        const response = await fetch(
          "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/view-reservations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: customer_id,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.body) {
            const bodyData = JSON.parse(data.body);
            if (bodyData.reservations) {
              console.log("bookings", bodyData.reservations);
              setBookings(bodyData.reservations);
            } else {
              console.error("No reservations found in the response.");
            }
          } else {
            console.error("Invalid data format in API response.");
          }
          setLoading(false);
        } else {
          console.error("Failed to fetch user bookings");
        }
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    };

    if (customer_id) {
      setUser({ id: customer_id });
      fetchUserBookings(customer_id);
    }
  }, []);

  const isBookingExpired = (booking) => {
    const expirationTime = new Date(booking.booking_expiration_time).getTime();
    const currentTime = new Date().getTime();
    return currentTime > expirationTime;
  };

  const getStatusIconAndText = (status) => {
    let icon = null;
    let text = "";

    switch (status) {
      case "Y":
        icon = (
          <CheckCircleOutline
            fontSize="large"
            style={{ color: "green", position: "absolute", top: 10, right: 10 }}
          />
        );
        text = "Approved";
        break;
      case "N":
        icon = (
          <HighlightOff
            fontSize="large"
            style={{ color: "red", position: "absolute", top: 10, right: 10 }}
          />
        );
        text = "Rejected";
        break;
      case "P":
        icon = (
          <Schedule
            fontSize="large"
            style={{
              color: "darkorange",
              position: "absolute",
              top: 10,
              right: 10,
            }}
          />
        );
        text = "Pending";
        break;
      default:
        break;
    }

    return { icon, text };
  };

  const handleEditBooking = (reservationId) => {
    navigate(`/edit/${reservationId}`);
  };

  const handleDeleteBooking = async (reservationId) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/delete-reservation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservation_id: reservationId,
          }),
        }
      );

      if (response.ok) {
        // Handle successful deletion, e.g., remove the deleted booking from the state
        setLoading(false);
        const updatedBookings = bookings.filter(
          (booking) => booking.reservation_id !== reservationId
        );
        setBookings(updatedBookings);
      } else {
        setLoading(false);
        console.error("Failed to delete the booking");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting the booking:", error);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Container style={{ flex: 1 }}>
        <Box className="booking-details-container">
          <Typography variant="h4">User's Bookings</Typography>
          {loading ? (
            <Loader />
          ) : (
            <Box>
              {bookings.length === 0 ? (
                <Typography>No bookings found</Typography>
              ) : (
                <Box>
                  {bookings.map((booking, index) => (
                    <Card key={index} className="booking-details">
                      <CardContent style={{ position: "relative" }}>
                        <Typography variant="h6">
                          Reservation Date:{" "}
                          {format(
                            new Date(booking.reservation_date + "T00:00:00"),
                            "MMMM d, yyyy"
                          )}
                        </Typography>
                        <Typography variant="body1">
                          Booking Time: {booking.reservation_time}
                        </Typography>
                        <Typography variant="body1">
                          Number of Guests: {booking.number_of_guests}
                        </Typography>
                        <Typography variant="body1">
                          Special Requests: {booking.special_requests}
                        </Typography>
                        <Typography variant="h6">Menu Items</Typography>
                        <List>
                          {booking.menu_items ? (
                            booking.menu_items.map((menuItem, itemIndex) => (
                              <ListItem key={itemIndex}>
                                <ListItemText
                                  primary={`Item Name: ${menuItem.item_name}`}
                                  secondary={`Quantity: ${menuItem.quantity}`}
                                />
                              </ListItem>
                            ))
                          ) : (
                            <Typography>No menu items available</Typography>
                          )}
                        </List>
                        {isBookingExpired(booking) ? (
                          <Typography variant="body2" color="textSecondary">
                            Cannot Edit This Order
                          </Typography>
                        ) : (
                          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                            <Button
                              onClick={() =>
                                handleEditBooking(booking.reservation_id)
                              }
                              variant="outlined"
                              color="primary"
                              sx={{ flex: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() =>
                                handleDeleteBooking(booking.reservation_id)
                              }
                              variant="outlined"
                              color="secondary"
                              sx={{ flex: 1 }}
                            >
                              Delete
                            </Button>
                          </Box>
                        )}
                        {getStatusIconAndText(booking.status).icon}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ position: "absolute", top: 44, right: 10 }}
                        >
                          {getStatusIconAndText(booking.status).text}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
      <Footer />
    </div>
  );
}

export default ViewBooking;
