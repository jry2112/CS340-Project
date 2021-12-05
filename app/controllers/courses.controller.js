const mysql = require('mysql');
var connection = mysql.createConnection({multipleStatements: true});
const db = require("../../database/dbcon1.js");

// View Courses
exports.view = (req, res) => {

  db.pool.getConnection((err, connection) => {
      if(err) throw err; //not connected!!
      console.log('Connected as ID ' + connection.threadId);
      
      // Must Use the correct database first!!!
      connection.query('USE cs340_garzacao')

      // Courses the connection
      connection.query('SELECT * FROM Courses', (err, rows) => {
          //When done with the connection, release it
          connection.release();

          if(!err) { 
            res.render('courses', { rows });
          } else{
            console.log(err);
          }
          console.log('The data from Courses Table: \n', rows);
      });
  });
}

// Nav bar searches for matches to either First_Name or Last_Name
exports.find = (req, res) => {
db.pool.getConnection((err, connection) => {
  if(err) throw err; //not connected!!
  console.log('Connected as ID for course.find ' + connection.threadId);
  
  // Must Use the correct database first!!!
  connection.query('USE cs340_garzacao')

  let course_search = req.body;
  
  let course_id = course_search.search_course_id
  let course_name = course_search.search_course_name
  let cur_offer = course_search.search_cur_offer
  let insturctor = course_search.search_instructor
  
  console.log(course_search);

  // Searching for a Student using search bar. 
  connection.query('SELECT * FROM Courses WHERE Course_ID LIKE ? AND Name LIKE ? AND Cur_Offer LIKE ? AND Instructor LIKE ?', ['%' + course_id + '%', '%' + course_name + '%', '%' + cur_offer + '%', '%' + insturctor + '%'], (err, rows) => {
      
      //When done with the connection, release it
      connection.release();

      if(!err) { 
        res.render('courses', { rows });
      } else{
        console.log(err);
      }
      console.log('The data from Students Table: \n', rows);
  });
});
}

// **************************** Add-Course Page View *******************************
exports.form = (req, res) => {
res.render('add-course', {row: null, alert: null, warning: null});
}

// **************************** Adding New Course **********************************
exports.insert = (req, res) => {

let { course_id, course_name, cur_offer, course_price, instructor } = req.body
let got_courses = {}
let duplicate = false

getCourses(got_courses).then( ()=> {

  got_courses.courses.forEach(element => {
    if(element.Course_ID == course_id){
      return duplicate = true
    }
  });
  
})
console.log(duplicate)
if(duplicate){
  courseAddMessage(false, 'You entered a Duplicate Course ID, Please choose another number.', res)
  return;
}


// Course ID:
if(!course_id){
  course_id = null
}

// Name validation: 
if(course_name === ''){
  course_name = null
}

// Cur_Offer Code for the checkbox to generate BOOL value. 
if(cur_offer !== 1){
  cur_offer = 0
}else{
  cur_offer = 1
};

// Price must be 0 or greater:
if(course_price < 0){
  course_price = null
}

// Instructor cannot be blank
if(instructor === ''){
  instructor = null
}

db.pool.getConnection((err, connection) => {
  if(err) throw err; //not connected!!
  console.log('Connected as ID ' + connection.threadId);
  
  // Must Use the correct database first!!!
  connection.query('USE cs340_garzacao')



  // Searching for a Student using search bar. 
  connection.query('INSERT INTO Courses (Name, Cur_Offer, Price, Instructor) VALUES (?, ?, ?, ?)', [course_name, cur_offer, course_price, instructor], (err, rows) => {
      
      //When done with the connection, release it
      connection.release();

      if(!err) { 
        res.render('add-course', {row: null, alert: 'Course added successfully', warning: null });
      } else{
        res.render('add-course', {row: null, alert: null, warning: 'Insert failed, please review inputs: Either a field is blank or the Price is negative.' })
        console.log(err);
      }
      console.log('The data from Students Table: \n', rows);
  });
});
}

// Edit Course
exports.edit = (req, res) => {

db.pool.getConnection((err, connection) => {
  if(err) throw err; //not connected!!
  console.log('Connected as ID ' + connection.threadId);
  
  // Must Use the correct database first!!!
  connection.query('USE cs340_garzacao')

  let searchTerm = req.body.search;

  // Searching for a Course Name using search bar. 
  connection.query('SELECT * FROM Courses WHERE Course_ID = ?', [req.params.id], (err, rows) => {
      
      //When done with the connection, release it
      connection.release();

      const row = rows[0]

      if(!err) {
        
        res.render('edit-course', { row, alert: null, warning: null });
      } else{
        console.log(err);
      }
      console.log('The data from Students Table: \n', row);
  });
});
}


// Update Course
exports.update = (req, res) => {
let { course_name, cur_offer, course_price, instructor } = req.body

console.log(course_name, cur_offer, course_price, instructor)

  // !!!!!************You need to check the validation issue where null is accepted ******!!!!!!!!
  // Name validation: 
  if(course_name === ''){
    courseEditMessage(false, 'Please enter a Course Name.', req, res);
    return;
  }

  // Cur_Offer Code for the checkbox to generate BOOL value. 
  if(!cur_offer){
    cur_offer = 0
  }else{
    cur_offer = 1
  };

  // Price must be 0 or greater:
  if(course_price < 0){
    courseEditMessage(false, 'Please enter a Course Price greater than or equal to zero.', req, res);
    return;
  }

  // Instructor cannot be blank
  if(instructor === ''){
    courseEditMessage(false, 'Please enter an Instructor Name', req, res);
    return;
  }

db.pool.getConnection((err, connection) => {
  if(err) throw err; //not connected!!
  console.log('Connected as ID ' + connection.threadId);
  
  // Must Use the correct database first!!!
  connection.query('USE cs340_garzacao')

  let searchTerm = req.body.search;

  // SQL Update query. 
  connection.query('UPDATE Courses SET Name = ?, Cur_Offer = ?, Price = ?, Instructor = ? WHERE Course_ID = ?', 
  [course_name, cur_offer, course_price, instructor, req.params.id], (err, rows) => {
      
      //When done with the connection, release it
      connection.release();

      let row = rows[0]

      if(!err) { 

        db.pool.getConnection((err, connection) => {
          if(err) throw err; //not connected!!
          console.log('Connected as ID ' + connection.threadId);
          
          // Must Use the correct database first!!!
          connection.query('USE cs340_garzacao')
      
          let searchTerm = req.body.search;
      
          // Searching for a Course Name using search bar. 
          connection.query('SELECT * FROM Courses WHERE Course_ID = ?', [req.params.id], (err, rows) => {
              
              //When done with the connection, release it
              connection.release();

              row = rows[0]
      
              if(!err) { 
                res.render('edit-course', { row, alert: `${course_name} has been updated.`, warning: null });
              } else{
                console.log(err);
              }
              console.log('The data from Students Table: \n', row);
          });
        });

      } else{
        res.render('edit-course', { row, alert: null, warning: `${course_name} Failed Update.` });
        console.log(err);
      }
      console.log('The data from Students Table: \n', row);
  });
});
}

// Delete Course
exports.delete = (req, res) => {

db.pool.getConnection((err, connection) => {
  if(err) throw err; //not connected!!
  console.log('Connected as ID ' + connection.threadId);
  
  // Must Use the correct database first!!!
  connection.query('USE cs340_garzacao')

  let searchTerm = req.body.search;

  // Searching for a Course Name using search bar. 
  connection.query('DELETE FROM Courses WHERE Course_ID = ?', [req.params.id], (err, rows) => {
      
      //When done with the connection, release it
      connection.release();

      let row = rows[0]

      if(!err) { 
        res.redirect('/courses');
      } else{
        console.log(err);
      }
      console.log('The data from Students Table: \n', row);
  });
});
}


// ************************* Functions Below ********************************************

function courseEditMessage(valid, message, req, res){
return new Promise((resolve, reject) => {
  db.pool.getConnection((err, connection) => {
    if(err) {
      reject(err); // if not connected.
    }

    // Must Use the correct database first!!!
    connection.query('USE cs340_garzacao')

    connection.query('SELECT * FROM Courses WHERE Course_ID = ?', [req.params.id], (err, rows) => {
      
      //When done with the connection, release it
      connection.release();

      const row = rows[0]
      
      console.log('courseEditMessage, and data: ', rows, err, req.params.id, row)

          if(valid === true && !err){
            resolve(res.render('edit-course', { row, alert: message, warning: null }))
          }
          else{
            resolve(res.render('edit-course', { row, alert: null, warning: message }))
          }
    })
  })


});
};

function courseAddMessage(valid, message, res){
return new Promise((resolve, reject) => {
  db.pool.getConnection((err, connection) => {
    if(err) {
      reject(err); // if not connected.
    }

    if(valid === true && !err){
      resolve(res.render('add-course', { row: null, alert: message, warning: null }))
    }
    else{
      resolve(res.render('add-course', { row: null, alert: null, warning: message }))
    }
  })


});
};


// This function will return Courses Table Data. 
function getCourses(obj){
return new Promise((resolve, reject) => {
  db.pool.getConnection((err, connection) => {
    if(err) {
      throw(err); // if not connected.
    }

    // Must Use the correct database first!!!
    connection.query('USE cs340_garzacao')

    // Delete from Payments 
    connection.query('SELECT * FROM Courses', (err, rows) => {
    connection.release();
      if (err){
        reject(err)
      }
      obj.courses = rows
      resolve(obj)

    });
  });
});
}