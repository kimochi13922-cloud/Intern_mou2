-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.0.51b-community-nt-log - MySQL Community Edition (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             12.17.0.7270
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for test
CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `test`;

-- Dumping structure for table test.activity_data
CREATE TABLE IF NOT EXISTS `activity_data` (
  `mouid` int(11) NOT NULL auto_increment,
  `activities_name` int(11) NOT NULL default '0',
  `activities_desc` text NOT NULL,
  `activities_date` text NOT NULL,
  `ownerid` int(11) NOT NULL default '0',
  `staff` int(11) default NULL,
  `activities` text,
  `activities_pic` mediumblob,
  `activities_type` text,
  `activities_service` text,
  `activities_category` text,
  `activities_budget` int(11) default NULL,
  PRIMARY KEY  (`mouid`)
) ENGINE=MyISAM AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table test.activity_images
CREATE TABLE IF NOT EXISTS `activity_images` (
  `id` int(11) NOT NULL auto_increment,
  `activity_id` int(11) NOT NULL,
  `image_data` longblob NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table test.mou_data
CREATE TABLE IF NOT EXISTS `mou_data` (
  `ID` int(10) NOT NULL auto_increment,
  `name` char(100) default NULL,
  `institution` char(50) default NULL,
  `contact` char(50) default NULL,
  `staff` char(50) default NULL,
  `period` tinytext NOT NULL,
  `type` tinytext NOT NULL,
  `status` varchar(50) default NULL,
  `country_check` tinytext,
  `approval_date` tinytext,
  `submit_date` tinytext,
  `analyze_date` tinytext,
  `accept_date` tinytext,
  `edit_date` tinytext,
  `sign_date` tinytext,
  `legal_date` tinytext,
  `manager_date` tinytext,
  `council_date` tinytext,
  `notice_date` tinytext,
  `nation` tinytext,
  `mou_pdf` longblob,
  `notes` text,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
