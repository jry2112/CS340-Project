-- Omar Garza Cantu
-- Jada Young
-- Group 112

-- Tech School Management System
-- -- Note: ? denotes variable value from backend programming language.

-- DM Queries for Students

-- Insert a Student and Address
INSERT INTO `Students` (`Student_ID`, `First_Name`, `Last_Name`, `Email`, `Phone`) VALUES
(?Student_ID_Input, ?First_Name_Input, ?Last_Name_Input, ?Email_Input, ?Phone_Input) ON DUPLICATE KEY UPDATE Student_ID = Student_ID;
SELECT Student_ID FROM Students WHERE First_Name = ?First_Name_Input AND Last_Name = ?Last_Name_Input AND Email = ?Email_Input AND Phone = ?Phone_Input;
INSERT INTO Addresses (Address_ID, Street, City, State, Zip, Country) VALUES (?Address_ID, ?Street_Input, ?City_Input, ?State_Input, ?Zip_Input, ?Country_Input) ON DUPLICATE KEY UPDATE Address_ID = Address_ID;
SELECT Address_ID FROM Addresses WHERE Street = ?Street_Input AND City = ?City_Input AND State = ?State_Input AND Zip = ?Zip_Input AND Country = ?Country_Input;
UPDATE Students SET Address_ID = ?Address_ID_Input WHERE Students.Student_ID = ?Student_ID_Input;

-- Update a Student and Address
SELECT Address_ID from Students WHERE Student_ID = ?Student_ID_Input;
UPDATE `Addresses` SET `Street`= ?Street_Input,`City`= ?City_Input,`State`= ?State_Input,`Zip`= ?Zip_Input,`Country`= ?Country
    WHERE `Address_ID` = ?Address_ID_Input;
UPDATE `Students` SET `First_Name` = ?First_Name_Input, `Last_Name` = ?Last_Name_Input, `Email` = ?Email_Input, `Phone` = ?Phone_Input WHERE `Student_ID` = ?Student_ID_Input;

-- Delete a Student and Address
DELETE FROM Students WHERE Student_ID = ?Student_ID_Input;
SELECT Address_ID FROM Students WHERE Student_ID = ?Student_ID_Input;
DELETE FROM Addresses WHERE Address_ID = ?Address_ID_Input
    AND NOT EXISTS(SELECT * FROM Students WHERE Address_ID = ?Address_ID_Input AND Student_ID != ?Student_ID_Input);

-- Select All Students and Addresses
SELECT * FROM Students LEFT JOIN Addresses ON Students.Address_ID = Addresses.Address_ID ORDER BY Student_ID asc;

-- Select a Student By ID
SELECT * FROM Students LEFT JOIN Addresses ON Students.Address_ID = Addresses.Address_ID WHERE Student_ID LIKE ?Student_ID_Input;
SELECT Courses.Course_ID, Courses.Name, Courses.Instructor
    FROM Courses
    JOIN CurEnrolls ON Courses.Course_ID = CurEnrolls.Course_ID
        JOIN Students ON CurEnrolls.Student_ID = Students.Student_ID
        WHERE Students.Student_ID = ?Student_ID_Input;

--Select a Student by Name
SELECT * FROM `Students`
WHERE `First_Name` LIKE '%?Name_Input%'OR
`Last_Name` LIKE '%Name_Input%';

-- Select a Student by Email
SELECT * FROM `Students`
WHERE `Email` LIKE '%?Email_Input%';

-- Select a Student by Phone
SELECT * FROM `Students`
WHERE `Phone` LIKE '%?Phone_Input%';

-------------------------------------------------------------------------------
-- DM Queries for Course

-- View All Courses:
SELECT * FROM Courses ORDER BY Course_ID asc;

-- View One Course:
SELECT * FROM Courses WHERE Course_ID = ?Course_ID;

-- Searching Courses --
SELECT * FROM Courses WHERE Course_ID LIKE ?Course_ID_Input AND Name LIKE ?Name_Input AND Cur_Offer_ LIKE ?Cur_Offer_Input AND Instructor LIKE ?Instructor_Input;

-- Insert a New Course:
INSERT INTO `Courses` (`Course_ID`, `Name`, `Cur_Offer`, `Price`, `Instructor`) VALUES (?Course_ID_Input, ?Name_Input, ?Cur_Offer_Input, ?Price_Input, ?Instructor_Input);

-- Update a Course:
UPDATE `Courses` SET `Course_ID` = ?Course_ID_Input, `Name` = ?Name_Input,`Cur_Offer` = ?Cur_Offer_Input,`Price`= ?Price_Input,`Instructor`= ?Instructor_Input WHERE `Course_ID` = ?Course_ID_Input;

-- Delete a Course
DELETE FROM `Courses`
WHERE `Course_ID` = ?Course_ID_Input;

-- Getting the Courses a Student is currently enrolled in:
SELECT Courses.Course_ID, Courses.Name, Courses.Instructor FROM Courses \
    JOIN CurEnrolls ON Courses.Course_ID = CurEnrolls.Course_ID\
    JOIN Students ON CurEnrolls.Student_ID = Students.Student_ID\
    WHERE Students.Student_ID = ?Student_ID_Input

------------------------------------------------------------------------------
-- DM Queries for StuAccts

-- View StuAccts:  
SELECT * FROM StuAccts JOIN Students USING (Student_ID) ORDER BY Student_ID asc;

-- View a single Student Acct:
SELECT Balance FROM StuAccts WHERE Student_ID = ?Student_ID_Input

-- View Student_IDs without Balances:
SELECT * FROM Students WHERE Student_ID NOT IN (SELECT Student_ID FROM StuAccts;

-- General Search in StuAccts:
SELECT * FROM (StuAccts JOIN Students USING (Student_ID))
WHERE Student_ID LIKE ?Student_ID_Input AND First_Name LIKE ?First_Name_Input AND Last_Name LIKE ?Last_Name_Input AND Balance LIKE ?Balance_Input;

-- Insert Balance: 
INSERT INTO `StuAccts` (`Student_ID`, `Balance`) VALUES
(?Student_ID_Input, '?Balance_Input');

-- Update Balance:
UPDATE StuAccts SET Balance = ?Balance_Input 
WHERE Student_ID = ?Student_ID_Input;
----------------------------------------------------------------------------------
-- DM Queries for Payments
-- View Payments Table: 
SELECT * FROM (Payments JOIN Students USING (Student_ID))

--View a single Payment:
SELECT * FROM Payments JOIN Courses USING (Course_ID) JOIN Students USING (Student_ID) WHERE Pay_ID = ?Pay_ID

-- Search for Payment Details:
SELECT * FROM (Payments JOIN Students USING (Student_ID))
WHERE Pay_ID LIKE ? AND Student_ID LIKE ? AND First_Name LIKE ? AND Last_Name LIKE ? AND Amount LIKE ? AND Method LIKE ? AND Date LIKE ? AND Course_ID LIKE ?

-- Insert a new Payment: 
INSERT INTO Payments SET Student_ID = ?Student_ID_Input, Amount = ?Amount_Input, Method = ?Method_Input, Date = ?Date_Input, Course_ID = ?Course_ID_Input

-- Update a particular row in Payments: 
UPDATE `Payments` SET `Pay_ID` = ?Pay_ID_Input, `Student_ID` = ?Student_ID_Input, `Amount` = ?Amount_Input,`Method` = ?Method_Input,`Date`= ?Date_Input,`Course_ID`= ?Course_Input WHERE `Student_ID` = ?Student_ID_Input;

-- Delete a particular row in Payments: 
DELETE FROM `Payments` WHERE `Pay_ID` = ?Pay_ID_Input;

--------------------------------------------------------------------------------------

-- DM Queries for Addresses
-- Get all addresses from  Addresses Table: 
SELECT * FROM `Addresses`;

-- Add a new address to the Addresses Table:
INSERT INTO `Addresses` (
`Address_ID`, `Street`, `City`, `State`, `Zip`, `Country`) 
VALUES (
?Address_ID_Input, ?Street_Input, ?City_Input, ?State_Input, ?Zip_Input, ?Country_Input
);

-- Update an address in the Addresses Table:
UPDATE `Addresses` SET `Address_ID`= ?Address_ID_Input,`Street`= ?Street_Input,`City`= ?City_Input,`State`= ?State_Input,`Zip`= ?Zip_Input,`Country`= ?Country WHERE `Address_ID` = 1;

-- Delete an address in the Addresses Table:
DELETE FROM `Addresses` WHERE `Address_ID` = ?Address_ID_Input

-- Search or filter for a particular Address_ID: 
SELECT * FROM `Addresses` WHERE `Address_ID` = ?Address_ID_Input

-- Search or filter the Street address which may contain a user provided string: 
SELECT * FROM `Addresses` WHERE `Street` LIKE “%?Street_Input%”

-- Search or filter the City which may contain a user provided string: 
SELECT * FROM `Addresses` WHERE `City` LIKE “%?City_Input%”


-- Search or filter the State which may contain a user provided string: 
SELECT * FROM `Addresses` WHERE `State` LIKE “%?State_Input%”

-- Search or filter the Zip which may contain a user provided number: 
SELECT * FROM `Addresses` WHERE `Zip` LIKE “%?Zip_Input%”

-- Search or filter the Country which may contain a user provided string: 
SELECT * FROM `Addresses` WHERE `Country` LIKE “%?Country_Input%”


---------------------------------------------------------------------------------------
-- DM Queries for CurEnrolls

-- View Current Enrollment
SELECT Students.Student_ID, Students.First_Name, Students.Last_Name, Courses.Course_ID, Courses.Name, Courses.Instructor, CurEnrolls.Date \
    FROM Students JOIN CurEnrolls ON Students.Student_ID = CurEnrolls.Student_ID\
     JOIN Courses ON CurEnrolls.Course_ID = Courses.Course_ID;;
-- Creating an Enrollment
-- View Enrollment Form options inputs
SELECT Student_ID FROM Students WHERE 1;
SELECT Course_ID FROM Courses WHERE Cur_Offer = 1;
-- Validate then Enroll the Student
SELECT Cur_Offer FROM Courses WHERE Course_ID = ?Course_ID_Input;
INSERT INTO CurEnrolls (Student_ID, Course_ID) VALUES (?Student_ID_Input,?Course_ID_Input) ON DUPLICATE KEY UPDATE Student_ID = Student_ID;

-- Filter by Student ID or Course ID
SELECT Students.Student_ID, Students.First_Name, Students.Last_Name, Courses.Course_ID, Courses.Name, Courses.Instructor, CurEnrolls.Date
    FROM Students JOIN CurEnrolls ON Students.Student_ID = CurEnrolls.Student_ID
     JOIN Courses ON CurEnrolls.Course_ID = Courses.Course_ID
     WHERE Students.Student_ID LIKE ?Student_ID_Input OR Courses.Course_ID LIKE ?Course_ID_Input

-- Filter by Student ID
SELECT * FROM `CurEnrolls` WHERE `Student_ID` = ?Student_ID_Input;
SELECT * FROM `CUrEnrolls` WHERE `Student_ID` LIKE '%?Student_ID_Input%';

-- Filter by Course ID
SELECT * FROM `CurEnrolls` WHERE `Course_ID` = ?Course_ID_Input;
SELECT * FROM `CUrEnrolls` WHERE `Course_ID` LIKE '%?Course_ID_Input%';


-- Delete Current Enrollment
DELETE FROM CurEnrolls WHERE Student_ID = ?Student_ID_Input AND Course_ID = ?Course_ID_Input AND Date = STR_TO_DATE(?Date_Input, '%m%d%Y');

-- Unused
-- Filter by Date
SELECT * FROM `CurEnrolls` WHERE `Date` = ?Date_Input;

-- Date Range
SELECT * FROM `CurEnrolls`
WHERE `Date` BETWEEN ?Start_Date AND ?END_DATE

-- Up to and including some date
SELECT * FROM `CurEnrolls`
WHERE `Date` <= ?Date_Input

-- Update Current Enrollment:
UPDATE `CurEnrolls` SET `Student_ID` = ?Student_ID_Input, `Course_ID` = ?Course_ID_Input,`Date` = ?Date_Input WHERE `Student_ID` = ?Student_ID_Input;