import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {
  register,
  login,
  profile,
  post,
  logout,
} from "./controllers/auth.controller.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Post } from "./models/Post.model.js";
import jwt from "jsonwebtoken";
dotenv.config();
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("./uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const secret = "askdjhfkajhdfkaepworixcmvnlsdjfh";

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

app.post("/api/v1/register", register);
app.post("/api/v1/login", login);
app.get("/api/v1/profile", profile);
app.get("/api/v1/post", post);
app.post("/api/v1/logout", logout);

app.post("/api/v1/post", upload.single("file"), async (req, res) => {
  const { originalname, path: tempPath } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = tempPath + "." + ext;
  fs.renameSync(tempPath, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, async (error, info) => {
    if (error) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed! ", err);
    process.exit(1);
  });
