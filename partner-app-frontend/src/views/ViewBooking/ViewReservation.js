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
  CheckCircleOutline,
  HighlightOff,
  Schedule,
} from "@mui/icons-material";
import "./ViewBooking.css";
import Footer from "../../common/Footer";
import { useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import { format } from "date-fns";
import axios from "axios";
const { DateTime } = require("luxon");

function ViewBooking() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const restaurantId = localStorage.getItem("restaurant_id");

  useEffect(() => {
    const fetchUserBookings = () => {
      try {
        axios
          .post(
            "https://9uig9dfx55.execute-api.us-east-1.amazonaws.com/prod/get-reservations",
            {
              restaurant_id: restaurantId,
            }
          )
          .then((response) => {
            response = JSON.parse(response.data.body);
            console.log("response", response);
            const res = filterUpcomingReservations(response.reservations);
            setBookings(res);
            console.log("res", res);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching reservations:", error);
            setLoading(false);
          });
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [restaurantId]);

  const isBookingExpired = (booking) => {
    const expirationTime = new Date(booking.booking_expiration_time).getTime();
    const currentTime = new Date().getTime();
    return currentTime > expirationTime;
  };

  function filterUpcomingReservations(reservations) {
    const now = DateTime.now().setZone("America/Halifax");
    const oneHourBefore = now.minus({ hours: 1 });
    console.log("here", reservations);
    return reservations.filter((reservation) => {
      const bookingExpirationTime = DateTime.fromISO(
        reservation.booking_expiration_time,
        { zone: "America/Halifax" }
      );
      console.log("reservation: ", reservation);
      console.log("bookingExpirationTime: ", bookingExpirationTime);
      console.log("oneHourBefore: ", oneHourBefore);
      return bookingExpirationTime >= oneHourBefore;
    });
  }

  const handleEditBooking = (reservationId) => {
    navigate(`/edit/${reservationId}`);
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

  const handleAcceptBooking = async (reservationId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/edit-reservation",
        {
          reservation_id: reservationId,
          status: "Y",
        }
      );

      if (response.status === 200) {
        const updatedBookings = bookings.map((booking) =>
          booking.reservation_id === reservationId
            ? { ...booking, status: "Y" }
            : booking
        );
        setBookings(updatedBookings);
        setLoading(false);
      } else {
        setLoading(false);
        console.error("Failed to accept the booking");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error accepting the booking:", error);
    }
  };

  const handleRejectBooking = async (reservationId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/edit-reservation",
        {
          reservation_id: reservationId,
          status: "N",
        }
      );

      if (response.status === 200) {
        const updatedBookings = bookings.map((booking) =>
          booking.reservation_id === reservationId
            ? { ...booking, status: "N" }
            : booking
        );
        setBookings(updatedBookings);
        setLoading(false);
      } else {
        setLoading(false);
        console.error("Failed to reject the booking");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error rejecting the booking:", error);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Container style={{ flex: 1 }}>
        <Box className="booking-details-container">
          <Typography variant="h4">Upcoming Bookings</Typography>
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
                            {booking.status === "P" ? (
                              <>
                                <Button
                                  onClick={() =>
                                    handleAcceptBooking(booking.reservation_id)
                                  }
                                  variant="outlined"
                                  color="primary"
                                  sx={{ flex: 1 }}
                                >
                                  Accept
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleRejectBooking(booking.reservation_id)
                                  }
                                  variant="outlined"
                                  color="secondary"
                                  sx={{ flex: 1 }}
                                >
                                  Reject
                                </Button>
                              </>
                            ) : null}
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
