import { Router } from "express";
const router = Router();

import {
  register,
  login,
  profile,
  logout,
} from "../controllers/auth.controller.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get(profile);
router.route("/logout").post(logout);

export { router };