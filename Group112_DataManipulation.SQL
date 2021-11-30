-- Omar Garza Cantu
-- Jada Young
-- Group 112

-- Tech School Management System
-- -- Note: ? denotes variable value from backend programming language.

-- DM Queries for Students

-- Insert a Student
INSERT INTO `Students` (`Student_ID`, `First_Name`, `Last_Name`, `Email`, `Phone`, `Address_ID`) VALUES
(?Student_ID_Input, ?First_Name_Input, ?Last_Name_Input, ?Email_Input, Phone_Input, Address_ID_Input);

-- Update a Student
UPDATE `Students`
SET `Email` = ?Email_Input, `First_Name` = ?First_Name_Input, `Last_Name` = ?Last_Name_Input, `Phone` = ?Phone_Input, `Address_ID` = ?Address_ID_Input
WHERE `Student_ID` = ?Student_ID_Input;

-- Delete a Student
DELETE FROM `Students`
WHERE `Student_ID` = ?Student_ID_Input;

-- Select All Students
SELECT * FROM `Students`;

-- Select a Student By ID
SELECT * FROM `Students`
WHERE `Student_ID` = ?Student_ID_Input;

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
SELECT * FROM `CurEnrolls`;

-- Filter by Student ID
SELECT * FROM `CurEnrolls` WHERE `Student_ID` = ?Student_ID_Input;
SELECT * FROM `CUrEnrolls` WHERE `Student_ID` LIKE '%?Student_ID_Input%';

-- Filter by Course ID
SELECT * FROM `CurEnrolls` WHERE `Course_ID` = ?Course_ID_Input;
SELECT * FROM `CUrEnrolls` WHERE `Course_ID` LIKE '%?Course_ID_Input%';

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

-- Delete Current Enrollment
DELETE FROM `CurEnrolls`
WHERE `Course_ID` = ?ID_Input
OR `Student_ID` = ?ID_Input;