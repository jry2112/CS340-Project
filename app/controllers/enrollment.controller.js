<<<<<<< HEAD
const db = require("../../database/dbcon1.js");
const mysql = require('mysql');

// Retrieve and return all Current Enrollments from the database.
module.exports.findAll = (req, res) => {
    let sql = `SELECT Students.Student_ID, Students.First_Name, Students.Last_Name, Courses.Course_ID, Courses.Name, Courses.Instructor, CurEnrolls.Date \
    FROM Students JOIN CurEnrolls ON Students.Student_ID = CurEnrolls.Student_ID\
     JOIN Courses ON CurEnrolls.Course_ID = Courses.Course_ID;`; 

    db.pool.query(sql, function(err, data){
        if (err) throw err;
        res.render('enrollment', {userData: data});
    })
};  

// Create and Save a new Enrollment
exports.create = (req, res) => {
    // Validate request
    console.log(req.body)

    // Create an Enrollment
    let enrollment = [
        req.body.studentID,
        req.body.courseID
    ];
    // Save Enrollemnt in the database
    let sql = 'INSERT INTO CurEnrolls (Student_ID, Course_ID) VALUES (?,?)';
    sql = mysql.format(sql, enrollment);
    db.pool.query(sql, (err, data, res) => {
        if (err) throw err;
    })
   this.findAll(req,res);
};


// Find a single Enrollment with Student ID or Course ID
module.exports.findOne = (req, res) => {
    let id = req.query.searchID;
    let sql = `SELECT Students.Student_ID, Students.First_Name, Students.Last_Name, Courses.Course_ID, Courses.Name, Courses.Instructor, CurEnrolls.Date \
    FROM Students JOIN CurEnrolls ON Students.Student_ID = CurEnrolls.Student_ID\
     JOIN Courses ON CurEnrolls.Course_ID = Courses.Course_ID\
     WHERE Students.Student_ID = ? OR Courses.Course_ID = ?;`;
    sql = mysql.format(sql, [id, id]);

    db.pool.query(sql, function (err, data){
        if (err) throw err;
        console.log(data)
        
        // if enrollment record not found
        //if(data.length <= 0){
          //  res.redirect('/enrollment')
        //}
        //if enrollment record found
        //else{
            res.render('enrollment',{userData: data});
        //}
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
=======
const db = require("../../database/dbcon1.js");
const mysql = require('mysql');

// Retrieve and return all Current Enrollments from the database.
module.exports.findAll = (req, res) => {
    let sql = `SELECT Students.Student_ID, Students.First_Name, Students.Last_Name, Courses.Course_ID, Courses.Name, Courses.Instructor, CurEnrolls.Date \
    FROM Students JOIN CurEnrolls ON Students.Student_ID = CurEnrolls.Student_ID\
     JOIN Courses ON CurEnrolls.Course_ID = Courses.Course_ID;`; 

    db.pool.query(sql, function(err, data){
        if (err) throw err;
        res.render('enrollment', {userData: data});
    })
};  

// Create and Save a new Enrollment
exports.create = (req, res) => {
    // Validate request
    console.log(req.body)

    // Create an Enrollment
    let enrollment = [
        req.body.studentID,
        req.body.courseID
    ];

    // Validate that Course is CurOffered
    let validateSql = 'SELECT Cur_Offer FROM Courses WHERE Course_ID = ?';
    validateSql = mysql.format(validateSql, req.body.courseID)
    let sql = 'INSERT INTO CurEnrolls (Student_ID, Course_ID) VALUES (?,?)';
    sql = mysql.format(sql, enrollment);
    db.pool.query(validateSql, (err, data) => {
        if (err) throw err;
        // If course is not offered
        data =  JSON.parse(JSON.stringify(data));
        console.log(data[0].Cur_Offer)
        if (data[0].Cur_Offer == 0) {
            console.log(data);
            errorMessage = [
                {error: "Error: Course is not Currently Offered"}];
            res.render('error', {errorMessage: errorMessage});
        } else {
            // Enroll the student
            db.pool.query(sql, (err, data, res) => {
                if (err) throw err;
                console.log("Student Enrolled")
        })
        this.findAll(req,res);
        }    

    });

};


// Find a single Enrollment with Student ID or Course ID
module.exports.findOne = (req, res) => {
    let id = req.query.searchID;
    let sql = `SELECT Students.Student_ID, Students.First_Name, Students.Last_Name, Courses.Course_ID, Courses.Name, Courses.Instructor, CurEnrolls.Date \
    FROM Students JOIN CurEnrolls ON Students.Student_ID = CurEnrolls.Student_ID\
     JOIN Courses ON CurEnrolls.Course_ID = Courses.Course_ID\
     WHERE Students.Student_ID = ? OR Courses.Course_ID = ?;`;
    sql = mysql.format(sql, [id, id]);

    db.pool.query(sql, function (err, data){
        if (err) throw err;
        console.log(data)
        
        // if enrollment record not found
        //if(data.length <= 0){
          //  res.redirect('/enrollment')
        //}
        //if enrollment record found
        //else{
            res.render('enrollment',{userData: data});
        //}
    })


};

// Update an Enrollment identified by the StudentId in the request
module.exports.update = (req, res) => {

};

// Delete an Enrollment with the specified StudentId in the request
module.exports.delete = (req, res) => {
    console.log(req);
    let id = req.params.enrollmentID;
    let sql = 'DELETE FROM Cur_Enrolls WHERE Student_ID = ?';
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
>>>>>>> defd63c27f1be144550dc541be08ea2993af589f
};