/*
------------------------------------------------------------------------------
    Name:	classtodos.sql
    Author:	Preston A. Reuter
    Language:	SQL
    Date:	2025-02-22
    Purpose: PlanAI Database
------------------------------------------------------------------------------
    Change Log
------------------------------------------------------------------------------
    Who		Date		Reason
    Preston	2025-02-22	Original Version of Code
    
------------------------------------------------------------------------------
*/
-- Completely purge any existing database with the same name.
DROP DATABASE IF EXISTS `classtodos`;

-- Create a new, blank schema with the desired name.
CREATE DATABASE `classtodos`;

-- Make the new database the active schema.
USE `classtodos`;

DROP TABLE IF EXISTS `tasks`;

CREATE TABLE tasks (
    task_num CHAR(5) PRIMARY KEY,  -- Unique 5-character task number
    task_name VARCHAR(100) NOT NULL,        
    task_date DATE NOT NULL,                         
    task_time TIME NOT NULL,                         
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

-- Create a trigger to auto-generate a task_num (5-character random ID)
DROP TRIGGER IF EXISTS before_insert_tasks;
DELIMITER //
CREATE TRIGGER before_insert_tasks 
BEFORE INSERT ON tasks
FOR EACH ROW
BEGIN
    SET NEW.task_num = SUBSTRING(UUID(), 1, 5);
END;
//
DELIMITER ;
