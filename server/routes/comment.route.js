import { Router } from "express";
const router = Router();

import {
  createComment,
  getComments,
  deleteComment,
} from "../controllers/comment.controller.js";

router
  .route("/:id/comment")
  .get(getComments)
  .post(createComment)
  .delete(deleteComment);

export { router };
