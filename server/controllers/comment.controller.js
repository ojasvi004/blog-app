import { Comment } from "../models/Comment.model.js";
import { Post } from "../models/Post.model.js";
import { User } from "../models/User.model.js";
import express from "express";
const app = express();

export async function createComment(req, res) {
  const { userId, postId, content, parent_comment } = req.body;

  if (!userId || !postId || !content) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const newComment = await Comment.create({
      user: userId,
      post: postId,
      content,
      parent_comment: parent_comment || null,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ msg: "Error creating comment", error });
  }
}

export async function getComments(req, res) {
  const { id } = req.params;

  try {
    const comments = await Comment.find({ post: id })
      .sort({ createdAt: -1 })
      .populate("user", "username");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching comments", error });
  }
}
