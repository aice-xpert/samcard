import dotenv from 'dotenv';
import path from 'path';
import express, { Request, Response } from 'express';
import cors from "cors";
import signupRoute from "./auth/signup";
import loginRoute from "./auth/login";

// Load environment variables from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT: number | string = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running!');
});

app.use("/api/auth/signup", signupRoute);


app.use("/api/auth/login", loginRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});