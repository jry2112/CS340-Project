const { application } = require("express");
const { update } = require("../../app/controllers/enrollment.controller");

const updateButton = document.getElementById('updateStuButton');

function updateStudent (studentID) {
    event.preventDefault
    let studentData = document.getElementById("updateStudentForm");
    let formData = new FormData(studentData);

    // Populate data object with key-value pairs
    data = Object.fromEntries(formData.entries());
    data = JSON.stringify(data);
    // Perform the AJAX request to update this student
    const url = '/students/' + studentID;
    console.log(data);
    
    

    // Perform AJAX request to update student
    let xmlhttp = new XMLHttpRequest();
    
    if (confirm('Are you sure you want to update this student?') == true) {
        
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.onreadystatechange == 4 && xmlhttp.status == 200) {
                // Request completed
            }
        }
        xmlhttp.open("PUT", url, true);
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send(data);
    }

    };
function deleteStudent(studentID) {

    // Perform the AJAX request to delete this student
    var url = '/students/' + studentID;
    console.log(url);
    var parameters = 'delete=true';
    var xmlhttp = new XMLHttpRequest();

    if (confirm('Are you sure you want to delete this student?') == true) {
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.onreadystatechange == 4 && xmlhttp.status == 200) {
                // Request completed
            }
        }
        xmlhttp.open("DELETE", url, true);
        xmlhttp.send();
    }
}


        

