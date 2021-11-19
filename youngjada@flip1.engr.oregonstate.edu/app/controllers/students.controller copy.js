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
    let sql = 'SELECT * FROM Students LEFT JOIN Addresses ON Students.Address_ID = Addresses.Address_ID ORDER BY Student_ID asc'; 

    db.pool.query(sql, function(err, data){
        if (err) throw err;
        res.render('students', {userData: data});
    })
};  

// Find a single Student with a StudentID
module.exports.findOne = (req, res) => {
    console.log(req.params);
    let id = req.params.studentID;
    let sql = 'SELECT * FROM Students LEFT JOIN Addresses ON Students.Address_ID = Addresses.Address_ID WHERE Student_ID = ? ';
    sql = mysql.format(sql, id);

    db.pool.query(sql, function (err, data){
        if (err) throw err;
        
        // if Student not found
        if(data.length <= 0){
            res.redirect('/students')
        }
        //if Student found
        else{
            res.render('student',{userData: data});
        }
    })


};

// Update a note identified by the StudentId in the request
module.exports.update = (req, res) => {

};

// Delete a note with the specified StudentId in the request
module.exports.delete = (req, res) => {
    console.log(req.params);
    let id = req.params.studentID;
    let sql = 'DELETE FROM Students WHERE Student_ID = ?';
    sql = mysql.format(sql, id);

    db.pool.query(sql, function (err, data){
        if (err) throw err;
        
        // if Student not found
        if(data.length <= 0){
            res.redirect('/students')
        }
        //if Student found
        else{
            this.findAll(req, res);
        }
    })
};