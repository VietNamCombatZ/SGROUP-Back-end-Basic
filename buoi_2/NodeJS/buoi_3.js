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

function MaxId() {
  var IdCnt = 0;
  obj = readData();
  for (const item of obj) {
    if (parseInt(item.id) > IdCnt) {
      IdCnt = parseInt(item.id);
    }
  }
  return IdCnt;
}
MaxId();

app.post("/crud_json_objects", (req, res) => {
  let obj = readData();

  let newObj = req.body;
  newObj.id = (MaxId() + 1).toString();
  obj.push(newObj);
  writeData(obj);
  res.status(200).send(newObj); //neu trang thai tra ve la 200 (cho phep ) thi gui file len
});

// READ
app.get("/crud_json_objects", (req, res) => {
  let obj = readData();
  res.send(obj);
});

app.get("/crud_json_objects/:id", (req, res) => {
  let obj = readData();
  let objFind = obj.find((item) => item.id == parseInt(req.params.id));

  if (objFind) {
    res.send(objFind);
  } else {
    res.status(404).send("No object matches with the given id");
  }
});

// UPDATE

app.put("/crud_json_objects/:id", (req, res) => {
  let obj = readData();

  let updateData = req.body;
  let index = obj.findIndex((item) => item.id == parseInt(req.params.id));

  if (index == -1) {
    return res.status(400).send("No matches given ID");
  }
  // else {
  //   let tmp = obj[index].id;

  //   obj[index] = req.body;
  //   obj[index].id = tmp.toString();
  //   writeData(obj);
  //   res.status(201).send(obj[index]);
  // }
  updateData.id = obj[index].id.toString();
  obj[index] = updateData;
    res.status(200).send(obj[index]);
}
);
// DELETE
// Delete by ID
app.delete("/crud_json_objects/:id", (req, res) => {
  let obj = readData();
  let index = obj.find((item) => item.id == req.params.id);

  if (index == undefined) {
    res.status(404).send("No matches given ID");
    return;
  }

  let newObj = obj.filter((item) => {
    return item.id != req.params.id;
  });
  writeData(newObj);

  res.send("Item with matches ID deleted");
  MaxId();

  // if(index == undefined){
  //   res.status(404).send("ID invalid");
  // }else{
  //   var newObj = obj.filter((item) => item.id != index);
  //   writeData(newObj);
  //   res.send(newObj);
  // }
});

// Delete all
app.delete("/crud_json_objects/", (req, res) => {
  let obj = [];

  writeData(obj);

  res.send(obj);
  MaxId();
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
