const admin = require("firebase-admin");
const AWS = require("aws-sdk");
const serviceAccount = require("./high-radius-401215-firebase-adminsdk-c4bv1-1ba4657cbc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://high-radius-401215.firebaseio.com",
});

const firestore = admin.firestore();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  console.log(event);
  const requestBody = event;

  const {
    reservation_id,
    updated_reservation_date,
    updated_reservation_time,
    updated_table_number,
    updated_number_of_guests,
    updated_special_requests,
    menu_items,
  } = requestBody;

  try {
    const updatedReservation = await updateAndSaveReservation(
      reservation_id,
      {
        reservation_date: updated_reservation_date,
        reservation_time: updated_reservation_time,
        table_number: updated_table_number,
        number_of_guests: updated_number_of_guests,
        special_requests: updated_special_requests,
      },
      menu_items
    );

    if (menu_items) {
      const message = `The menu items for your reservation (ID: ${reservation_id}) have been updated.`;
      const snsParams = {
        Message: message,
        Subject: "Menu Items Updated",
        TopicArn: "arn:aws:sns:us-east-1:011445076892:TestTopic", // modify this with your topic ARN
      };

      await sns.publish(snsParams).promise();
    }

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

async function updateAndSaveReservation(reservationId, updatedData, menuItems) {
  const reservationRef = firestore
    .collection("reservations")
    .doc(reservationId);

  try {
    const existingReservation = await reservationRef.get();

    if (!existingReservation.exists) {
      throw new Error("Reservation not found");
    }

    const reservationData = existingReservation.data() || {};

    if (updatedData.reservation_date !== undefined) {
      reservationData.reservation_date = updatedData.reservation_date;
    }
    if (updatedData.reservation_time !== undefined) {
      reservationData.reservation_time = updatedData.reservation_time;
    }
    if (updatedData.table_number !== undefined) {
      reservationData.table_number = updatedData.table_number;
    }
    if (updatedData.number_of_guests !== undefined) {
      reservationData.number_of_guests = updatedData.number_of_guests;
    }
    if (updatedData.special_requests !== undefined) {
      reservationData.special_requests = updatedData.special_requests;
    }

    if (menuItems !== undefined) {
      let existingMenuItems = reservationData.menu_items || [];

      for (const updatedMenuItem of menuItems) {
        const existingMenuItemIndex = existingMenuItems.findIndex(
          (item) => item.item_id === updatedMenuItem.item_id
        );

        if (existingMenuItemIndex === -1) {
          // If item_id not found, add a new item
          if (
            updatedMenuItem.item_id &&
            updatedMenuItem.item_name &&
            updatedMenuItem.quantity !== undefined
          ) {
            existingMenuItems.push(updatedMenuItem);
          } else {
            throw new Error("Invalid menu item data");
          }
        } else if (updatedMenuItem.quantity !== undefined) {
          // Update only the quantity or remove if it's 0
          if (updatedMenuItem.quantity === 0) {
            existingMenuItems.splice(existingMenuItemIndex, 1);
          } else {
            existingMenuItems[existingMenuItemIndex].quantity =
              updatedMenuItem.quantity;
          }
        }
      }

      // Update the menu_items in Firestore
      reservationData.menu_items = existingMenuItems;
    }

    await reservationRef.update({
      reservation_date: reservationData.reservation_date,
      reservation_time: reservationData.reservation_time,
      table_number: reservationData.table_number,
      number_of_guests: reservationData.number_of_guests,
      special_requests: reservationData.special_requests,
      menu_items: reservationData.menu_items,
    });

    return {
      ...reservationData,
      ...updatedData,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update and save reservation: " + error.message);
  }
}
