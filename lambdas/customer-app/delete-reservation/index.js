const admin = require("firebase-admin");
const serviceAccount = require("./high-radius-401215-firebase-adminsdk-c4bv1-1ba4657cbc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://high-radius-401215.firebaseio.com",
});

const firestore = admin.firestore();

exports.handler = async (event) => {
  const requestBody = event;
  const { reservation_id } = requestBody;

  try {
    // Check if the reservation exists before deleting
    const existingReservation = await getReservationById(reservation_id);

    if (!existingReservation) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Reservation not found" }),
      };
    }

    // Delete the reservation
    await deleteReservation(reservation_id);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Reservation deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};

// Function to get a reservation by ID
async function getReservationById(reservationId) {
  try {
    const reservationRef = firestore
      .collection("reservations")
      .doc(reservationId);
    const existingReservation = await reservationRef.get();

    if (!existingReservation.exists) {
      return null; // Reservation not found
    }

    return {
      reservation_id: reservationId,
      ...existingReservation.data(),
    };
  } catch (error) {
    console.error("Error getting reservation by ID:", error);
    return null;
  }
}

// Function to delete a reservation
async function deleteReservation(reservationId) {
  try {
    const reservationRef = firestore
      .collection("reservations")
      .doc(reservationId);
    await reservationRef.delete();
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw new Error("Failed to delete reservation");
  }
}
