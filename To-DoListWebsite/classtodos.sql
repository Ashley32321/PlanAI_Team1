/*
------------------------------------------------------------------------------
    Name:	classtodos.sql
    Author:	Preston A. Reuter
    Language:	SQL
    Date:	2025-02-22
    Purpose:	PLACEHOLDER
------------------------------------------------------------------------------
    Change Log
------------------------------------------------------------------------------
    Who		Date		Reason
    Preston		2025-02-22	Original Version of Code
    
------------------------------------------------------------------------------
*/
-- Completely purge any existing database with the same name.
DROP DATABASE IF EXISTS `classtodos`;
-- Create a new, blank schema with the desired name.
CREATE DATABASE `classtodos`;
-- Make the new database the active schema.
USE `classtodos`;

DROP TABLE IF EXISTS `user`;
CREATE TABLE user
(
	USER_ID CHAR(2) PRIMARY KEY,
	username varchar(20) NOT NULL,
	email varchar(20) NOT NULL,
	password varchar(20) not null,
	CELL_PHONE varchar(12)
);

DROP TABLE IF EXISTS `tasks`;
create table tasks
(
	TASK_NUM char(5) primary key,
	TASK_NAME varchar(20) not null,
	TASK_DATE date,
	TASK_TIME time,
	USER_ID char(3) 
);