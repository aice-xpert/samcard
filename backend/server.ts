import express, { Request, Response } from 'express';
import cors from "cors";
import signupRoute from "./auth/signup";

const app = express();
const PORT: number | string = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running!');
});

app.use("/api/auth/signup", signupRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});