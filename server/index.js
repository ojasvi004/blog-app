import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {
  register,
  login,
  profile,
  logout,
} from "./controllers/auth.controller.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Post } from "./models/Post.model.js";
import jwt from "jsonwebtoken";
import {
  createComment,
  getComments,
  deleteComment,
} from "./controllers/comment.controller.js";
import { fileURLToPath } from "url";
import {
  post,
  findPost,
  findAuthor,
  deletePost,
} from "./controllers/post.controller.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());
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
app.get("/api/v1/post/:id", findPost);
app.delete("/api/v1/post/:id", deletePost);
app.get("/api/v1/author/:id", findAuthor);
app.post("/api/v1/post/:id/comment", createComment);
app.get("/api/v1/post/:id/comment", getComments);
app.delete("/api/v1/post/:id/comment", deleteComment);

app.post("/api/v1/post", upload.single("file"), async (req, res) => {
  try {
    let coverPath = null;

    if (req.file) {
      const { originalname, path: tempPath } = req.file;
      const ext = path.extname(originalname);
      coverPath = tempPath + ext;

      await fs.promises.rename(tempPath, coverPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, async (error, info) => {
      if (error) {
        return res.status(401).json({ msg: "Invalid token" });
      }

      const { title, summary, content } = req.body;
      try {
        const postDoc = await Post.create({
          title,
          summary,
          content,
          cover: coverPath,
          author: info.id,
        });
        res.status(201).json(postDoc);
      } catch (dbError) {
        res.status(500).json({ msg: "Database operation failed" });
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "File upload failed" });
  }
});

app.put("/api/v1/post/:id", upload.single("file"), async (req, res) => {
  try {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = `${path}.${ext}`;
      fs.renameSync(path, newPath);
    }

    const { id } = req.params;
    const { title, summary, content } = req.body;

    const postDoc = await Post.findByIdAndUpdate(id);
    if (!postDoc) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (String(postDoc.author) !== String(info.id)) {
      return res.status(403).json({ message: "You are not the author" });
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    if (newPath) {
      postDoc.cover = newPath;
    }
    await postDoc.save();
    res.json(postDoc);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
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
