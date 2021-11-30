const express = require("express");
const ejs = require("ejs");
const app = express();

const path = require("path");
const port = process.env.PORT || 7473;

// Load DB connection settings from dotenv and connect
const dotenv = require("dotenv").config();
const host = process.env.MYSQL_HOST;
const database = process.env.MYSQL_DB;
let db = require("./database/dbcon1.js");

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
/*
// use res.render to load up an ejs view file
app.get('/', function(req, res)
    {
        // Define our queries
        query1 = 'DROP TABLE IF EXISTS diagnostic;';
        query2 = 'CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);';
        query3 = 'INSERT INTO diagnostic (text) VALUES ("MySQL is working!")';
        query4 = 'SELECT * FROM diagnostic;';

        // Execute every query in an asynchronous manner, we want each query to finish before the next one starts

        // DROP TABLE...
        db.pool.query(query1, function (err, results, fields){

            // CREATE TABLE...
            db.pool.query(query2, function(err, results, fields){

                // INSERT INTO...
                db.pool.query(query3, function(err, results, fields){

                    // SELECT *...
                    db.pool.query(query4, function(err, results, fields){

                        // Send the results to the browser
                        res.send(JSON.stringify(results));
                    });
                });
            });
        });
    });
*/
// index page

app.get("/", (req, res) => {
  res.render("index", {});
});


// courses page
app.get("/courses", (req, res) => {
  res.render("courses", {});
});

// individual course page
app.get("/courses/:id", (req, res) => {
  res.render("course", {});
});



// payments page
app.get("/payments", (req, res) => {
  res.render("payments", {});
});

// student accounts page
app.get("/accounts", (req, res) => {
  res.render("student-accounts", {});
});

app.listen(port, () => {
  require("./app/routes/students.routes.js")(app);
  require("./app/routes/enrollment.routes.js")(app);
  console.log(`Server started on port ${port}`);
  console.log(`Connecting to database ${database} on ${host}`);
});
