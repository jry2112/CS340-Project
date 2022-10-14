-- phpMyAdmin SQL Dump
-- version 5.1.1-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 06, 2021 at 10:20 PM
-- Server version: 10.4.21-MariaDB-log
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_younjada`
--

-- --------------------------------------------------------

--
-- Table structure for table `Addresses`
--

CREATE TABLE `Addresses` (
  `Address_ID` int(11) NOT NULL,
  `Street` varchar(255) NOT NULL,
  `City` varchar(255) NOT NULL,
  `State` varchar(2) NOT NULL,
  `Zip` varchar(9) DEFAULT NULL,
  `Country` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Addresses`
--

INSERT INTO `Addresses` (`Address_ID`, `Street`, `City`, `State`, `Zip`, `Country`) VALUES
(7, '862 5th Ave', 'NY', 'NY', '12345', 'USA'),
(8, '78 Court Street', 'NY', 'NY', '12345', 'USA'),
(9, '123 Fairytale Lane', 'Magicland', 'FF', '34231', 'Magic Place'),
(10, '172 Spring Street', 'Columbus', 'OH', '45288', 'USA');

-- --------------------------------------------------------

--
-- Table structure for table `Courses`
--

CREATE TABLE `Courses` (
  `Course_ID` int(4) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Cur_Offer` tinyint(4) NOT NULL,
  `Price` decimal(9,2) NOT NULL,
  `Instructor` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Courses`
--

INSERT INTO `Courses` (`Course_ID`, `Name`, `Cur_Offer`, `Price`, `Instructor`) VALUES
(1001, 'Intro to Tech I', 1, '4000.00', 'Harry Miller'),
(1002, 'Intro to Tech II', 1, '5000.00', 'Stephanie Gomez'),
(1003, 'Intro to Tech III', 0, '6000.00', 'Alex Watkins'),
(4002, 'Advanced Tech', 1, '5000.00', 'Jason Wells');

-- --------------------------------------------------------

--
-- Table structure for table `CurEnrolls`
--

CREATE TABLE `CurEnrolls` (
  `Student_ID` int(11) NOT NULL,
  `Course_ID` int(4) NOT NULL,
  `Date` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `CurEnrolls`
--

INSERT INTO `CurEnrolls` (`Student_ID`, `Course_ID`, `Date`) VALUES
(100135, 1001, '2021-12-05'),
(100136, 1001, '2021-12-05'),
(100136, 1002, '2021-12-05'),
(100137, 1002, '2021-12-05'),
(100138, 1001, '2021-12-05');

-- --------------------------------------------------------

--
-- Table structure for table `diagnostic`
--

CREATE TABLE `diagnostic` (
  `id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `diagnostic`
--

INSERT INTO `diagnostic` (`id`, `text`) VALUES
(1, 'MySQL is working!');

-- --------------------------------------------------------

--
-- Table structure for table `Payments`
--

CREATE TABLE `Payments` (
  `Pay_ID` int(11) NOT NULL,
  `Student_ID` int(11) NOT NULL,
  `Amount` decimal(9,2) NOT NULL,
  `Method` varchar(255) NOT NULL,
  `Date` date NOT NULL,
  `Course_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Payments`
--

INSERT INTO `Payments` (`Pay_ID`, `Student_ID`, `Amount`, `Method`, `Date`, `Course_ID`) VALUES
(5, 100135, '200.00', 'Cash', '2021-12-05', 1001),
(11, 100136, '70.00', 'Cash', '2021-11-01', 1002),
(12, 100136, '500.00', 'ACH', '2021-10-05', 1002);

-- --------------------------------------------------------

--
-- Table structure for table `StuAccts`
--

CREATE TABLE `StuAccts` (
  `Student_ID` int(11) NOT NULL,
  `Balance` decimal(9,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `StuAccts`
--

INSERT INTO `StuAccts` (`Student_ID`, `Balance`) VALUES
(100135, '3800.00'),
(100136, '4930.00'),
(100137, '1000.00');

-- --------------------------------------------------------

--
-- Table structure for table `Students`
--

CREATE TABLE `Students` (
  `Student_ID` int(11) NOT NULL,
  `First_Name` varchar(255) NOT NULL,
  `Last_Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Phone` varchar(10) NOT NULL,
  `Address_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Students`
--

INSERT INTO `Students` (`Student_ID`, `First_Name`, `Last_Name`, `Email`, `Phone`, `Address_ID`) VALUES
(100135, 'Pup', 'Boardman', 'puppyboy32@gmail.com', '1231231454', 7),
(100136, 'Soko', 'Glam', 'sokoglam@gmail.com', '8004544654', 8),
(100137, 'Peter', 'Piper', 'peppers@gmail.com', '5654342212', 9),
(100138, 'Lisa', 'Major', 'majorlisa@midcoast.net', '4856962253', 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Addresses`
--
ALTER TABLE `Addresses`
  ADD PRIMARY KEY (`Address_ID`),
  ADD UNIQUE KEY `address_data` (`Street`,`City`,`State`);

--
-- Indexes for table `Courses`
--
ALTER TABLE `Courses`
  ADD PRIMARY KEY (`Course_ID`);

--
-- Indexes for table `CurEnrolls`
--
ALTER TABLE `CurEnrolls`
  ADD PRIMARY KEY (`Student_ID`,`Course_ID`,`Date`),
  ADD KEY `Enroll_To_Courses` (`Course_ID`);

--
-- Indexes for table `diagnostic`
--
ALTER TABLE `diagnostic`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Payments`
--
ALTER TABLE `Payments`
  ADD PRIMARY KEY (`Pay_ID`),
  ADD KEY `Pay_To_StuID` (`Student_ID`),
  ADD KEY `Pay_To_Courses` (`Course_ID`);

--
-- Indexes for table `StuAccts`
--
ALTER TABLE `StuAccts`
  ADD PRIMARY KEY (`Student_ID`);

--
-- Indexes for table `Students`
--
ALTER TABLE `Students`
  ADD PRIMARY KEY (`Student_ID`),
  ADD UNIQUE KEY `stu_data` (`First_Name`,`Last_Name`,`Phone`),
  ADD KEY `Students_To_Addresses` (`Address_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Addresses`
--
ALTER TABLE `Addresses`
  MODIFY `Address_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Courses`
--
ALTER TABLE `Courses`
  MODIFY `Course_ID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4004;

--
-- AUTO_INCREMENT for table `diagnostic`
--
ALTER TABLE `diagnostic`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Payments`
--
ALTER TABLE `Payments`
  MODIFY `Pay_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `Students`
--
ALTER TABLE `Students`
  MODIFY `Student_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100139;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `CurEnrolls`
--
ALTER TABLE `CurEnrolls`
  ADD CONSTRAINT `Enroll_To_Courses` FOREIGN KEY (`Course_ID`) REFERENCES `Courses` (`Course_ID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Enroll_To_Students` FOREIGN KEY (`Student_ID`) REFERENCES `Students` (`Student_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
