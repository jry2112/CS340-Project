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
        connection.query('SELECT * FROM Courses ORDER BY Course_ID asc', (err, rows) => {
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


  // Course ID:
  if(!course_id){
    courseAddMessage(false, 'Please enter a Course ID Number!', res)
    return;
  }

  // Name validation: 
  if(course_name === ''){
    courseAddMessage(false, 'You Entered a Duplicate Course ID!', res)
    return;
  }

  // Cur_Offer Code for the checkbox to generate BOOL value. 
  if(cur_offer !== 1){
    cur_offer = 0
  }else{
    cur_offer = 1
  };

  // Price must be 0 or greater:
  if(!course_price || course_price < 0){
    courseAddMessage(false, 'Please enter a Course Price of 0 or Greater!', res)
    return
  }

  // Instructor cannot be blank
  if(instructor === ''){
    courseAddMessage(false, 'Please enter an Instructor Name', res)
    return;
  }

  db.pool.getConnection((err, connection) => {
    if(err) throw err; //not connected!!
    console.log('Connected as ID ' + connection.threadId);

    let got_courses = {}
    let return_query = {}
    let duplicate_course_id = false
    let duplicate_course_name =false
    
    getCourses(got_courses).then( ()=> {

      got_courses.courses.forEach(element => {
        if(element.Course_ID == course_id){
          courseAddMessage(false, 'You Entered a Duplicate Course ID!', res)
          duplicate_course_id = true
          return;
        }

        if(element.Name == course_name.trim()){
          courseAddMessage(false, 'That Course Name is already in use!', res)
          duplicate_course_name = true
          return
        }
      });

      console.log("There was a duplicate course ID: ", duplicate_course_id, "There was a duplicate course_name: ", duplicate_course_name)

      if(duplicate_course_id || duplicate_course_name){
        return;
      }
        
      insertCourse(course_name.trim(), cur_offer, course_price, instructor.trim(), return_query)
      .then( ()=> {

        let row = return_query.return_data
        console.log('Insert Promise returned the following row data: ', row)
        res.render('add-course', { row: null, alert: 'Course added successfully', warning: null });

      }).catch(()=> courseAddMessage(false, 'Insert Failed review inputs', res))
    }).catch(()=> courseAddMessage(false, 'Could not get Course IDs', res))

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
  let {course_id, course_name, cur_offer, course_price, instructor } = req.body

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

    let got_courses = {}
    let return_query = {}
    let duplicate_course_id = false
    let duplicate_course_name =false
    let return_course_query = {}

    
    
    getOtherCourses(req.params.id, got_courses).then( ()=> {

      got_courses.courses.forEach(element => {
        if(element.Course_ID == course_id){
          courseEditMessage(false, `You Entered (${course_id}), a Duplicate Course ID!`, req, res)
          duplicate_course_id = true
          return;
        }

        if(element.Name == course_name.trim()){
          courseEditMessage(false, `The Course Name (${course_name.trim()}), is already in use!`, req, res)
          duplicate_course_name = true
          return
        }
      });

      console.log("There was a duplicate course ID: ", duplicate_course_id, "There was a duplicate course_name: ", duplicate_course_name)

      if(duplicate_course_id || duplicate_course_name){
        return;
      }
        
      updateCourse(course_id, req.params.id, course_name.trim(), cur_offer, course_price, instructor.trim(), return_query)
      .then( ()=> {

        console.log('updateCourse retured data: ', return_query)

        getCourse(course_id, return_course_query)
        .then( ()=> {

          let row = return_course_query.course

          console.log('getCourse returned the following row data: ', row)
          res.render('edit-course', { row, alert: 'Course updated successfully', warning: null });

        }).catch(()=> courseEditMessage(false, 'Could not get the updated course', req, res))
        

      }).catch(()=> courseEditMessage(false, 'Update Failed review inputs', req, res))
    }).catch(()=> courseEditMessage(false, 'Could not get Course IDs', req, res))

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

// Insert New Course
function insertCourse(course_name, cur_offer, price, instructor, query_obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        reject(err); // if not connected.
      }
  
      // Must Use the correct database first!!!
      connection.query('USE cs340_garzacao')

      // Query for INSERT of New StuAcct
      connection.query('INSERT INTO Courses (Name, Cur_Offer, Price, Instructor) VALUES (?, ?, ?, ?)', [course_name, cur_offer, price, instructor], (err, rows) => {
        
        connection.release();

        if (err){
          console.log('function InsertCourse: ', err)
          reject(err)
        }
        query_obj.return_data = rows
        resolve(query_obj)
        
      });

    });
  });
}

// Get One Course
function getCourse(course_id, obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        throw(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_garzacao')
  
      // Delete from Payments 
      connection.query('SELECT * FROM Courses WHERE Course_ID = ?', [course_id], (err, rows) => {
      connection.release();
        if (err){
          reject(err)
        }
        console.log('getCourse rows data: ', rows)
        obj.course = rows[0]
        resolve(obj)

      });
    });
  });
}

// Update Course
function updateCourse(new_course_id, course_id, course_name, cur_offer, price, instructor, query_obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        reject(err); // if not connected.
      }
  
      // Must Use the correct database first!!!
      connection.query('USE cs340_garzacao')

      // Query for INSERT of New StuAcct
      connection.query('UPDATE Courses SET Course_ID = ?, Name = ?, Cur_Offer = ?, Price = ?, Instructor = ? WHERE Course_ID = ?', [new_course_id, course_name, cur_offer, price, instructor, course_id], (err, rows) => {
        
        connection.release();

        if (err){
          console.log('function InsertCourse: ', err)
          reject(err)
        }
        query_obj.return_data = rows
        resolve(query_obj)
        
      });

    });
  });
}

// This function will return Courses Table Data excluding the given Course ID. 
function getOtherCourses(course_id, obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        throw(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_garzacao')
  
      // Delete from Payments 
      connection.query('SELECT * FROM Courses WHERE NOT Course_ID = ?', [course_id], (err, rows) => {
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