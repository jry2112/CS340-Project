const db = require("../../database/dbcon1.js");
const mysql = require('mysql');
const { response } = require("express");
// Data validation helper functions

function validateForm(req) {
    let response = {
        errors: [],
        success: []
    }

    let student = [req.body.Student_ID]
    let address = [req.body.Address_ID]

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var phone = req.body.phone;

    var street = req.body.streetAddress;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var country = req.body.country;

    // First and Last Name: A-Z, a-z only, capitalize first letter
    // Email: [A-Z, a-z; '@'; "."; A-Z, a-z domain ending]
    // Phone: [0-9] 10 digits
    // Zip: 5-digit number chars
    // Valid city, state, country = alphaletters with spaces allowed
    const alphaLetters = /^[A-Za-z]+$/;
    const emailChars = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const zipChars = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    const alphaLettersWithSpace = /^[a-zA-Z\s]*$/;
    const phoneNums = /^\d{10}/;

    const validationList = {
        firstName: alphaLetters.test(firstName),
        lastName: alphaLetters.test(lastName),
        email: emailChars.test(email),
        phone: phoneNums.test(phone),
        street: true,
        city: alphaLettersWithSpace.test(city),
        state: alphaLettersWithSpace.test(state),
        country: alphaLettersWithSpace.test(country),
        zip: zipChars.test(zip)
    };

    console.log(validationList);

    if (!(validationList.firstName) || !(validationList.lastName)) {
        response.errors.push("Invalid Name Entry, please only use letters.")
    } else {
        firstName = firstName.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
        lastName = lastName.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
        student.push(firstName);
        student.push(lastName);

    }

    if (!(validationList.email)) {
        response.errors.push("Invalid Email Entry, please use the format: sample@email.com.")
    } else {
        student.push(email.toLowerCase());
    }

    if (!(validationList.phone)) {
        response.errors.push("Invalid Phone Entry, please use the format: 1231231234.")
    } else {
        student.push(phone);
    }

    if (!(validationList.city) || !(validationList.state) || !(validationList.country) || !(validationList.zip)) {
        response.errors.push("Invalid Address entered. Please only enter letters and spaces for city, state, and country. Please use the following format for Zip Code: 12345 OR 12345-1234 ")
    } else {
        address.push(street);
        address.push(city);
        address.push(state);
        address.push(zip);
        address.push(country);
    }
    console.log(student);
    return {responseData: response, 
        studentData: student,
        addressData: address};

}



// Create and Save a new Student
exports.create = (req, res) => {
    // Validate request
    let validation = validateForm(req);

    console.log(validation);
    if (validation.responseData.errors.length > 0) {
        res.render('error', validation.responseData.errors);
    }
    // Create a Student
    let student =validation.studentData;
    let address = validation.addressData;

    // Save Student in the database
    let sql = 'INSERT INTO Students (Student_ID, First_Name, Last_Name, Email, Phone) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE Student_ID = Student_ID';
    let lastStuIDsql = 'SELECT Student_ID FROM Students WHERE First_Name = ? AND Last_Name = ? AND Email = ? AND Phone = ?'
    let addressSql = 'INSERT INTO Addresses (Address_ID, Street, City, State, Zip, Country) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE Address_ID = Address_ID';
    let lastAddSql = 'SELECT Address_ID FROM Addresses WHERE Street = ? AND City = ? AND State = ? AND Zip = ? AND Country = ?';
    let stuAddressSql = 'UPDATE Students SET Address_ID = ? WHERE Students.Student_ID = ?';
    sql = mysql.format(sql, student);
    lastStuIDsql = mysql.format(lastStuIDsql, student.slice(1));
    addressSql = mysql.format(addressSql, address);
    lastAddSql = mysql.format(lastAddSql, address.slice(1));
    console.log(sql, lastStuIDsql, addressSql, lastAddSql);
    // Insert new Student
    db.pool.query(sql, (err, data) => {
        console.log(sql);
        if (err) throw err;
        // Insert new Address
        db.pool.query(addressSql, (err, data) => {
            console.log(addressSql);
            if (err) throw err;
            // Get new Address_ID
            db.pool.query(lastAddSql, (err, data) => {
                console.log(lastAddSql);
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
            });  
        });
    });
   res.redirect('/students');
};

// Retrieve student add form
module.exports.form = (req, res) => {
    res.render('add-student', {row: null, alert: null, warning: null});
}

// Retrieve and return all Students from the database.
module.exports.findAll = (req, res) => {
    let sql = 'SELECT * FROM Students LEFT JOIN Addresses ON Students.Address_ID = Addresses.Address_ID ORDER BY Student_ID asc'; 

    db.pool.query(sql, function(err, data){
        if (err){
            throw err;  
        } else {
            res.render('students', {userData: data});
        }

    })
};  

// Find a single Student with a StudentID
module.exports.findOne = (req, res) => {
    console.log(req.params);
    // Query if filtering, params if Edit button
    let id = req.query.searchID || req.params.studentID;
    if (id === req.query.searchID) {
        id = "%" + id + "%";
    }
    let sql = `SELECT * FROM Students LEFT JOIN Addresses ON Students.Address_ID = Addresses.Address_ID WHERE Student_ID LIKE ?`;
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
        if (student.length > 1) {
            res.render('students', {userData: student})
        }
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
    res.redirect(303, '/students');
};

// Delete a student with the specified StudentId in the request
module.exports.delete = (req, res) => {
    console.log(req.params);
    let id = req.params.studentID;
    let sql = 'DELETE FROM Students WHERE Student_ID = ?';
    let getAddressSql = 'SELECT Address_ID FROM Students WHERE Student_ID = ?';
    let delAddressSql = 'DELETE FROM Addresses WHERE Address_ID = ? AND NOT EXISTS(SELECT * FROM Students WHERE Address_ID = ? AND Student_ID != ?);';
    sql = mysql.format(sql, id);
    getAddressSql = mysql.format(getAddressSql, id);

    // Get address ID
    db.pool.query(getAddressSql, function(err, address){
        if (err) throw err;
        let addressID = JSON.parse(JSON.stringify(address));
        if (addressID) {
            addressID = addressID[0].Address_ID;
        }
        console.log(addressID);
        if (addressID == null) {
            delAddressSql = mysql.format(delAddressSql, 0)
        } else {
            delAddressSql = mysql.format(delAddressSql, [addressID, addressID, id]);
        }
        console.log(delAddressSql)
        // Delete Address
        db.pool.query(delAddressSql, function(err, data){
            if(err) throw err;
            // Delete Student
            db.pool.query(sql, function (err, data){
                if (err) throw err;
        
                // if Student not found
                if(data.length <= 0){
                    var msg = 'Error. Please try again.';
                    
                    
                //if Student found
                } else {
                    var msg = `Student ${id} Successfully Deleted`;
                    console.log(msg);
                   
                }      
            });
        });
        
    })
    res.redirect(303, '/students');
};

// Source: https://blog.logrocket.com/node-js-express-js-mysql-rest-api-example/