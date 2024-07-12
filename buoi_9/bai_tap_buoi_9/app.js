const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

const router = require("./routes/route_2.js");

app.use(bodyParser.json()); 

app.use("/", router);

app.listen(port, function (){
    console.log(`Server running on port ${port}`);
})