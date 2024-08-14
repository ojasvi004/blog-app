import jwt from "jsonwebtoken";
import { Comment } from "../models/Comment.model.js";
import { Post } from "../models/Post.model.js";
import { User } from "../models/User.model.js";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";

dotenv.config();

export const createComment = asyncHandler(async (req, res) => {
  const { userId, postId, content, parent_comment } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ msg: "user not found" });
  }
  const newComment = await Comment.create({
    user: userId,
    post: postId,
    content,
    parent_comment: parent_comment || null,
  });

  res.status(201).json(newComment);
});

export const getComments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comments = await Comment.find({ post: id })
    .sort({ createdAt: -1 })
    .populate("user", "username");

  res.status(201).json(comments);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.query;
  if (!commentId) {
    return res.status(400).json({ msg: "comment id not found" });
  }

  const result = await Comment.findByIdAndDelete(commentId);
  if (!result) {
    return res.status(404).json({ msg: "comment not found" });
  }

  res.status(204).end();
});
