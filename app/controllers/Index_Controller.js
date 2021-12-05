const mysql = require('mysql');
var connection = mysql.createConnection({multipleStatements: true});

// Connection Pool
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

exports.home = (req, res) => {
  res.render('index');
}
