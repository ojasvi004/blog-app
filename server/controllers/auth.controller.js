import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import dotenv from "dotenv";
dotenv.config();
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const checkUsername = await User.findOne({ username });
  if (checkUsername) {
    return res.status(400).json({ msg: "Username already exists!" });
  }

  const userDoc = await User.create({
    username,
    password: hashedPassword,
  });
  res.json(userDoc);
});

export const profile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { username, id: userDoc._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) {
            return res.status(500).json({ msg: "Server error" });
          }
          res.cookie("access_token", token, { httpOnly: true, secure: true });
          res.status(200).json({ msg: "Login successful" });
        }
      );
    } else {
      res.status(401).json({ msg: "Invalid password" });
    }
  } else {
    res.status(404).json({ msg: "User not found!" });
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("access_token", "", { httpOnly: true, secure: true }).json("ok");
});
