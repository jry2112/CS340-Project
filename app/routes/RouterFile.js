const express = require('express');
const router = express.Router();
const Courses_Controller = require('../controllers/courses.controller');
const Payments_Controller = require('../controllers/payments.controller');
const StuAccts_Controller = require('../controllers/stuAccts.controller');
const Index_Controller = require('../controllers/Index_Controller');

//              Index Page:
router.get('/', Index_Controller.home);

//              Courses:
// Display:
router.get('/courses', Courses_Controller.view);
// Search for Course:
router.post('/courses', Courses_Controller.find);
// Add Course Page:
router.get('/addCourse', Courses_Controller.form);
// Insert new Course to Database:
router.post('/addCourse', Courses_Controller.insert);
// Edit Course Page:
router.get('/editCourse/:id', Courses_Controller.edit);
// Update Course in Database:
router.post('/editCourse/:id', Courses_Controller.update);
// Delete Course from Database:
router.get('/courses/:id', Courses_Controller.delete);

//              Payments: 
// Display:
router.get('/payments', Payments_Controller.view);
// Search for Payments: 
router.post('/payments', Payments_Controller.find);
// Add Payment Page with form:
router.get('/paymentAdd', Payments_Controller.form);
// Insert new Payment into Database: 
router.post('/paymentAdd', Payments_Controller.insert);
// Edit Page View:
router.get('/paymentEdit/:id', Payments_Controller.edit);
// Update Database info:
router.post('/paymentEdit/:id', Payments_Controller.update);
// Delete Payment in Database:
router.get('/payments/:id', Payments_Controller.delete);

//              StuAccts:
// Display:
router.get('/stuAccts', StuAccts_Controller.view);
// Search for StuAccts: 
router.post('/stuAccts', StuAccts_Controller.find);
// Add Student Acct Balance:
router.get('/stuAcctAdd', StuAccts_Controller.form);
// Insert new Student Acct/Balance:
router.post('/stuAcctAdd', StuAccts_Controller.insert);


// Exports the routes to Controllers
module.exports = router;

// Citation for the above code: 
// Author: RaddyTheBrand
// Date: 11/08/2021
// Title: User Management System
// Medium: Video
// Web Address: https://www.youtube.com/watch?v=1aXZQcG2Y6I&list=PLYqkl7FT2ig8QES9nkovc04GrnRJAUhEb&index=1&t=2836s&ab_channel=RaddyTheBrand