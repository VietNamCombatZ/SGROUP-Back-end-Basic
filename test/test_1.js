const conn = require("../buoi_9/bai_tap_buoi_9/database/connection.js");

async function Test (){
   try {
    var user = "user1";
    console.log('check'); 
    var result = await conn.query("select username from user_db where username = ?", [user]);
    console.log(result);
    console.log(result[0]);
   } catch (error) {
    console.log(err);
   }
}

Test();