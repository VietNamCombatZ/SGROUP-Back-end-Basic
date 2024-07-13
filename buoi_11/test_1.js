const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/public/uploads")); //First need to create 2 folder: public/upload
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

//Postman: body -> form-data -> key: file (gõ thường toàn bộ)

// Single file
app.post("/upload/single", uploadStorage.single("file"), (req, res) => {
  console.log(req.file);
  return res.send("Single file");
});
//Multiple files
app.post("/upload/multiple", uploadStorage.array("file", 10), (req, res) => {
  console.log(req.files);
  return res.send("Multiple files");
});

app.listen(3000 || process.env.PORT, () => {
  console.log("Server on...");
});
