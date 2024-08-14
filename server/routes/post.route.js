import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  post,
  findPost,
  findAuthor,
  deletePost,
  createPost,
  updatePost,
} from "../controllers/post.controller.js";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage });

router.route("/post").get(post);
router.route("/post/:id").get(findPost).delete(verifyToken, deletePost);
router.route("/author/:id").get(findAuthor);
router.post("/post", verifyToken, upload.single("file"), createPost);
router.put("/post/:id", verifyToken, upload.single("file"), updatePost);

export { router };
