create database if not exists rice_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;
use rice_db;

CREATE TABLE `Inspection` (
  `inspectionID` VARCHAR(12) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `standardID` VARCHAR(12),
  `note` TEXT,
  `samplingDate` DATETIME,
  `samplingPoint` JSON,
  `price` DECIMAL(8,2),
  `imageLink` VARCHAR(255),
  `totalSample` INT,
  `fileUpload` VARCHAR(255)
);

CREATE TABLE `Standard` (
  `standardID` VARCHAR(12) PRIMARY KEY,
  `name` VARCHAR(255),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  `shape` JSON
);
INSERT INTO `Standard` (`standardID`, `name`) VALUES
('1', 'มาตรฐานข้าวชั้น 1'),
('2', 'มาตรฐานข้าวชั้น 2');

INSERT INTO `SubStandard` (`standardID`, `key`, `name`, `maxLength`, `minLength`, `conditionMax`, `conditionMin`, `shape`) VALUES
('1', 'wholegrain',   'ข้าวเต็มเมล็ด',  99,  7,   'LT', 'GT', '["wholegrain", "broken"]'),
('1', 'broken_rice1', 'ข้าวหักใหญ่',     7,   3.5, 'LT', 'GT', '["wholegrain", "broken"]'),
('1', 'broken_rice2', 'ข้าวหักทั่วไป',   3.5, 0,   'LT', 'GT', '["wholegrain", "broken"]'),
('2', 'wholegrain',   'ข้าวเต็มเมล็ด',  99,  6,   'LT', 'GT', '["wholegrain", "broken"]'),
('2', 'broken_rice1', 'ข้าวหักใหญ่',     6,   4.5, 'LT', 'GT', '["wholegrain", "broken"]'),
('2', 'broken_rice2', 'ข้าวหักทั่วไป',   4.5, 0,   'LT', 'GT', '["wholegrain", "broken"]');

ALTER TABLE `Inspection` ADD FOREIGN KEY (`standardID`) REFERENCES `Standard` (`standardID`);
ALTER TABLE `SubStandard` ADD FOREIGN KEY (`standardID`) REFERENCES `Standard` (`standardID`);

select * from SubStandard
