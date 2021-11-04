const express = require('express');
const ejs = require("ejs");
const app = express();

const port = process.env.PORT || 3000;
// set the view engine to ejs
app.set('view engine', 'ejs');

// bodyparser
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
// use res.render to load up an ejs view file

// index page
app.get('/', (req, res) => {
  res.render('index', {});
});

// students page
app.get('/students', (req, res) =>                                                                                  {
    res.render('students', {})
})
// individual student page

// courses page

// individual course page

// enrollemnts page
app.listen(3000, () => {
    console.log("Server started on port " + port);
});