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
    const requestBody = event; // Assuming the restaurant ID is in the request body
    const restaurant_id = requestBody.restaurant_id; // Replace with the appropriate request property name

    const allReservations = await getAllReservations();
    const restaurantReservations = filterRestaurantReservations(
      allReservations,
      restaurant_id
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Reservations for the restaurant found",
        reservations: restaurantReservations,
      }),
    };
  } catch (error) {
    console.error("Error in Lambda handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to retrieve reservations for the restaurant",
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

// Function to filter reservations for a restaurant
function filterRestaurantReservations(reservations, restaurant_id) {
  const oneMonthAgo = DateTime.now().minus({ months: 1 });

  return reservations.filter((reservation) => {
    return (
      reservation.restaurant_id === restaurant_id &&
      DateTime.fromISO(reservation.reservation_datetime) >= oneMonthAgo
    );
  });
}
