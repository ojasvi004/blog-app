import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { User } from "../models/User.model.js";
import { Post } from "../models/Post.model.js";
import multer from "multer";
const secret = "askdjhfkajhdfkaepworixcmvnlsdjfh";

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
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ msg: "token not provided" });
    }

    jwt.verify(token, secret, async (error) => {
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

