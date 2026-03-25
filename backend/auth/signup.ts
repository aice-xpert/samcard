import express from "express";

const router = express.Router()

router.post("/", async (req, res) => {
    // const { name, email, password, company} = req.body;

    // if(!email || !name || !password) {
    //     return res.status(400).json({ error : "Email or name or password not present" })
    // }

    // try{
    //     const { data, error } = await supabase.auth.signup({
    //         email, password, 
    //         options: {
    //             data: {
    //                 full_name: name,
    //                 company_name: company || "",
    //             }
    //         }
    //     });

    //     if(error) throw error;

    //     return res.status(200).json({ user: data.user, message: "Check your email to confirm your account!" });
    // } catch(err: any) {
    //     return res.status(400).json({ error: err.message });
    // }
})

export default router;