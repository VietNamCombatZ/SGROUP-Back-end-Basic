const db = require("../database/connection");

const getAllUsers = async () => {
  // db.query("select * from users", (err, result) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log(result);
  // });
  try {
    const users = await db.query("SELECT * FROM users"); // !! nó chỉ select hàng đầu trong bảng , sửa lại
    return users[0];
  } catch (err) {
    throw err;
  }
};

const getUserById = async (ID) => {
  try {
    var [result] = await db
      .promise()
      .query("select * from users where id = ?", [ID], (err) => {
        if (err) {
          console.log(err);
        }
      });
    if (result.length > 0) {
      console.log(result);
      return true;
    } else {
      console.log("No matches ID");
      return false;
    }

  } catch (err) {
    console.log("Error while execute");
    return false;
  }
};

const createUser = async (newUser) => {
  db.query(
    "insert into users(username, email, password, fullName) values (?, ?, ?,?) ",
    [newUser.username, newUser.email, newUser.password, newUser.firstname],
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

const updateUser = async (id, user) => {
  try {
    if (!getUserById(id)) {
      console.log("No matches ID");
      return;
    }

    await conn
      .promise()
      .query(
        "Update users set username = ?, email = ?, password = ?, fullName = ? where id =  ?",
        [user.username, user.email, user.password, user.firstname, id]
      );
  } catch (err) {
    console.log("Error while execute");
  }
};

const deleteUser = async (id) => {
  
  try {
    if (!getUserById(id)) {
      console.log("No matches ID");
      return;
    }

    await conn.promise().query("delete from users where id = ?", [id]);
  } catch (err) {
    console.log("Error while execute");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
