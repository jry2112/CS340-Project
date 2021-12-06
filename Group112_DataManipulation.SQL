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
SELECT * FROM `Courses`;
-- Searching Courses --
SELECT * FROM `Courses` WHERE `Course_ID` = ?Course_ID_Input;
SELECT * FROM `Courses` WHERE `Course_Name` = ?Course_Name_Input;


-- Filter Courses by Searching
SELECT * FROM `Courses` WHERE `Course_ID` = ?Course_ID_Input;
SELECT * FROM `Courses` WHERE `Course_Name` = ?Course_Name_Input;
SELECT * FROM `Courses` WHERE `Course_ID` LIKE '%?Course_ID_Input%';
SELECT * FROM `Courses` WHERE `Course_Name` LIKE '%?Course_Name_Input%';
SELECT * FROM `Courses` WHERE `Instructor` LIKE '%?Instructor_Input%';

-- Insert a New Course:
INSERT INTO `Courses` (`Course_ID`, `Name`, `Cur_Offer`, `Price`, `Instructor`) VALUES (?Course_ID_Input, ?Name_Input, ?Cur_Offer_Input, ?Price_Input, ?Instructor_Input);

-- Update a Course:
UPDATE `Courses` SET `Course_ID` = ?Course_ID_Input, `Name` = ?Name_Input,`Cur_Offer` = ?Cur_Offer_Input,`Price`= ?Price_Input,`Instructor`= ?Instructor_Input WHERE `Course_ID` = ?Course_ID_Input;

-- Delete a Course
DELETE FROM `Courses`
WHERE `Course_ID` = ?Course_ID_Input;

-- Filter Courses with Exact Input --
SELECT * FROM `Courses` WHERE `Course_ID` = ?Course_ID_Input;
SELECT * FROM `Courses` WHERE `Course_Name` = ?Course_Name_Input;
SELECT * FROM `Courses` Where `Instructor` = ?Instructor_Input;

------------------------------------------------------------------------------
-- DM Queries for StuAccts

-- Get all StuAccts:  
SELECT * FROM `StuAccts`;

-- Add a new Student and Balance: 

INSERT INTO `StuAccts` (`Student_ID`, `Balance`) VALUES
(?Student_ID_Input, '?Balance_Input');

-- Update a Student’s Balance:
UPDATE `StuAccts` SET `Balance` = ?Balance_Input WHERE `Student_ID` = ?Student_ID_Input

-- Delete a Student and their Balance: 
DELETE FROM `StuAccts` WHERE `Student_ID` = ?Student_ID_Input

-- Search or filter for a particular Student_ID: 
SELECT * FROM `StuAccts` WHERE `Student_ID` = ?Student_ID_Input;

-- Search or filter for a particular Balance: 
SELECT * FROM `StuAccts` WHERE `Balance` = ?Balance_Input;

-- Search or filter for a Balance greater than or equal to some amount: 
SELECT * FROM `StuAccts` WHERE `Balance` >= ?Balance_Input;

-- Search or filter for a Balance less than or equal to some amount: 
SELECT * FROM `StuAccts` WHERE `Balance` <= ?Balance_Input;

----------------------------------------------------------------------------------
-- DM Queries for Payments
-- Show Payments Table: 
SELECT * FROM `Payments`;

-- Insert a new row into Payments: 
INSERT INTO `Payments` (`Pay_ID`, `Student_ID`, `Amount`, `Method`, `Date`, `Course_ID`) VALUES
(?Pay_ID_Input, ?Student_ID_Input, ?Amount_Input, ?Method_Input, ?Date_Input, ?Course_ID_Input);

-- Update a particular row in Payments: 
UPDATE `Payments` SET `Pay_ID` = ?Pay_ID_Input, `Student_ID` = ?Student_ID_Input, `Amount` = ?Amount_Input,`Method` = ?Method_Input,`Date`= ?Date_Input,`Course_ID`= ?Course_Input WHERE `Student_ID` = ?Student_ID_Input;

-- Delete a particular row in Payments: 
DELETE FROM `Payments` WHERE `Pay_ID` = ?Pay_ID_Input;

-- Search for ID: 
SELECT * FROM `Payments` WHERE `Student_ID` = ?Student_ID_Input;

-- Search or filter for a particular Amount: 
SELECT * FROM `Payments` WHERE `Amount` = ?Amount_Input;

-- Search or filter for an Amount greater than or equal to some amount: 
SELECT * FROM `Payments` WHERE `Amount` >= ?Amount_Input;

-- Search or filter for an Amount less than or equal to some amount: 
SELECT * FROM `Payments` WHERE `Amount` <= ?Amount_Input;

-- Search or filter for a type of payment Method: 
SELECT * FROM `Payments` WHERE `Method` = ?Method_Input;

-- Search or filter for a Course ID:
SELECT * FROM `Payments` WHERE `Course_ID` = ?Course_ID_input;

--------------------------------------------------------------------------------------

-- DM Queries for Addresses - (incorporated into Students)
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
