const admin = require("firebase-admin");
const serviceAccount = require("./high-radius-401215-firebase-adminsdk-c4bv1-1ba4657cbc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://high-radius-401215.firebaseio.com",
});

const firestore = admin.firestore();

exports.handler = async (event) => {
  console.log("event", JSON.stringify(event));

  // Process each record in the event
  for (const record of event.Records) {
    console.log("Processing record", JSON.stringify(record));

    // Proceed only if the event is an INSERT or MODIFY event
    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      const newImage = record.dynamodb.NewImage;

      // Construct a new customer document object from the NewImage
      const customerDocument = DynamoDBStreamRecordToJSON(newImage);

      // Assuming email_id is the unique identifier for customers
      const customerId = customerDocument.email_id;

      // Log the extracted document
      console.log(
        `Updating Firestore document for customer ID: ${customerId}`,
        customerDocument
      );

      // Update Firestore in the customers collection
      try {
        await firestore
          .collection("customers")
          .doc(customerId)
          .set(customerDocument, { merge: true });
        console.log(
          `Firestore document for customer ID ${customerId} updated successfully.`
        );
      } catch (error) {
        console.error(
          `Error updating Firestore document for customer ID ${customerId}:`,
          error
        );
        throw error; // rethrow the error to mark the Lambda invocation as failed
      }
    }
  }
};

// Helper function to convert DynamoDB Stream record to JSON
function DynamoDBStreamRecordToJSON(record) {
  const json = {};
  for (const key in record) {
    const value = record[key];
    if ("S" in value) {
      json[key] = value.S;
    } else if ("N" in value) {
      json[key] = Number(value.N);
    } else if ("BOOL" in value) {
      json[key] = value.BOOL;
    } else if ("L" in value) {
      json[key] = value.L.map((item) => DynamoDBStreamRecordToJSON(item.M));
    } else if ("M" in value) {
      json[key] = DynamoDBStreamRecordToJSON(value.M);
    } else if ("NULL" in value) {
      json[key] = null;
    }
    // Add additional data types as needed (e.g., 'B' for Binary, 'SS' for String Set, etc.)
  }
  return json;
}
