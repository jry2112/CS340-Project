<<<<<<< HEAD
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.MYSQL_HOST,
    user            : process.env.MYSQL_USER,
    password        : process.env.MYSQL_PASSWORD,
    database        : process.env.MYSQL_DB
});

=======
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.MYSQL_HOST,
    user            : process.env.MYSQL_USER,
    password        : process.env.MYSQL_PASSWORD,
    database        : process.env.MYSQL_DB
});

>>>>>>> defd63c27f1be144550dc541be08ea2993af589f
module.exports.pool = pool;