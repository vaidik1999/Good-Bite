const admin = require("firebase-admin");
const serviceAccount = require("./high-radius-401215-firebase-adminsdk-c4bv1-1ba4657cbc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://high-radius-401215.firebaseio.com",
});

const firestore = admin.firestore();

exports.handler = async (event) => {
  console.log(event);
  const requestBody = event;

  const {
    reservation_id,
    status,
    ...updatedData // Exclude reservation_id and status from updatedData
  } = requestBody;

  try {
    const updatedReservation = await updateAndSaveReservation(reservation_id, {
      ...updatedData,
      status: status || "P", // Use the provided status or default to "P"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Reservation updated successfully",
        updatedReservation,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

async function updateAndSaveReservation(reservationId, updatedData) {
  const reservationRef = firestore
    .collection("reservations")
    .doc(reservationId);

  try {
    const existingReservation = await reservationRef.get();

    if (!existingReservation.exists) {
      throw new Error("Reservation not found");
    }

    const reservationData = existingReservation.data() || {};

    // Update fields from updatedData
    for (const key in updatedData) {
      if (updatedData.hasOwnProperty(key)) {
        const updatedValue = updatedData[key];

        // Handle special case: remove menu items with quantity 0
        if (key === "menu_items" && Array.isArray(updatedValue)) {
          const updatedMenuItems = updatedValue.filter(
            (item) => item.quantity !== 0
          );
          reservationData[key] = updatedMenuItems;
        } else {
          reservationData[key] = updatedValue;
        }
      }
    }

    // Update the reservation in Firestore
    console.log("reservation_data", reservationData);
    await reservationRef.update(reservationData);

    return reservationData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update and save reservation: " + error.message);
  }
}
