import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { User } from "./models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); 

const secret = 'askdjhfkajhdfkaepworixcmvnlsdjfh'
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
    credentials: true, 
  })
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          { username, id: userDoc._id },
          secret,
          {}, 
          (error, token) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ msg: "Server error" });
            }
            res.cookie('token', token, { httpOnly: true }); 
            res.status(200).json({ msg: "Login successful" });
          }
        );
      } else {
        res.status(401).json({ msg: "Invalid password" });
      }
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
});

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
