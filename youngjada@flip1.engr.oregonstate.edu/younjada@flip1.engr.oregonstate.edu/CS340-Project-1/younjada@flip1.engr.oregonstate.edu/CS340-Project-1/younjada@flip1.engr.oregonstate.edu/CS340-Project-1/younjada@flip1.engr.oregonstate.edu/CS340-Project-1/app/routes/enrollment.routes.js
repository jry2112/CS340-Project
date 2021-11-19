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
    app.post('/enrollment', enrollment.create)
    // Update an Enrollment
    app.put('/enrollment/:enrollmentID', enrollment.update);
    // Delete an Enrollment
    app.delete('/enrollment/:enrollmentID', enrollment.delete);
}