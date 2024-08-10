import { Router } from "express";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });
import {
  post,
  findPost,
  findAuthor,
  deletePost,
  createPost,
  updatePost,
} from "../controllers/post.controller.js";

router.route("/post").get(post);
router.route("/post/:id").get(findPost).delete(deletePost);
router.route("/author/:id").get(findAuthor);
router.post("/post", upload.single("file"), createPost);
router.put("/api/v1/post/:id", upload.single("file"), updatePost);
export { router };
