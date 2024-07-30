import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { User } from "../models/User.model.js";
import { Post } from "../models/Post.model.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

const secret = "askdjhfkajhdfkaepworixcmvnlsdjfh";

export async function register(req, res) {
  const { username, password } = req.body;
  try {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({ msg: "Username already exists!" });
    }

    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: error.message });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (error, token) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ msg: "Server error" });
          }
          res.cookie("token", token, { httpOnly: true });
          res.status(200).json({ msg: "Login successful" });
        });
      } else {
        res.status(401).json({ msg: "Invalid password" });
      }
    } else {
      res.status(404).json({ msg: "User not found!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

export async function profile(req, res) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ msg: "Token not provided" });
  }

  jwt.verify(token, secret, (error, info) => {
    if (error) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    res.json(info);
  });
}

export async function post(req, res) {
  try {
    const posts = await Post.find({})
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
}

export async function logout(req, res) {
  const { token } = req.cookies;
  res.cookie("token", "").json("ok");
}

export async function findPost(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ msg: "no author found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
}

export async function findAuthor(req, res) {
  try {
    const author = await User.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ msg: "no author found" });
    }
    res.status(200).json(author);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "server error" });
  }
}
