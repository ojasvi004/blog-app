import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { User } from "../models/User.model.js";
import { Post } from "../models/Post.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export async function post(req, res) {
  try {
    const posts = await Post.find({})
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
}

export async function findPost(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ msg: "no author found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
}
export async function findAuthor(req, res) {
  try {
    const author = await User.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ msg: "no author found" });
    }
    res.status(200).json(author);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "server error" });
  }
}

export async function deletePost(req, res) {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ msg: "token not provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error) => {
      if (error) {
        return res.status(401).json({ msg: "invalid token" });
      }

      const post = await Post.findOneAndDelete({ _id: req.params.id });
      if (!post) {
        return res.status(404).json({ msg: "No post found" });
      }

      res.status(200).json({ msg: "deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export const createPost = async (req, res) => {
  try {
    let coverPath = null;
    if (req.file) {
      const { originalname, path: tempPath } = req.file;
      const ext = path.extname(originalname);
      coverPath = tempPath + ext;

      await fs.promises.rename(tempPath, coverPath);
    }

    const token = req.cookies.access_token;
    jwt.verify(token, process.env.JWT_SECRET, async (error, info) => {
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
        res.status(500).json({ msg: dbError });
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "file upload failed" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content } = req.body;

    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json({ message: "post not found" });
    }

    let newPath = null;
    if (req.file) {
      const { originalname, path: tempPath } = req.file;
      const ext = path.extname(originalname);
      newPath = tempPath + ext;

      await fs.promises.rename(tempPath, newPath);
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
    res.status(500).json({ message: "server error" });
  }
};
