import jwt from "jsonwebtoken";
import { Comment } from "../models/Comment.model.js";
import { Post } from "../models/Post.model.js";
import { User } from "../models/User.model.js";

const secret = "askdjhfkajhdfkaepworixcmvnlsdjfh";

export async function createComment(req, res) {
  const { userId, postId, content, parent_comment } = req.body;
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ msg: "token not provided" });
    }
    jwt.verify(token, secret, async (error) => {
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
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ msg: "token not provided" });
    }
    jwt.verify(token, secret, async (error) => {
      if (error) {
        return res.status(401).json({ msg: "invalid token" });
      }
      const { commentId } = req.query;
      if (!commentId) {
        return res.status(400).json({ msg: "comment id not found" });
      }
      await Comment.findOneAndDelete({ _id: commentId });
      res.status(201).json({ msg: "comment deleted successfully!!!" });
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
}
