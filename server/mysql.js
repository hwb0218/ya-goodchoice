var mysql = require('mysql2');
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다.
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'dz731106hjh!',
    database : 'yanolja'
});

connection.connect();

connection.query('SELECT * FROM user', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});

connection.end();