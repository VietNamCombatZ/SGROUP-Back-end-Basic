const conn = require("./config/database");

// const getAllUsers = async () => {
//     const result =  await conn.query("SELECT * FROM users");
//     return result(10);
// }

var userInput = { userName: "acc1", pass: "pass1" };

const login = async (username, pass) => {
  const result = await conn.execute(
    `select userName, pass from users where
    userName = ${username} and pass = ${pass}`
  );
  if (result == []) {
    console.log("No matches user");
  } else {
    console.log(result);
    // return result;
  }
};
login(userInput.userName, userInput.pass);
