module.exports = (app) =>{
    const enrollment = require('../controllers/enrollment.controller.js');

    // Retrieve all Current Enrollments
    app.get('/enrollment', enrollment.findAll);
    
    // Retrieve an Enrollment:
    //by ID, Email, or Phone:
    app.get('/enrollment/search', function(req, res){
        console.log(req.query);
        enrollment.findOne(req,res);
    });
    
    // Insert an Enrollment
    app.get('/enrollment/add', enrollment.form);
    app.post('/enrollment', enrollment.create)
    // Delete an Enrollment
    app.delete('/students/:studentID/courses/:courseID/date/:month/:day/:year', enrollment.delete);
}