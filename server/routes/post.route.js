import { Router } from "express";
const router = Router();

import {
  post,
  findPost,
  findAuthor,
  deletePost,
} from "../controllers/post.controller.js";

router.route("/post").get(post);
router.route("/post/:id").get(findPost).delete(deletePost);
router.route("/author/:id").get(findAuthor);

export { router };