import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";
import { Post } from "../models/Post.model.js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { asyncHandler } from "../utils/asyncHandler.js";

export const post = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.status(200).json(posts);
});

export const findPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ msg: "no post found" });
  }
  res.status(200).json(post);
});

export const findAuthor = asyncHandler(async (req, res) => {
  const author = await User.findById(req.params.id);
  if (!author) {
    return res.status(404).json({ msg: "no author found" });
  }
  res.status(200).json(author);
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOneAndDelete({ _id: req.params.id });
  if (!post) {
    return res.status(404).json({ msg: "No post found" });
  }
  res.status(200).json({ msg: "deleted successfully" });
});

export const createPost = asyncHandler(async (req, res) => {
  let coverPath = null;
  if (req.file) {
    const { originalname, path: tempPath } = req.file;
    const ext = path.extname(originalname);
    coverPath = tempPath + ext;

    await fs.promises.rename(tempPath, coverPath);
  }
  const { title, summary, content } = req.body;
  const postDoc = await Post.create({
    title,
    summary,
    content,
    cover: coverPath,
    author: req.user.id,
  });
  res.status(201).json(postDoc);
});

export const updatePost = asyncHandler(async (req, res) => {
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
});
