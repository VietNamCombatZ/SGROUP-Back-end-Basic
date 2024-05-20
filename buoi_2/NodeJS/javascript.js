// fetch("https://65f001c5ead08fa78a516efe.mockapi.io/api/v1/users");

// const getInfoBtn = document.getElementsByClassName(button);
var express = require("express");
var app = express();
var port = 3000;
app.get("/", function (req, res) {
  return res.send("Hello World");
});
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});


const getAllUsers = async () => {
  try {
    const res = await fetch(
      "https://localhost:3000/",
      { method: "GET" }
    );
    console.log(await res.json());
  } catch (err) {
    console.error(err);
  }
};

const getUserID = async () => {
  try {
    let userID = document.getElementById("ID").value;
    const res = await fetch(
      "https://localhost:3000/" + userID,
      { method: "GET" }
    );

    console.log(await res.json());
  } catch (err) {
    console.error(err);
  }
};

const deleteUserByID = async () => {
  try {
    let userID = document.getElementById("ID").value;
    const res = await fetch(
      "https://localhost:3000/" + userID,
      { method: "Delete" }
    );
  } catch (err) {
    console.error(err);
  }
};

async function createUserByID() {
  try {
    let userID = document.getElementById("ID").value;
    let userEmail = document.getElementById("email").value;
    let userPass = document.getElementById("pass").value;

    console.log({
      id: userID,
      email: userEmail,
      password: userPass,
    });

    const res = await fetch(
      "https://localhost:3000/" + userID,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userID,
          email: userEmail,
          password: userPass,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to create user");
    }
  } catch (err) {
    console.error(err);
  }
}

async function checkUserIDAvailability(userID) {
  try {
    const res = await fetch(
      "https://localhost:3000/" + userID
    );
    if (res.status === 200) {
      // User ID tồn tại
      return true;
    } else if (res.status === 404) {
      // User ID không tồn tại
      return false;
    } else {
      // Xử lý các error code khác nếu có
      throw new Error("Failed to check user ID availability");
    }
  } catch (err) {
    console.error(err);
    return false; // Return false nếu có lỗi
  }
}

// Usage example:
async function updateUserByID() {
  try {
    let userID = document.getElementById("ID").value;
    let userEmail = document.getElementById("email").value;
    let userPass = document.getElementById("pass").value;

    console.log({
      id: userID,
      email: userEmail,
      password: userPass,
    });

    // Kiểm tra ID có tồn tại hay không
    const isAvailable = await checkUserIDAvailability(userID);
    if (!isAvailable) {
      console.error("User ID not available");
      return; // Thoát hàm nếu ID không tồn tại
    }

    // Xử lý cập nhật thông tin ID
    const res = await fetch(
      "https://localhost:3000/" + userID,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userID,
          email: userEmail,
          password: userPass,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to update user");
    }
  } catch (err) {
    console.error(err);
  }
}

// async function updateUserByID() {
//   try {
//     let userID = document.getElementById("ID").value;
//     let userEmail = document.getElementById("email").value;
//     let userPass = document.getElementById("pass").value;

//     console.log({
//       id: userID,
//       email: userEmail,
//       password: userPass,
//     });

//       const res = await fetch(
//         "https://65f001c5ead08fa78a516efe.mockapi.io/api/v1/users/" + userID,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             id: userID,
//             email: userEmail,
//             password: userPass,
//           }),
//         }
//       );
//       if (!res.ok) {
//         throw new Error("Failed to update user");
//       }

//   } catch (err) {
//     Error(err);
//   }
// };
