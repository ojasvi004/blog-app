import { Router } from "express";
const router = Router();
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createComment,
  getComments,
  deleteComment,
} from "../controllers/comment.controller.js";

router
  .route("/:id/comment")
  .get(getComments)
  .post(verifyToken, createComment)
  .delete(verifyToken, deleteComment);

export { router };
