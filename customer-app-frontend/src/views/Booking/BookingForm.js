import React, { useState } from "react";
import { Button, TextField } from "@mui/material";

function BookingForm() {
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const startTime = "11:00:00";
  const endTime = "23:00:00";
  const timeSlots = [];

  // Generate time slots at one-hour intervals
  let currentTime = startTime;
  while (currentTime < endTime) {
    timeSlots.push(currentTime);
    const [hours, minutes, seconds] = currentTime.split(":").map(Number);
    currentTime = `${(hours + 1).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservationData = {
      name,
      partySize,
      reservationDate,
      reservationTime,
      specialRequests,
    };
    console.log(reservationData);
  };

  const divStyle = {
    margin: "20px", // Set your desired margin here
  };

  return (
    <div>
      <h2>Table Booking</h2>
      <form onSubmit={handleSubmit}>
        <div style={divStyle}>
          <TextField
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={divStyle}>
          <TextField
            type="number"
            label="Party Size"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
          />
        </div>
        <div style={divStyle}>
          <TextField
            type="date"
            label=""
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
          />
        </div>
        <div style={divStyle}>
          <TextField
            type="time"
            label=""
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
          />
        </div>
        <div style={divStyle}>
          <TextField
            label="Special Requests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>
        <div style={divStyle}>
          <h2>Choose a Time Slot</h2>
          <select>
            {timeSlots.map((timeSlot, index) => (
              <option key={index} value={timeSlot}>
                {timeSlot}
              </option>
            ))}
          </select>
        </div>
        <div style={divStyle}>
          <Button variant="contained" color="primary" type="submit">
            Book Table
          </Button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
