const express = require('express');
const router = express.Router();
const Courses_Controller = require('../controllers/courses.controller.js');
const Payments_Controller = require('../controllers/payments.controller.js');
const StuAccts_Controller = require('../controllers/stuAccts.controller.js');
const Index_Controller = require('../controllers/Index_Controller')

// Index Page:
router.get('/', Index_Controller.home)

// Courses: create, find, update, delete
router.get('/courses', Courses_Controller.view);
router.post('/courses', Courses_Controller.find);
router.get('/courses/:id', Courses_Controller.delete);

router.get('/addCourse', Courses_Controller.form);
router.post('/addCourse', Courses_Controller.insert);

router.get('/editCourse/:id', Courses_Controller.edit);
router.post('/editCourse/:id', Courses_Controller.update);

//              Payments: 
// Display:
router.get('/payments', Payments_Controller.view);
// Add Payment Page with form:
router.get('/paymentAdd', Payments_Controller.form);
// Insert new Payment into Database: 
router.post('/paymentAdd', Payments_Controller.insert);
// Delete Payment in Database:
router.get('/payments/:id', Payments_Controller.delete);
// Edit Page View:
router.get('/paymentEdit/:id', Payments_Controller.edit);
// Update Database info:
router.post('/paymentEdit/:id', Payments_Controller.edit);

//              StuAccts:
// Display:
router.get('/stuAccts', StuAccts_Controller.view);
// Add Student Acct Balance:
router.get('/stuAcctAdd', StuAccts_Controller.form);
// Insert new Student Acct/Balance:
router.post('/stuAcctAdd', StuAccts_Controller.insert);

// Delete Balance:
router.get('/stuAccts/:id', StuAccts_Controller.delete);



module.exports = router;