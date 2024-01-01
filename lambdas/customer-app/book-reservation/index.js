const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const serviceAccount = require("./high-radius-401215-firebase-adminsdk-c4bv1-1ba4657cbc.json");
const { DateTime } = require("luxon");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://high-radius-401215.firebaseio.com",
});

const firestore = admin.firestore();

exports.handler = async (event) => {
  console.log("event", event);
  const requestBody = event;

  const {
    customer_id,
    restaurant_id,
    reservation_date,
    reservation_time,
    table_number,
    number_of_guests,
    special_requests,
    menu_items,
  } = requestBody;

  const reservation_id = uuidv4();

  // Split the reservation_time to get start and end times
  const [startTime, endTime] = reservation_time.split(" - ");

  const reservation_datetime = DateTime.fromFormat(
    `${reservation_date} ${startTime}`,
    "yyyy-MM-dd HH:mm",
    { zone: "America/Halifax" }
  );

  const reservationDate = reservation_datetime.toJSDate();
  // const bookingExpirationTime = reservationDate.minus({ hours: 1 }).toISO();
  const bookingExpirationTime = reservation_datetime
    .minus({ hours: 1 })
    .toISO();
  const reservationsCollection = firestore.collection("reservations");
  const reservationData = {
    reservation_id,
    customer_id,
    restaurant_id,
    reservation_date,
    reservation_time,
    table_number,
    number_of_guests,
    special_requests,
    menu_items,
    reservation_datetime: reservation_datetime.toISO(),
    booking_time: DateTime.now({ zone: "America/Halifax" }).toISO(),
    booking_expiration_time: bookingExpirationTime,
    status: "P",
  };

  try {
    await reservationsCollection.doc(reservation_id).set(reservationData);
    const createdReservation = reservationData;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Reservation created successfully",
        reservation: createdReservation,
      }),
    };
  } catch (error) {
    console.error("Failed to create reservation:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create reservation" }),
    };
  }
};
