const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

const router = require("./routes/route.js");

app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, "/public")));

app.use("/", router);

app.listen(port, function (){
    console.log(`Server running on port ${port}`);
})