import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { register, login, profile} from "./controllers/auth.controller.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import path from "path";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('./uploads')); 

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Routes
app.post('/api/v1/register', register);
app.post('/api/v1/login', login);
app.get('/api/v1/profile', profile);
app.post('/api/v1/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});


app.post('/api/v1/post', upload.single('file'), (req, res) => {
  res.json({ files: req.file })
  
})

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed! ", err);
    process.exit(1);
  });












