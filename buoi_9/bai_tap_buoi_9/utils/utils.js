const conn = require("../database/connection.js");

const isExistence = async (username) => {
  try {
    const [userList] = await conn.query(
      "SELECT username FROM user_db WHERE username = ?",
      [username]
    );
    console.log(userList);
    return userList.length > 0;
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    throw new Error("Database query failed");
  }
};

module.exports = {
  isExistence,
};



