var mysql = require('mysql');

var connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 100,
  debug: false
});

exports.model = connection;
