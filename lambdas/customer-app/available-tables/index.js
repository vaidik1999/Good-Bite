const admin = require("firebase-admin");
const serviceAccount = require("./high-radius-401215-firebase-adminsdk-c4bv1-1ba4657cbc.json");
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://high-radius-401215.firebaseio.com",
});

const firestore = admin.firestore();

exports.handler = async (event) => {
  try {
    const { restaurant_id, booking_date } = event;

    if (!restaurant_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing restaurantId in query parameters",
        }),
      };
    }

    // Fetch restaurant details from the "table_reservation_app_restaurants" table
    const restaurantParams = {
      TableName: "table_reservation_app_restaurants",
      Key: {
        restaurant_id: restaurant_id,
      },
      ProjectionExpression:
        "res_opening_time, res_closing_time, res_total_tables",
    };

    const restaurantData = await dynamoDB.get(restaurantParams).promise();
    console.log("restaurantData:", restaurantData);

    if (!restaurantData.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Restaurant not found" }),
      };
    }
    const no_of_tables = restaurantData.Item.res_total_tables;
    const opening_time = restaurantData.Item.res_opening_time;
    const closing_time = restaurantData.Item.res_closing_time;
    console.log("no_of_tables", no_of_tables);
    console.log("opening_time", opening_time);
    console.log("closing_time", closing_time);

    // Fetch all reservations for the specified restaurant and date
    const reservations = await getReservations(restaurant_id, booking_date);
    console.log("reservations", reservations);

    // Calculate all possible time slots from opening_time to closing_time
    const allTimeSlots = generateTimeSlots(
      opening_time,
      closing_time,
      booking_date
    );
    console.log("allTimeSlots", allTimeSlots);

    // Create a map of table_numbers to available time slots
    const tableAvailabilityMap = groupTableAvailability(
      allTimeSlots,
      reservations,
      no_of_tables
    );
    console.log("tableAvailabilityMap", tableAvailabilityMap);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Available time slots",
        availability: tableAvailabilityMap,
      }),
    };
  } catch (error) {
    console.error("Error in Lambda handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to retrieve availability" }),
    };
  }
};

// Function to get reservations for a restaurant and date
async function getReservations(restaurant_id, booking_date) {
  const reservationsRef = firestore.collection("reservations");
  const querySnapshot = await reservationsRef
    .where("restaurant_id", "==", restaurant_id)
    .where("reservation_date", "==", booking_date)
    .get();

  const reservations = [];

  querySnapshot.forEach((doc) => {
    const reservationData = doc.data();
    reservations.push(reservationData);
  });

  return reservations;
}

// Function to generate all possible time slots
function generateTimeSlots(opening_time, closing_time, booking_date) {
  const timeSlots = [];
  const currentDate = new Date(booking_date);
  console.log("currentDate", currentDate);
  const startTime = parseTime(opening_time);
  console.log("startTime", startTime);
  const endTime = parseTime(closing_time);
  console.log("endTime", endTime);

  if (startTime && endTime) {
    let currentTime = new Date(currentDate);
    currentTime.setHours(startTime.hours, startTime.minutes, 0);
    console.log("currentTime", currentTime);

    while (
      currentTime <
      new Date(currentDate.setHours(endTime.hours, endTime.minutes, 0))
    ) {
      const formattedTime = formatTime(currentTime);
      timeSlots.push(formattedTime);
      currentTime.setHours(currentTime.getHours() + 1);
    }
  }

  return timeSlots;
}

function parseTime(timeString) {
  const parts = timeString.split(":");
  console.log("parts", parts);
  if (parts.length === 2) {
    const hours = parseInt(parts[0], 10);
    console.log("hours", hours);
    const minutes = parseInt(parts[1], 10);
    console.log("minutes", minutes);
    if (!isNaN(hours) && !isNaN(minutes)) {
      return { hours, minutes };
    }
  }
  return null;
}

function formatTime(date) {
  const startTime = new Date(date);
  const endTime = new Date(date);
  endTime.setHours(endTime.getHours() + 1);

  const startHours = startTime.getHours().toString().padStart(2, "0");
  const startMinutes = startTime.getMinutes().toString().padStart(2, "0");

  const endHours = endTime.getHours().toString().padStart(2, "0");
  const endMinutes = endTime.getMinutes().toString().padStart(2, "0");

  return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
}

// Function to group table availability
function groupTableAvailability(allTimeSlots, reservations, no_of_tables) {
  const tableAvailabilityMap = {};

  const tableNumbersData = Array.from(
    { length: no_of_tables },
    (_, i) => `Table ${i + 1}`
  );

  // Initialize the tableAvailabilityMap with dynamically generated table numbers
  tableNumbersData.forEach((tableNumber) => {
    tableAvailabilityMap[tableNumber] = [...allTimeSlots];
  });

  for (const reservation of reservations) {
    const tableNumber = reservation.table_number;

    if (tableAvailabilityMap[tableNumber]) {
      const bookedTimeSlot = reservation.reservation_time;
      const index = tableAvailabilityMap[tableNumber].indexOf(bookedTimeSlot);
      if (index !== -1) {
        tableAvailabilityMap[tableNumber].splice(index, 1);
      }
    }
  }

  return tableAvailabilityMap;
}
