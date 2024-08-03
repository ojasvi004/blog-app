import mongoose from "mongoose";
import { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parent_comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
})

export const Comment = mongoose.model("Comment", CommentSchema);
