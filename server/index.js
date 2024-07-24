import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { User } from "./models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { register, login, profile } from "./controllers/auth.controller.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.post('/register', register);
app.post('/login', login);
app.get('/profile', profile)
app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok')
})

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed! ", err);
    process.exit(1);
  });
