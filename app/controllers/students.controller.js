const db = require("../../database/dbcon1.js");
const mysql = require('mysql');

// Create and Save a new Student
exports.create = (req, res) => {
    // Validate request
    console.log(req.body)

    // Create a Student
    let student = [
        req.body.studentID,
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.phone,
        req.body.addressID];

    // Save Student in the database
    let sql = 'INSERT INTO Students (Student_ID, First_Name, Last_Name, Email, Phone, Address_ID) VALUES (?,?,?,?,?,?)';
    sql = mysql.format(sql, student);
    console.log(sql)
    db.pool.query(sql, (err, data, res) => {
        if (err) throw err;
    })
   this.findAll(req,res);
};

// Retrieve and return all Students from the database.
module.exports.findAll = (req, res) => {
    let sql = 'SELECT * FROM Students';  
    db.pool.query(sql, function(err, data, fields){
        if (err) throw err;
        res.render('students', {userData: data});
    })
};  

// Find a single Student with a StudentID
module.exports.findOne = (req, res) => {

};

// Update a note identified by the StudentId in the request
module.exports.update = (req, res) => {

};

// Delete a note with the specified StudentId in the request
module.exports.delete = (req, res) => {

};