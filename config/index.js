const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dapps6911',
    database: 'question-rest'
});

conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql connected ✿ ✿ ✿');
});


module.exports = conn
