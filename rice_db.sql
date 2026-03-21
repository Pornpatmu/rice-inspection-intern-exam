create database if not exists rice_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;
use rice_db;

CREATE TABLE `Inspection` (
  `inspectionID` VARCHAR(12) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `createDate` DATETIME,
  `standardID` VARCHAR(12),
  `note` TEXT,
  `samplingDate` DATETIME,
  `samplingPoint` ENUM("Front End","Back End","Other"),
  `price` DECIMAL(8,2),
  `imageLink` VARCHAR(255),
  `totalSample` INT,
  `fileUpload` JSON
);

CREATE TABLE `Standard` (
  `standardID` VARCHAR(12) PRIMARY KEY,
  `name` VARCHAR(255),
  `createDate` DATETIME
);

CREATE TABLE `SubStandard` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `standardID` VARCHAR(12),
  `key` VARCHAR(255),
  `name` VARCHAR(255),
  `maxLength` FLOAT,
  `minLength` FLOAT,
  `conditionMax` ENUM("LT","LE","GT","GE"),
  `conditionMin` ENUM("LT","LE","GT","GE"),
  `shape` ENUM("wholegrain","broken")
);

ALTER TABLE `Inspection` ADD FOREIGN KEY (`standardID`) REFERENCES `Standard` (`standardID`);

ALTER TABLE `SubStandard` ADD FOREIGN KEY (`standardID`) REFERENCES `Standard` (`standardID`);
