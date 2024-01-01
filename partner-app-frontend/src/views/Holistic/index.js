import React, { useEffect, useState } from "react";
import axios from "axios";
import ReservationList from "./ReservationList";

function Holistic() {
  const [reservations, setReservations] = useState([]);
  const restaurantId = localStorage.getItem("restaurant_id");

  useEffect(() => {
    if (!restaurantId) {
      console.error("restaurant_id not found in localStorage");
      return;
    }

    axios
      .post(
        "https://9uig9dfx55.execute-api.us-east-1.amazonaws.com/prod/get-reservations",
        {
          restaurant_id: restaurantId,
        }
      )
      .then((response) => {
        response = JSON.parse(response.data.body);
        const res = response.reservations;
        setReservations(res);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
      });
  }, [restaurantId]);

  return (
    <div className="App">
      <ReservationList reservations={reservations} />
    </div>
  );
}

export default Holistic;
