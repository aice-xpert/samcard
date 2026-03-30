import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

let serviceAccount: admin.ServiceAccount;

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const firebaseCredsRaw =
  process.env.FIREBASE_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// Try to load from environment variable first (for production deployments like Render)
if (firebaseCredsRaw) {
  try {
    serviceAccount = JSON.parse(firebaseCredsRaw);
  } catch (err) {
    console.error("Failed to parse Firebase credentials from environment:", err);
    throw new Error("Invalid Firebase credentials JSON in environment variables");
  }
} else {
  // Fall back to local file (for local development)
  const credentialPath = path.join(__dirname, "../firebaseCred.json");
  const credentialFile = fs.readFileSync(credentialPath, "utf8");
  serviceAccount = JSON.parse(credentialFile) as admin.ServiceAccount;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;