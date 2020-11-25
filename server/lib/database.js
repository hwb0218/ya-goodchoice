const mysql = require('mysql');

const database = mysql.createConnection({
    host     : 'localhost',    // 호스트 주소
    user     : 'root',           // mysql user
    password : 'dz731106hjh!',       // mysql password
    database : 'yanolja'         // mysql 데이터베이스
});
database.connect();

module.exports = {
    database
};