import jwt from "jsonwebtoken";
import { Comment } from "../models/Comment.model.js";
import { Post } from "../models/Post.model.js";
import { User } from "../models/User.model.js";
import dotenv from "dotenv";
dotenv.config();

export async function createComment(req, res) {
  const { userId, postId, content, parent_comment } = req.body;
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ msg: "token not provided" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (error) => {
      if (error) {
        return res.status(401).json({ msg: "invalid token" });
      }
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
  } catch (error) {
    res.status(500).json({ msg: "error creating comment" });
  }
}

export async function getComments(req, res) {
  const { id } = req.params;
  try {
    const comments = await Comment.find({ post: id })
      .sort({ createdAt: -1 })
      .populate("user", "username");

    res.status(201).json(comments);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching comments", error });
  }
}

export async function deleteComment(req, res) {
  try {
    const { commentId } = req.query;
    if (!commentId) {
      return res.status(400).json({ msg: "comment id not found" });
    }

    const result = await Comment.findByIdAndDelete(commentId);
    if (!result) {
      return res.status(404).json({ msg: "comment not found" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ msg: error });
  }
}
