import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import {
  Event,
  CalendarViewDay,
  CalendarViewWeek,
  CalendarViewMonth,
  NavigateNext,
  Today,
  NavigateBefore,
} from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import { format, startOfMonth } from "date-fns";
import Footer from "../../common/Footer";

const RestaurantCalendar = ({ reservations }) => {
  const [view, setView] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredReservations, setFilteredReservations] = useState([]);

  const handleViewChange = (event, newValue) => {
    setView(newValue);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleNextClick = () => {
    if (view === "day") {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);
      setSelectedDate(nextDate);
    } else if (view === "week") {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 7);
      setSelectedDate(nextDate);
    } else if (view === "month") {
      const nextDate = new Date(selectedDate);
      nextDate.setMonth(selectedDate.getMonth() + 1);
      setSelectedDate(nextDate);
    }
  };

  const handlePreviousClick = () => {
    if (view === "day") {
      const previousDate = new Date(selectedDate);
      previousDate.setDate(selectedDate.getDate() - 1);
      setSelectedDate(previousDate);
    } else if (view === "week") {
      const previousDate = new Date(selectedDate);
      previousDate.setDate(selectedDate.getDate() - 7);
      setSelectedDate(previousDate);
    } else if (view === "month") {
      const previousDate = new Date(selectedDate);
      previousDate.setMonth(selectedDate.getMonth() - 1);
      setSelectedDate(previousDate);
    }
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  useEffect(() => {
    if (view === "day") {
      const currentDate = selectedDate.toDateString();
      const filtered = reservations.filter((reservation) => {
        return (
          new Date(reservation.reservation_datetime).toDateString() ===
          currentDate
        );
      });
      setFilteredReservations(filtered);
    } else if (view === "week") {
      const currentWeekStart = new Date(selectedDate);
      currentWeekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
      const currentWeekEnd = new Date(selectedDate);
      currentWeekEnd.setDate(
        selectedDate.getDate() - selectedDate.getDay() + 6
      );

      const filtered = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.reservation_datetime);
        return (
          reservationDate >= currentWeekStart &&
          reservationDate <= currentWeekEnd
        );
      });
      setFilteredReservations(filtered);
    } else if (view === "month") {
      const currentMonth = selectedDate.getMonth();
      const currentYear = selectedDate.getFullYear();

      const filtered = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.reservation_datetime);
        return (
          reservationDate.getMonth() === currentMonth &&
          reservationDate.getFullYear() === currentYear
        );
      });
      setFilteredReservations(filtered);
    }
  }, [view, selectedDate, reservations]);

  let heading = "";
  if (view === "day") {
    heading = `Booking for ${format(selectedDate, "do MMMM yyyy")}`;
  } else if (view === "week") {
    const currentWeekStart = new Date(selectedDate);
    currentWeekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
    const currentWeekEnd = new Date(selectedDate);
    currentWeekEnd.setDate(selectedDate.getDate() - selectedDate.getDay() + 6);
    heading = `Booking for Week ${format(selectedDate, "w yyyy")} (${format(
      currentWeekStart,
      "do MMMM yyyy"
    )} - ${format(currentWeekEnd, "do MMMM yyyy")})`;
  } else if (view === "month") {
    const firstDateOfMonth = startOfMonth(selectedDate);
    heading = `Booking for ${format(selectedDate, "MMMM yyyy")} (${format(
      firstDateOfMonth,
      "do MMMM yyyy"
    )} - ${format(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0),
      "do MMMM yyyy"
    )})`;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Container style={{ flex: 1 }}>
        <AppBar position="static" style={{ marginTop: "20px" }}>
          <Toolbar>
            <Tabs
              value={view}
              onChange={handleViewChange}
              indicatorColor="primary"
              textColor="inherit"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Daily" value="day" icon={<CalendarViewDay />} />
              <Tab label="Weekly" value="week" icon={<CalendarViewWeek />} />
              <Tab label="Monthly" value="month" icon={<CalendarViewMonth />} />
            </Tabs>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconButton
                color="inherit"
                aria-label="previous-date"
                onClick={handlePreviousClick}
              >
                <NavigateBefore />
                <span>Previous</span>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="today-date"
                onClick={handleTodayClick}
              >
                <Today />
                <span>Current</span>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="next-date"
                onClick={handleNextClick}
              >
                <span>Next</span>
                <NavigateNext />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Paper elevation={3}>
          <DatePicker
            view={view}
            renderInput={(props) => <input {...props} />}
            value={selectedDate}
            onChange={handleDateChange}
            renderDay={(day, _value, DayProps) => {
              const dayString = day.toLocaleDateString();
              const hasReservation = filteredReservations.some(
                (reservation) => {
                  const reservationDate = new Date(
                    reservation.reservation_datetime
                  );
                  return dayString === reservationDate.toLocaleDateString();
                }
              );

              return (
                <div>
                  <span>{day.getDate()}</span>
                  {hasReservation && <Event fontSize="small" color="primary" />}
                </div>
              );
            }}
          />
        </Paper>
        <div>
          <Typography variant="h6" gutterBottom>
            {heading}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Table Number</TableCell>
                  <TableCell>Reservation Time</TableCell>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Number of Guests</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.reservation_id}>
                    <TableCell>{reservation.table_number}</TableCell>
                    <TableCell>{reservation.reservation_time}</TableCell>
                    <TableCell>{reservation.customer_id}</TableCell>
                    <TableCell>{reservation.number_of_guests}</TableCell>
                    <TableCell>
                      {format(
                        new Date(reservation.reservation_datetime),
                        "do MMMM yyyy"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default RestaurantCalendar;
