const db = require("../../database/dbcon1.js");
const mysql = require('mysql');
// Create and Save a new Student
exports.create = (req, res) => {
    // Validate request

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
    let lastStuIDsql = 'SELECT Student_ID FROM Students WHERE First_Name = ? AND Last_Name = ? AND Email = ? AND Phone = ?'
    let addressSql = 'INSERT INTO Addresses (Address_ID, Street, City, State, Zip, Country) VALUES (?,?,?,?,?,?)';
    let lastAddSql = 'SELECT Address_ID FROM Addresses WHERE Street = ? AND City = ? AND State = ? AND Zip = ? AND Country = ?'
    let stuAddressSql = 'UPDATE Students SET Address_ID = ? WHERE Students.Student_ID = ?';
    sql = mysql.format(sql, student);
    lastStuIDsql = mysql.format(lastStuIDsql, student.slice(1));
    addressSql = mysql.format(addressSql, address);
    lastAddSql = mysql.format(lastAddSql, address.slice(1));
    // Insert new Student
    db.pool.query(sql, (err, data) => {
        if (err) throw err;
        // Insert new Address
        db.pool.query(addressSql, (err, data) => {
            if (err) throw err;
            // Get new Address_ID
            db.pool.query(lastAddSql, (err, data) => {
                if (err) throw err;
                data =  JSON.parse(JSON.stringify(data));
                console.log(data);
                let addressID = data[0].Address_ID;
                console.log(addressID)
                // Get new Student
                db.pool.query(lastStuIDsql, (err, data) => {
                    console.log(lastStuIDsql, " Getting Student:", data)
                    if (err) throw err;
                    data =  JSON.parse(JSON.stringify(data));
                    console.log(addressID)
                    let stuID = data[0].Student_ID
                    // Update Student Address_ID
                    stuAddressSql = mysql.format(stuAddressSql, [addressID, stuID])
                    db.pool.query(stuAddressSql, (err, data) => {
                        console.log(stuAddressSql, "Updating Student:", data)
                        if (err) throw err;
                    });
                });
            })  
        })

    })
    
   res.redirect('/students');
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
    // Query if filtering, params if Edit button
    let id = req.query.searchID || req.params.studentID;
    let sql = `SELECT * FROM Students LEFT JOIN Addresses ON Students.Address_ID = Addresses.Address_ID WHERE Student_ID = ?`;
    let coursesql = `SELECT Courses.Course_ID, Courses.Name, Courses.Instructor FROM Courses \
    JOIN CurEnrolls ON Courses.Course_ID = CurEnrolls.Course_ID\
    JOIN Students ON CurEnrolls.Student_ID = Students.Student_ID\
    WHERE Students.Student_ID = ?`;
    sql = mysql.format(sql, id);
    coursesql = mysql.format(coursesql, id);
    //console.log(sql);
    //console.log(coursesql);

    db.pool.query(sql, function (err, student){
        if (err) throw err;
      //  console.log(student);
        db.pool.query(coursesql, function(err, courses){
            if (err) throw err;
            //if Student and any Courses found
        //        console.log(courses);  
                res.render('student',{studentData: student, courseData: courses});
        });
    });
}; 

// Update a note identified by the StudentId in the request
module.exports.update = (req, res) => {
    let data = req.body;
    data = Object.keys(data);
    data = JSON.parse(data[0]);
    console.log(data);
    let id = req.params.studentID;

    const student = [data.firstName, data.lastName, data.email, data.phone, id];
    const address = [data.streetAddress, data.city, data.state, data.zip, data.country];

    let getAddressSql = 'SELECT Address_ID from Students WHERE Student_ID = ?';
    let addressSql = 'UPDATE `Addresses` SET `Street`= ?,`City`= ?,`State`= ?,`Zip`= ?,`Country`= ? WHERE `Address_ID` = ?';
    let studentSql = 'UPDATE `Students` SET `First_Name` = ?, `Last_Name` = ?, `Email` = ?, `Phone` = ? WHERE `Student_ID` = ?;'


    getAddressSql = mysql.format(getAddressSql, id);
    studentSql = mysql.format(studentSql, student);

    // Get address ID
    db.pool.query(getAddressSql, function(err, addressID){
        if (err) throw err;
        console.log(getAddressSql);
        console.log(addressID);
        // Update new Address
        addressID = JSON.parse(JSON.stringify(addressID));
        addressID = addressID[0].Address_ID;
        address.push(addressID);
        addressSql = mysql.format(addressSql, address);
        console.log(addressSql);
        db.pool.query(addressSql, function(err, result){
            if (err) throw err;
            // Update new Student Info
            db.pool.query(studentSql, function(err, result){
                if (err) throw err;
            })
        })
    })
   res.render('success', {successMessage: ["Student Updated"]})
};

// Delete a student with the specified StudentId in the request
module.exports.delete = (req, res) => {
    console.log(req.params);
    let id = req.params.studentID;
    let sql = 'DELETE FROM Students WHERE Student_ID = ?';
    let getAddressSql = 'SELECT Address_ID FROM Students WHERE Student_ID = ?';
    let delAddressSql = 'DELETE FROM Address_ID WHERE Address_ID= = ?';
    sql = mysql.format(sql, id);
    getAddressSql = mysql.format(getAddressSql, id);

    // Get address ID
    db.pool.query(getAddressSql, function(err, address){
        if (err) throw err;
        let addressID = address.Address_ID;
        delAddressSql = mysql.format(delAddressSql, addressID);
        // Delete Address
        db.pool.query(delAddressSql, function(err, data){
            // Delete Student
            db.pool.query(sql, function (err, data){
                if (err) throw err;
        
                // if Student not found
                if(data.length <= 0){
                    var msg = 'Error. Please try again.';
                    
                    
                //if Student found
                } else {
                    var msg = `Student ${id} Successfully Deleted`;
                } 
                res.redirect('/students');     
            });
        })
    })
   
};