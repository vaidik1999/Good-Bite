const admin = require("firebase-admin");
const serviceAccount = require("./high-radius-401215-firebase-adminsdk-c4bv1-1ba4657cbc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://high-radius-401215.firebaseio.com",
});

const firestore = admin.firestore();

exports.handler = async (event) => {
  try {
    console.log(event);
    const requestBody = JSON.parse(event.body);
    console.log("requestBody", requestBody);
    const reservationId = requestBody.reservationId;
    console.log("reservationId", reservationId);

    const reservation = await getReservationById(reservationId);

    if (!reservation) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Reservation not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Reservation found", reservation }),
    };
  } catch (error) {
    console.error("Error in Lambda handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to retrieve reservation" }),
    };
  }
};

// Function to get a reservation by ID
async function getReservationById(reservationId) {
  console.log("reservationId", reservationId);
  try {
    const reservationRef = firestore
      .collection("reservations")
      .doc(reservationId);
    const existingReservation = await reservationRef.get();

    if (!existingReservation.exists) {
      console.log("Reservation not found.");
      return null; // Reservation not found
    }

    return {
      reservationId: reservationId,
      ...existingReservation.data(),
    };
  } catch (error) {
    console.error("Error getting reservation by ID:", error);
    return null;
  }
}
