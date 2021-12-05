const mysql = require('mysql');
var connection = mysql.createConnection({multipleStatements: true});
const db = require("../../database/dbcon1.js");


// ****************************** View Balances **************************
exports.view = (req, res) => {

  db.pool.getConnection((err, connection) => {
    if(err) throw err; //not connected!!
    console.log('Connected as ID ' + connection.threadId);
    
    // Must Use the correct database first!!!
    connection.query('USE cs340_garzacao')

    // Courses the connection
    connection.query('SELECT * FROM StuAccts JOIN Students USING (Student_ID)', (err, rows) => {
      //When done with the connection, release it
      connection.release();

      if(!err) { 
        res.render('stuAccts', { rows });
      } else{
        console.log(err);
      }
      console.log('The data from StuAccts Table: \n', rows);
    });
  });
}

// ****************************Search for Balances **********************
exports.find = (req, res) => {
  db.pool.getConnection((err, connection) => {
    if(err) throw err; //not connected!!
    console.log('Connected as ID ' + connection.threadId);
    
    // Must Use the correct database first!!!
    connection.query('USE cs340_garzacao')

    let course_search = req.body;
    
    let student_id = course_search.search_student_id
    let first_name = course_search.search_first_name
    let last_name = course_search.search_last_name
    let balance = course_search.search_balance
    
    console.log("variables listed:",course_search, student_id, first_name, last_name, balance);

    // Searching for a Student using search bar. 
    connection.query('SELECT * FROM (StuAccts JOIN Students USING (Student_ID)) WHERE Student_ID LIKE ? AND First_Name LIKE ? AND Last_Name LIKE ? AND Balance LIKE ?',
    ['%' + student_id + '%', '%' + first_name + '%', '%' + last_name + '%', '%' + balance + '%'],
    (err, rows) => {
        
        //When done with the connection, release it
        connection.release();

        console.log(rows)

        if(!err) { 
          res.render('stuAccts', { rows });
        } else{
          console.log(err);
        }
        console.log('The data from StuAccts Table: \n', rows);
    });
  });
}

// ************************* Page for Adding Student Balance ****************
exports.form = (req, res) => {
  db.pool.getConnection((err, connection) => {
    if(err) throw err; //not connected!!
    console.log('Connected as ID ' + connection.threadId);
    
    // Must Use the correct database first!!!
    connection.query('USE cs340_garzacao')

    // Courses the connection
    connection.query('SELECT * FROM Students WHERE Student_ID NOT IN (SELECT Student_ID FROM StuAccts)', (err, rows) => {
        //When done with the connection, release it
        connection.release();

        if(!err) { 
          let student_ids = rows
          res.render('stuAccts-add', { alert: null, warning: null, student_ids });
        } else{
          console.log(err);
        }
        console.log('The data from StuAccts Table: \n', rows);
    });
});


}

// ************************* Insert New Student Balance *********************
exports.insert = (req, res) => {

  let { student_id, balance } = req.body

  // Name validation: 
  if(!student_id){
    balAddMessage(false, 'Please select a Student ID!', res)
    return;
  }

  // Price must be 0 or greater:
  if(!balance){
    balAddMessage(false, 'Please enter a starting balance!', res)
    return;
  }

  db.pool.getConnection((err, connection) => {
    if(err) throw err; //not connected!!
    console.log('Connected as ID ' + connection.threadId);
    
    // Must Use the correct database first!!!
    connection.query('USE cs340_garzacao')

    let get_ids = {}
    let bal_return_obj = {}

    insertBal(student_id, balance, bal_return_obj)
    .then( ()=>{

      getNewStudentIds(get_ids)
      .then( ()=> {
  
        let student_ids = get_ids.new_stu_ids
        res.render('stuAccts-add', {alert: 'Balance added successfully', warning: null, student_ids });

      })
    })


  });
}

// ************************ Functions *********************************

// Get the Ids of students without a student balance already created. 
function getNewStudentIds(ids_obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        reject(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_garzacao')

      // Query for INSERT of New StuAcct
      connection.query('SELECT * FROM Students WHERE Student_ID NOT IN (SELECT Student_ID FROM StuAccts)', (err, rows) => {
        
        connection.release();

        if (err){
          console.log('function getNewStudentIds: ', err)
          reject(err)
        }
        ids_obj.new_stu_ids = rows
        resolve(ids_obj)
        
      });

    });
  });
}
// Insert new Balance
function insertBal(stu_id, new_bal, query_obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        reject(err); // if not connected.
      }
  
      // Must Use the correct database first!!!
      connection.query('USE cs340_garzacao')

      // Query for INSERT of New StuAcct
      connection.query('INSERT INTO StuAccts (Student_ID, Balance) VALUES (?, ?)', [stu_id, new_bal], (err, rows) => {
        
        connection.release();

        if (err){
          console.log('function InsertBal: ', err)
          reject(err)
        }
        query_obj.insert_bal_data = rows
        resolve(query_obj)
        
      });

    });
  });
}

// Messaging for adding a Balance:
function balAddMessage(valid, message, res){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        reject(err); // if not connected.
      }

      let get_ids = {}

      getNewStudentIds(get_ids)
      .then( ()=> {

        let student_ids = get_ids.new_stu_ids

        if(valid){
          resolve(res.render('stuAccts-add', {alert: message, warning: null, student_ids }))
        } 
        else{
          resolve(res.render('stuAccts-add', {alert: null, warning: message, student_ids }))
        }
      })
    
    });
  });
}