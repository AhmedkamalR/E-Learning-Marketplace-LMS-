import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
const multer = require("multer");
const morgan = require("morgan");
import csrf from "csurf";
import cookieParser from "cookie-parser";
require("dotenv").config();

const csrfProtection = csrf({ cookie: true });

// create express app
const app = express();

// db
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

// apply middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
//image variables
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      // console.log(path.join(__dirname, "images"));
      cb(null, path.join(__dirname, "images"))
  },
  filename: (req, file, cb) => {
      cb(null, new Date().toLocaleDateString().replace(/\//g, "-") + "-" + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png"
  )
      cb(null, true)
  else
      cb(null, false)

}
// port
const port = process.env.PORT_NUMBER || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));
