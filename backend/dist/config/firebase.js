"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
let serviceAccount;
// Try to load from environment variable first (for production deployments like Render)
if (process.env.FIREBASE_CREDENTIALS) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    }
    catch (err) {
        console.error("Failed to parse FIREBASE_CREDENTIALS environment variable:", err);
        throw new Error("Invalid FIREBASE_CREDENTIALS JSON");
    }
}
else {
    // Fall back to local file (for local development)
    serviceAccount = require(path_1.default.join(__dirname, "../firebaseCred.json"));
}
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
exports.default = firebase_admin_1.default;
//# sourceMappingURL=firebase.js.map