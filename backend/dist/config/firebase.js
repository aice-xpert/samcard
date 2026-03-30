"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let serviceAccount;
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
// Try to load from environment variable first (for production deployments like Render)
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    }
    catch (err) {
        console.error("Failed to parse Firebase credentials from environment:", err);
        throw new Error("Invalid Firebase credentials JSON in environment variables");
    }
}
else {
    // Fall back to local file (for local development)
    const credentialPath = path_1.default.join(__dirname, "../firebaseCred.json");
    const credentialFile = fs_1.default.readFileSync(credentialPath, "utf8");
    serviceAccount = JSON.parse(credentialFile);
}
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
exports.default = firebase_admin_1.default;
//# sourceMappingURL=firebase.js.map