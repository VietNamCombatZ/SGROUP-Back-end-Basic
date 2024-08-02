const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'12341234',
    database: 'sgroup_buoi_7'
}).promise();

conn.connect((err)=>{
    if(err) {
        throw err;
    }
    console.log('Connected to SQL server');
})

conn.query('SELECT * FROM users', (err, result)=>{
    if(err) {
        throw err;
    }
    // console.log(result);
})


const newUser = { firstname: "Linh_Ng", username: "melicom1", password: "12345678" };
// conn.query(
//   `INSERT INTO users(firstName,userName,pass) VALUES("${newUser.name}","${newUser.username}","${newUser.password}")  `,
//   (err) => {
//     if (err) throw err;
//     console.log("Ok3 !");
//   }
// );

// conn.query("SELECT * FROM users", (err, result) => {
//   if (err) {
//     throw err;
//   }
//   console.log(result);
// });


// var userInput = { userName: "acc2", pass: "acc2" };

// const login = async () => {
//   const result = await conn.query(`select userName, pass from users where
// userName = "${userInput.userName}" and pass = "${userInput.pass}"`);
//   if ((result = [])) {
//     console.log("No matches user");
//   } else {
//     return result(10);
//   }
// };

// const execute = async ()=>{

// }
// execute();
module.exports = conn;