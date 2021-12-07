const mysql = require('mysql');
const db = require("../../database/dbcon1.js");

// ********************* View Payments **********************************
exports.view = (req, res) => {

    db.pool.getConnection((err, connection) => {
        if(err) throw err; //not connected!!
        console.log('Connected as ID ' + connection.threadId);
        
        // Must Use the correct database first!!!
        connection.query('USE cs340_younjada')

        // Payment the connection
        connection.query('SELECT * FROM (Payments JOIN Students USING (Student_ID))', (err, rows) => {
            //When done with the connection, release it
            connection.release();

            if(!err) { 
              res.render('payments', { rows });
            } else{
              console.log(err);
            }
            console.log('The data from Payments Table: \n', rows);
        });
    });
}

// ************************** Payment Search **********************************************
exports.find = (req, res) => {
  db.pool.getConnection((err, connection) => {
    if(err) throw err; //not connected!!
    console.log('Connected as ID ' + connection.threadId);
    
    // Must Use the correct database first!!!
    connection.query('USE cs340_younjada')

    let course_search = req.body;
    
    let pay_id = course_search.search_pay_id
    let student_id = course_search.search_student_id
    let first_name = course_search.search_first_name
    let last_name = course_search.search_last_name
    let amount = course_search.search_amount
    let method = course_search.search_method
    let date = course_search.search_date
    let course_id = course_search.search_course_id


    // Searching for a Student using search bar. 
    connection.query('SELECT * FROM (Payments JOIN Students USING (Student_ID)) WHERE Pay_ID LIKE ? AND Student_ID LIKE ? AND First_Name LIKE ? AND Last_Name LIKE ? AND Amount LIKE ? AND Method LIKE ? AND Date LIKE ? AND Course_ID LIKE ?',
    ['%' + pay_id + '%', '%' + student_id + '%', '%' + first_name + '%', '%' + last_name + '%', '%' + amount + '%', '%' + method + '%', '%' + date + '%', '%' + course_id + '%',],
    (err, rows) => {
        
        //When done with the connection, release it
        connection.release();

        console.log("payments data: ", rows, "variables: ", date)

        if(!err) { 
          res.render('payments', { rows });
        } else{
          console.log(err);
        }
        console.log('The data from Students Table: \n', rows);
    });
  });
}

// *********************** View Payment Add Form Page **********************************************
exports.form = (req, res) => {
  db.pool.getConnection((err, connection) => {
    if(err) throw err;
  
    connection.query('USE cs340_younjada')
    // Query to get student ids to populate student id field, to Populate Drop Down.
    connection.query('SELECT Student_ID, First_Name, Last_Name FROM Students', (err, rows) => {
      let student_ids = rows
      
      if(!err){
        
        // Query to get Course ids from the Courses Table, to populate Drop Down. 
        connection.query('SELECT Course_ID, Name FROM Courses', (err, rows) => {
          if(!err){
            let course_ids = rows
            connection.release();
            res.render('payment-add', { student_ids, course_ids, alert: null, warning: null });

          } else{
            connection.release();
            console.log(err)
          }
        })
        
      } else{
        connection.release();
        console.log(err)
      }
      console.log('Getting the Data for Student IDs: \n', student_ids)
    })
  });
}

// *********************  Adding Payment into Database.
exports.insert = (req, res) => {

  let { student_id, amount, method, date, course_id } = req.body
  console.log(student_id, amount, method, date, course_id)
  // Amount must be greater than zero.:
  if(amount <= 0){
    PayAddMessage(false, 'Insert failed! Please enter an amount greater than zero!', res)
    console.log("amount is less than zero");
    return;
  };

  // No Student ID was selected:
  if(!student_id){
    PayAddMessage(false, 'Insert failed! Please Select a Student ID!', res)
    console.log("Student ID not Selected");
    return;
  };

  // No Payment Method was selected:
  if(!method){
    PayAddMessage(false, 'Insert failed! Please Select a Payment Method!', res)
    console.log("Payment Method not Selected");
    return;
  };

  // date cannot be blank
  if(date === '' || new Date(date) < new Date("1900-01-01")){
    PayAddMessage(false, 'Insert failed, Either a date was not entered or the Date was before 01/01/1900', res)
    console.log("No date was entered!");
    return;
  };

  if(!course_id){
    PayAddMessage(false, 'Insert failed, No Course ID was selected', res)
    console.log('No Course ID was selected');
    return;
  };

  db.pool.getConnection((err, connection) => {

    if(err) throw err; //not connected!!
    console.log('Connected as ID ' + connection.threadId);
    
    let drop_down = {}
    let balance = {}
    let insert_obj = {}
    let update_obj = {}

    getStudents(drop_down)
    .then( ()=> {

      let student_ids = drop_down.students

      getCourses(drop_down)
      .then( ()=> {

        let course_ids = drop_down.courses

        getBal(student_id, balance)
        .then( ()=> {
          
          insertPay(student_id, amount, method, date, course_id, insert_obj)
          .then( ()=> {
            
            let old_balance = balance.data[0].Balance
            let new_balance = old_balance - amount

            console.log('insertPay object', insert_obj)

            updateBal(student_id, new_balance, update_obj)
            .then( ()=> {

              console.log('updateBal obj', update_obj);
              res.render('payment-add', {alert: 'Successfully Made Payment', warning: null, student_ids, course_ids})
              

            }).catch(() => res.render('payment-add', {alert: null, warning: "Insert Failed on Balance Update!", student_ids, course_ids}))
          }).catch(()=> res.render('payment-add', {alert: null, warning: "Insert Failed on Database Insert!", student_ids, course_ids}))
        })
      })
    })

  });
}

// ********** Edit Page for Payments ************************************
exports.edit = (req, res) => {

  db.pool.getConnection((err, connection) => {
    if(err) throw err; //not connected!!
    console.log('Connected as ID ' + connection.threadId);
    
    var drop_down_data = {}
    var payment_data = {};

    
    getStudents(drop_down_data)
    .then( () => {
      let students_data = drop_down_data.students
      getCourses(drop_down_data)
      .then( () => {
        let courses_data = drop_down_data.courses
        getPayData(req.params.id, payment_data)
        .then( () => {
          let pay_data = payment_data.data[0]
          console.log( { students_data, courses_data, pay_data })
          res.render('payment-edit', {alert: null, warning: null, students_data, courses_data, pay_data })
        })
      })
    })

  });
}


// *************** Update Payments *******************************
exports.update = (req, res) => {
  let { amount, student_id, method, date, course_id } = req.body
  console.log(amount, student_id, method, date, course_id)

  // !!!!!************You need to check the validation issue where null is accepted ******!!!!!!!!
  // Amount validation: 
  if(!amount || amount <= 0){
    PayEditMessage(false, 'Please enter an amount greater than zero!', req, res)
    return;
  }

  // Student ID Validation. 
  if(student_id == 0){
    PayEditMessage(false, 'Please select a Student ID!', req, res)
    return;
  }

  // Method cannot be 0:
  if(method == 0){
    PayEditMessage(false, 'Please select a Payment Method!', req, res)
    return;
  }

  // Date validation
  if(!date){
    PayEditMessage(false, 'Please enter a valid Date!', req, res)
    return;
  }

  // Course ID validation
  if(course_id == 0){
    PayEditMessage(false, 'Please select a Course ID!', req, res)
    return;
  }

  db.pool.getConnection((err, connection) => {
    if(err) throw err; //not connected!!
    console.log('Connected as ID ' + connection.threadId + 'Update Page');
    
    let pay_id = req.params.id
    let return_pay_data = {}
    let bal_data = {}
    let updated_bal_data = {}
    let update_pay_data = {}
    let original_bal = 0
    let new_bal = 0
    let pay_change = 0

    console.log('pay_id is: ', pay_id)
    
    // Get pay data
    getPayData(pay_id, return_pay_data)
    .then( () => {
      console.log(return_pay_data)
      let original_pay_amount = return_pay_data.data[0].Amount;
      pay_change = original_pay_amount - amount;

      console.log(original_pay_amount, pay_change)

      getBal(student_id, bal_data)
      .then( () => {
        original_bal = bal_data.data[0].Balance
        new_bal = original_bal + pay_change;

        console.log(original_bal, new_bal)

        updateBal(student_id, new_bal, updated_bal_data)
        .then( () => {

          console.log(updated_bal_data, "Balance was updated.")

          updatePay(pay_id, student_id, amount, method, date, course_id, update_pay_data)
          .then( () => {
            
            let success_message = `Payment ID: ${return_pay_data.data[0].Pay_ID} for ${return_pay_data.data[0].First_Name} ${return_pay_data.data[0].Last_Name} has been updated.`;
            PayEditMessage(true, success_message, req, res);
            
          }).catch(() => PayEditMessage(false, 'Update Payment Failed on Update Pay', req, res))
        }).catch(() => PayEditMessage(false, 'Update Payment Failed on Update Balance', req, res))

      })
    })
    
  });
}


// ************* Delete Payment **************************************************
exports.delete = (req, res) => {

  db.pool.getConnection((err, connection) => {
    if(err) throw err; //not connected!!
    console.log('Connected as ID ' + connection.threadId);
    
    // Must Use the correct database first!!!
    connection.query('USE cs340_younjada')

    const pay_id = req.params.id

    var bal_data = {}
    var pay_data = {}
    var new_bal_data = {}
    var payment_data = {}

    getPayData(pay_id, pay_data)
    .then( () => {
      stu_id = pay_data.data[0].Student_ID
      stu_amount = pay_data.data[0].Amount

      getBal(stu_id, bal_data)
      .then( () => {
        stu_bal = bal_data.data[0].Balance
        new_bal = stu_bal + stu_amount
        
        updateBal(stu_id, new_bal, new_bal_data)
        .then( () => {
                    
          deletePayment(pay_id, payment_data)
          .then( () => {

          console.log(pay_id, stu_id, stu_amount, stu_bal, new_bal_data, payment_data)
          res.redirect('/payments')
          })
        }) 
      })
    })
  });
}


// *****************  Functions Below:  ************************
function getBal(stu_id, obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        throw(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_younjada')
  
      // Searching for a Course Name using search bar. 
      connection.query('SELECT Balance FROM StuAccts WHERE Student_ID = ?', [stu_id], (err, rows) => {
      connection.release();
        if (err){
          reject(err)
        }
        obj.data = rows
        resolve(obj)
        
      });
    });
  });
}

// Will get All the Payment Data from a specific Pay_ID.
function getPayData(id, obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        throw(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_younjada')
  
      // Searching for a Course Name using search bar. 
      connection.query('SELECT * FROM Payments JOIN Courses USING (Course_ID) JOIN Students USING (Student_ID) WHERE Pay_ID = ?', [id], (err, rows) => {
        
        connection.release();
        if (err){
          reject(err)
        }
        console.log('getPayData: ', rows)
        obj.data = rows
        resolve(obj);

      });
    });
  });
}

function updateBal(id, newBalance, obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        throw(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_younjada')
  
      // Searching for a Course Name using search bar. 
      connection.query('UPDATE StuAccts SET Balance = ? WHERE Student_ID = ?', [newBalance, id], (err, rows) => {
      connection.release();
        if (err){
          reject(err)
        }
        obj.data = rows
        resolve(obj)

      });
    });
  });
}

function deletePayment(id, obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        throw(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_younjada')
  
      // Delete from Payments 
      connection.query('DELETE FROM Payments WHERE Pay_ID = ?', [id], (err, rows) => {
      connection.release();
        if (err){
          reject(err)
        }
        obj.data = rows
        resolve(obj)

      });
    });
  });
}

// This function will return Students Table Data. 
function getStudents(obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        throw(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_younjada')
  
      // Delete from Payments 
      connection.query('SELECT * FROM Students', (err, rows) => {
      connection.release();
        if (err){
          reject(err)
        }
        obj.students = rows
        resolve(obj)

      });
    });
  });
}

// This function will return Courses Table Data. 
function getCourses(obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        throw(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_younjada')
  
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

function updatePay(payment_id, student_id, amount, method, date, course_id, return_obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        throw(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_younjada')
  
      // Updating a Payment with all the information. 
      connection.query('UPDATE Payments SET Student_ID = ?, Amount = ?, Method = ?, Date = ?, Course_ID = ? WHERE Pay_ID = ?',
      [student_id, amount, method, date, course_id, payment_id], (err, rows) => {

        connection.release();
        if (err){
          reject(err)
        }
        return_obj.data = rows
        resolve(return_obj)

      });
    });
  });
}

function PayEditMessage(valid, error_message, req, res){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        reject(err); // if not connected.
      }

      var drop_down_data = {}
      var payment_data = {};
  
      
      getStudents(drop_down_data)
      .then( () => {
        let students_data = drop_down_data.students
        getCourses(drop_down_data)
        .then( () => {
          getPayData(req.params.id, payment_data)
          .then( () => {
            let courses_data = drop_down_data.courses
            let pay_data = payment_data.data[0]
            let success_message = `Payment ID: ${pay_data.Pay_ID} for ${pay_data.First_Name} ${pay_data.Last_Name} has been updated.`
            let warning_message = error_message

            console.log( { students_data, courses_data, pay_data, valid })

            if(valid === true){
              resolve(res.render('payment-edit', { alert: success_message, warning: null, students_data, courses_data, pay_data }))
            }
            else{
              resolve(res.render('payment-edit', { alert: null, warning: warning_message, students_data, courses_data, pay_data }))
            }

            
          })
        })
      })
 

    });
  });
}


function PayAddMessage(valid, message, res){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        reject(err); // if not connected.
      }

      var drop_down_data = {}
  
      getStudents(drop_down_data)
      .then( () => {
        let student_ids = drop_down_data.students

        getCourses(drop_down_data)
        .then( () => {

            let course_ids = drop_down_data.courses

            if(valid === true){
              resolve(res.render('payment-add', { alert: message, warning: null, student_ids, course_ids }))
            }
            else{
              resolve(res.render('payment-add', { alert: null, warning: message, student_ids, course_ids }))
            }

        })
      })
 

    });
  });
}

function insertPay(student_id, amount, method, date, course_id, return_obj){
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if(err) {
        throw(err); // if not connected.
      }

      // Must Use the correct database first!!!
      connection.query('USE cs340_younjada')
  
      // Insert a NEW Payment. 
      connection.query('INSERT INTO Payments SET Student_ID = ?, Amount = ?, Method = ?, Date = ?, Course_ID = ?',
      [student_id, amount, method, date, course_id], (err, rows) => {

        connection.release();
        if (err){
          console.log('function insertPay', err)
          reject(err)
        }
        return_obj.insert_pay_data = rows
        resolve(return_obj)

      });
    });
  });
}
  
    
