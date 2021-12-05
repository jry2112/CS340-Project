function deleteEnrollment(stuID, courseID, date) {

    // Perform the AJAX request to delete this enrollment
    var url = '/students/' + stuID + '/courses/' + courseID + '/date/' + date;
    console.log(url);
    var parameters = 'delete=true';
    
    var data = {};
    data.studentID = stuID;
    data.courseID = courseID;
    data.date = date;
    var json = JSON.stringify(data);

    var xmlhttp = new XMLHttpRequest();

    if (confirm('Are you sure you want to unenroll?') == true) {
        
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.onreadystatechange == 4 && xmlhttp.status == 200) {
                // Request completed
                window.location.reload()
            }
        }
        xmlhttp.open("DELETE", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(json);
    }
}