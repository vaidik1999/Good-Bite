const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const AWS = require("aws-sdk");
const sqs = new AWS.SQS();
const sns = new AWS.SNS();
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

  const [startTime, endTime] = reservation_time.split(" - ");

  const reservation_datetime = DateTime.fromFormat(
    `${reservation_date} ${startTime}`,
    "yyyy-MM-dd HH:mm",
    { zone: "America/Halifax" }
  );

  const reservationDate = reservation_datetime.toJSDate();
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
  };

  try {
    await reservationsCollection.doc(reservation_id).set(reservationData);
    const createdReservation = reservationData;
    const notifyTime = reservation_datetime.minus({ minutes: 30 }).toISO();

    const sqsMessage = {
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/011445076892/TestQueue",
      MessageBody: JSON.stringify({
        customer_id,
        reservation_id,
        notifyTime,
      }),
      DelaySeconds: Math.max(
        0,
        (new Date(notifyTime).getTime() - Date.now()) / 1000
      ),
    };

    await sqs.sendMessage(sqsMessage).promise();

    // Sending immediate notification to the user via SNS
    const message = `Your table has been booked at the hotel ${restaurant_id} with table number ${table_number}.`;
    const snsParams = {
      Message: message,
      Subject: "Table Reservation Confirmation",
      TopicArn: "arn:aws:sns:us-east-1:011445076892:TestTopic",
    };

    await sns.publish(snsParams).promise();

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
