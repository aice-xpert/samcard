import admin from "firebase-admin";
import path from "path";

let serviceAccount: any;

// Try to load from environment variable first (for production deployments like Render)
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch (err) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY environment variable:", err);
    throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON");
  }
} else {
  // Fall back to local file (for local development)
  serviceAccount = require(path.join(__dirname, "./firebaseCred.json"));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;