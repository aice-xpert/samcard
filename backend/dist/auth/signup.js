"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = __importDefault(require("../config/firebase"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const { name, email, password, company } = req.body;
        const missingFields = [];
        if (!name)
            missingFields.push("name");
        if (!email)
            missingFields.push("email");
        if (!password)
            missingFields.push("password");
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(", ")}`,
            });
        }
        const nameTrimmed = name.trim();
        const emailTrimmed = email.trim();
        const passwordTrimmed = password.trim();
        const companyTrimmed = company?.trim() || "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrimmed)) {
            return res.status(400).json({
                success: false,
                error: "Invalid email format",
            });
        }
        if (passwordTrimmed.length < 8) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 8 characters",
            });
        }
        const userRecord = await firebase_1.default.auth().createUser({
            email: emailTrimmed,
            password: passwordTrimmed,
            displayName: nameTrimmed,
        });
        if (companyTrimmed) {
            await firebase_1.default.auth().setCustomUserClaims(userRecord.uid, {
                company: companyTrimmed,
                role: "user",
            });
        }
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
            },
        });
    }
    catch (err) {
        console.error("Signup error:", err);
        if (err.code === "auth/email-already-exists") {
            return res.status(400).json({
                success: false,
                error: "Email already exists",
            });
        }
        if (err.code === "auth/invalid-email") {
            return res.status(400).json({
                success: false,
                error: "Invalid email format",
            });
        }
        if (err.code === "auth/weak-password") {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 8 characters and include a mix of uppercase, lowercase, numbers, and symbols",
            });
        }
        if (err.code === "auth/invalid-display-name") {
            return res.status(400).json({
                success: false,
                error: "Invalid name format",
            });
        }
        return res.status(500).json({
            success: false,
            error: err.message || "Internal server error",
        });
    }
});
exports.default = router;
//# sourceMappingURL=signup.js.map