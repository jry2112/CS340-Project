module.exports = (app) =>{
    const students = require('../controllers/students.controller.js');

    // Retrieve all Students
    app.get('/students', students.findAll);
    // Retrieve a Student:
    //by ID:
    app.get('/students/:studentID', students.findOne);
    // by Email:

    //Phone

    // Insert a Student
    app.post('/students', students.create)
    // Update a Student
    app.put('/students/:studentID', students.update);
    // Delete a Student
    app.delete('/students/:studentID', students.delete);
}