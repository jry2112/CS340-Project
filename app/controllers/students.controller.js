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

    let address = [
        req.body.addressID,
        req.body.streetAddress,
        req.body.city,
        req.body.state,
        req.body.zip,
        req.body.country
    ];

    // Save Student in the database
    let sql = 'INSERT INTO Students (Student_ID, First_Name, Last_Name, Email, Phone, Address_ID) VALUES (?,?,?,?,?,?)';
    let lastStuIDsql = 'SELECT Student_ID FROM Students WHERE First_Name = ? AND Last_Name = ? AND Email = ? AND Phone = ? AND Address_ID = ?'
    let addressSql = 'INSERT INTO Addresses (Address_ID, Street, City, State, Zip, Country) VALUES (?,?,?,?,?,?)';
    let lastAddSql = 'SELECT Address_ID FROM Addresses WHERE Street = ? AND City = ? AND Zip = ? AND Country = ?'
    let stuAddressSql = 'UPDATE Students SET Address_ID = ? WHERE Students.Student_ID = ?';
    sql = mysql.format(sql, student);
    lastStuIDsql = mysql.format(lastStuIDsql, student.slice[1]);
    addressSql = mysql.format(addressSql, address);
    lastAddSql = mysql.format(lastAddSql, address)
    // Insert new Student
    db.pool.query(sql, (err, data) => {
        if (err) throw err;
        console.log(data);
        // Insert new Address
        db.pool.query(addressSql, (err, data) => {
            if (err) throw err;
            // Get new Address_ID
            db.pool.query(lastAddSql, (err, data) => {
                if (err) throw err;
                const adressID = data.Address_ID;
                // Get new Student
                db.pool.query(lastStuIDsql, (err, data) => {
                    if (err) throw err;
                    const stuID = data.Student_ID
                    // Update Student Address_ID
                    stuAddressSql = mysql.format(stuAddressSql, [addressID, stuID])
                    db.pool.query(stuAddressSql, (err, data) => {
                        if (err) throw err;
                    });
                });
            })  
        })

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
    let id = req.params.studentID;
    let sql = `SELECT * FROM Students LEFT JOIN Addresses ON Students.Address_ID = Addresses.Address_ID WHERE Student_ID = ?`;
    let coursesql = `SELECT Courses.Course_ID, Courses.Name, Courses.Instructor FROM Courses \
    JOIN CurEnrolls ON Courses.Course_ID = CurEnrolls.Course_ID\
    JOIN Students ON CurEnrolls.Student_ID = Students.Student_ID\
    WHERE Students.Student_ID = ?`;
    sql = mysql.format(sql, id);
    coursesql = mysql.format(coursesql, id);
    console.log(sql);
    console.log(coursesql);

    db.pool.query(sql, function (err, student){
        if (err) throw err;
        console.log(student);
        db.pool.query(coursesql, function(err, courses){
            if (err) throw err;
            //if Student and any Courses found
                console.log(courses); 
                const data = 
                res.render('student',{studentData: student, courseData: courses});
        });
    });
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