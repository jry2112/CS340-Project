module.exports = (app) => {
  const students = require("../controllers/students.controller.js");
  const Courses_Controller = require("../controllers/courses.controller");
  const Payments_Controller = require("../controllers/payments.controller");
  const StuAccts_Controller = require("../controllers/stuAccts.controller");
  const Index_Controller = require("../controllers/Index_Controller");

  // Retrieve all Students
  app.get("/students", students.findAll);

  // Retrieve a Student:
  //by ID:
  app.get("/students/edit/:studentID", students.findOne);
  app.get('/students/search', function(req, res){
    console.log(req.query);
    students.findOne(req,res);
});
  // Insert a Student
  app.get('/students/add', students.form);
  app.post("/students", students.create);
  // Update a Student
  app.put("/students/:studentID", students.update);
  // Delete a Student
  app.delete("/students/:studentID", students.delete);

  // Courses: create, find, update, delete
  app.get("/courses", Courses_Controller.view);
  app.post("/courses", Courses_Controller.find);
  app.get("/courses/:id", Courses_Controller.delete);

  app.get("/addCourse", Courses_Controller.form);
  app.post("/addCourse", Courses_Controller.insert);

  app.get("/editCourse/:id", Courses_Controller.edit);
  app.post("/editCourse/:id", Courses_Controller.update);

  //              Payments:
  // Display:
  app.get("/payments", Payments_Controller.view);
  // Add Payment Page with form:
  app.get("/paymentAdd", Payments_Controller.form);
  // Insert new Payment into Database:
  app.post("/paymentAdd", Payments_Controller.insert);
  // Delete Payment in Database:
  app.get("/payments/:id", Payments_Controller.delete);
  // Edit Page View:
  app.get("/paymentEdit/:id", Payments_Controller.edit);
  // Update Database info:
  app.post("/paymentEdit/:id", Payments_Controller.edit);

  //              StuAccts:
  // Display:
  app.get("/stuAccts", StuAccts_Controller.view);
  // Add Student Acct Balance:
  app.get("/stuAcctAdd", StuAccts_Controller.form);
  // Insert new Student Acct/Balance:
  app.post("/stuAcctAdd", StuAccts_Controller.insert);

  // Delete Balance:
  //app.get("/stuAccts/:id", StuAccts_Controller.delete);
};


// Source: https://blog.logrocket.com/node-js-express-js-mysql-rest-api-example/