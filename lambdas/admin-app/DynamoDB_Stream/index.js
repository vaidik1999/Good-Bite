const admin = require("firebase-admin");
const serviceAccount = require("./high-radius-401215-firebase-adminsdk-c4bv1-1ba4657cbc.json"); // replace with your actual file name

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

exports.handler = async (event) => {
  console.log("Processing DynamoDB event:", JSON.stringify(event, null, 2));

  // Process each record in the event
  for (const record of event.Records) {
    console.log("Processing record:", JSON.stringify(record, null, 2));

    // Proceed only if the event is an INSERT or MODIFY event
    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      const newImage = record.dynamodb.NewImage;

      // Construct a new document object from the NewImage
      const document = mapDynamoDBStreamRecordToDocument(newImage);

      // Extract the restaurant ID - assuming restaurant_id is the primary key
      const restaurantId = document.restaurant_id;

      // Log the extracted document
      console.log(
        `Updating Firestore document for restaurant ID: ${restaurantId}`,
        document
      );

      // Update Firestore
      try {
        await firestore
          .collection("restaurants")
          .doc(restaurantId)
          .set(document, { merge: true });
        console.log(
          `Firestore document for restaurant ID ${restaurantId} updated successfully.`
        );
      } catch (error) {
        console.error(
          `Error updating Firestore document for restaurant ID ${restaurantId}:`,
          error
        );
        throw error; // rethrow the error to mark the Lambda invocation as failed
      }
    }
  }
};

// Helper function to map DynamoDB stream record to Firestore document
function mapDynamoDBStreamRecordToDocument(newImage) {
  const document = {};
  for (const key in newImage) {
    const value = newImage[key];

    if ("S" in value) {
      document[key] = value.S;
    } else if ("N" in value) {
      document[key] = Number(value.N);
    } else if ("BOOL" in value) {
      document[key] = value.BOOL;
    } else if ("L" in value) {
      document[key] = value.L.map((item) =>
        mapDynamoDBStreamRecordToDocument(item.M)
      );
    } else if ("M" in value) {
      document[key] = mapDynamoDBStreamRecordToDocument(value.M);
    } else if ("NULL" in value) {
      document[key] = null;
    }
    // Add additional data types as needed (e.g., 'B' for Binary, 'SS' for String Set, etc.)
  }
  return document;
}
