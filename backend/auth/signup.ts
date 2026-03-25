import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, password, company } = req.body;

    const missingFields = [];

    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }

    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailTrimmed)) {
        return res.status(400).json({
            error: "Invalid email format",
        });
    }

    if (passwordTrimmed.length < 8) {
        return res.status(400).json({
            error: "Password must be at least 8 characters",
        });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: emailTrimmed,
            password: passwordTrimmed,
            options: {
                data: {
                    full_name: nameTrimmed,
                    company_name: company || "",
                },
            },
        });

        if (error) {
            return res.status(400).json({
                error: "Signup failed. Please try again.",
            });
        }

        return res
            .status(201)
            .json({
                user: data.user,
                message: "Check your email to confirm your account!",
            });
    } catch (err: any) {
        return res.status(400).json({ error: "Signup failed. Please try again." });
    }
});

export default router;
