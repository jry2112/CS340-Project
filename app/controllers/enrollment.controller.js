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
module.exports.form = (req, res) => {
    let ids = {}
    let studentSql = 'SELECT Student_ID FROM Students WHERE 1';
    let courseSql = 'SELECT Course_ID FROM Courses WHERE Cur_Offer = 1'
    db.pool.query(studentSql, (err, stuIDs) => {
        if (err) throw err;
        //stuIDs = JSON.stringify(stuIDs);     
        db.pool.query(courseSql, (err, courseIDs) => {
            if (err) throw err;   
            //courseIDs = JSON.stringify(courseIDs);
            console.log(stuIDs, courseIDs);
            res.render('add-enrollment', {students: stuIDs, courses:courseIDs, alert: null, warning: null});
        })
    })

    
}
// Create and Save a new Enrollment
module.exports.create = (req, res) => {
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
    let sql = 'INSERT INTO CurEnrolls (Student_ID, Course_ID) VALUES (?,?) ON DUPLICATE KEY UPDATE Student_ID = Student_ID';
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
    let id = '%' + req.query.searchID + '%';
    let sql = `SELECT Students.Student_ID, Students.First_Name, Students.Last_Name, Courses.Course_ID, Courses.Name, Courses.Instructor, CurEnrolls.Date \
    FROM Students JOIN CurEnrolls ON Students.Student_ID = CurEnrolls.Student_ID\
     JOIN Courses ON CurEnrolls.Course_ID = Courses.Course_ID\
     WHERE Students.Student_ID LIKE ? OR Courses.Course_ID LIKE ?;`;
    sql = mysql.format(sql, [id, id]);
    console.log(sql);
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
    console.log(req.params);
    let values = [];
    let date = "";
    values.push(req.params.studentID);
    values.push(req.params.courseID);
    if (parseInt(req.params.day) < 10) {
        date = req.params.month + "0" + req.params.day + req.params.year 
    } else {
        date = req.params.month + req.params.day + req.params.year
    }
    values.push(date);
    //SELECT Student_ID, Course_ID FROM CurEnrolls WHERE DATE_FORMAT(Date, '%m/%d/%Y') = "12/04/2021";
    let sql = "DELETE FROM CurEnrolls WHERE Student_ID = ? AND Course_ID = ? AND Date = STR_TO_DATE(?, '%m%d%Y')";
    sql = mysql.format(sql, values);
    console.log(sql);
    db.pool.query(sql, function (err, data){
        if (err) throw err;
        console.log(data);
        
    })
    this.findAll(req,res);
};

// Source: https://blog.logrocket.com/node-js-express-js-mysql-rest-api-example/