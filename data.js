const mysql = require('mysql');

const mydb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'liftlink'
});
mydb.connect();
  

module.exports = { mydb };