const admin = require("firebase-admin");
const serviceAccount = require("./high-radius-401215-firebase-adminsdk-c4bv1-1ba4657cbc.json");
const { DateTime } = require("luxon");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://high-radius-401215.firebaseio.com",
});

const firestore = admin.firestore();

exports.handler = async (event) => {
  try {
    const requestBody = event; // Assuming the user ID is in the request body
    const customer_id = requestBody.customer_id;

    const allReservations = await getAllReservations();
    const upcomingReservations = filterUpcomingReservations(
      allReservations,
      customer_id
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Upcoming reservations found",
        reservations: upcomingReservations,
      }),
    };
  } catch (error) {
    console.error("Error in Lambda handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to retrieve upcoming reservations",
      }),
    };
  }
};

// Function to get all reservations
async function getAllReservations() {
  try {
    const reservationsRef = firestore.collection("reservations");
    const querySnapshot = await reservationsRef.get();

    const reservations = [];

    querySnapshot.forEach((doc) => {
      const reservationData = doc.data();
      reservations.push({
        reservation_id: doc.id,
        ...reservationData,
      });
    });

    return reservations;
  } catch (error) {
    console.error("Error getting all reservations:", error);
    return [];
  }
}

// Function to filter upcoming reservations for a user
function filterUpcomingReservations(reservations, customer_id) {
  const now = DateTime.now().setZone("America/Halifax");
  const oneHourBefore = now.minus({ hours: 1 });

  return reservations.filter((reservation) => {
    const bookingExpirationTime = DateTime.fromISO(
      reservation.booking_expiration_time,
      { zone: "America/Halifax" }
    );
    console.log("reservation: ", reservation);
    console.log("bookingExpirationTime: ", bookingExpirationTime);
    console.log("oneHourBefore: ", oneHourBefore);
    return (
      reservation.customer_id === customer_id &&
      bookingExpirationTime >= oneHourBefore
    );
  });
}
