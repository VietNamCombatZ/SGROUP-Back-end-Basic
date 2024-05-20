const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const filePath = "./data.json";

app.use(bodyParser.json());

function readData() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// CREATE

app.post('/',(req, res) =>{
    var obj = readData();
    var newObj = req.body();
    obj.push(newObj);
    writeData(obj);
    res.status(201).send(newObj); //neu trang thai tra vee la 201 (cho phep ) thi gui file len 
})

// READ
app.get('/', (req, res) => {
    var obj = readData();
    res.send(obj);
})

// UPDATE

// app.put("/objects/:id", (req, res) => {
//   const objects = readData();
//   const index = objects.findIndex((obj) => obj.id === parseInt(req.params.id));
//   if (index !== -1) {
//     objects[index] = req.body;
//     writeData(objects);
//     res.send(objects[index]);
//   } else {
//     res.status(404).send({ message: "Object not found" });
//   }
// });

// DELETE

// app.delete
app.delete("/objects/:id", (req, res) => {
  const objects = readData();
  const newObjects = objects.filter(
    (obj) => obj.id !== parseInt(req.params.id)
  );
  writeData(newObjects);
  res.send({ message: "Object deleted" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
