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

-- Create the 'user' table to store user information
DROP TABLE IF EXISTS `user`;
CREATE TABLE user
(
    user_id CHAR(36) PRIMARY KEY,       
    username VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,    
    password VARCHAR(255) NOT NULL,       
    cell_phone VARCHAR(12),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Create the 'tasks' table to store user tasks
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE tasks
(
    task_num CHAR(5) PRIMARY KEY,          
    task_name VARCHAR(100) NOT NULL,        
    task_date DATE,                         
    task_time TIME,                         
    user_id CHAR(36),                      
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE 
);

-- Commented out extra functionality that can be added later
/*
-- Create the 'categories' table to store task categories (can be expanded later)
DROP TABLE IF EXISTS `categories`;
CREATE TABLE categories
(
    category_id CHAR(36) PRIMARY KEY,      
    category_name VARCHAR(50) NOT NULL,    
    user_id CHAR(36),                      
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Create the 'task_comments' table to store comments on tasks (can be expanded later)
DROP TABLE IF EXISTS `task_comments`;
CREATE TABLE task_comments
(
    comment_id CHAR(36) PRIMARY KEY,       
    task_num CHAR(5),                      
    user_id CHAR(36),                      
    comment_text TEXT NOT NULL,            
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    FOREIGN KEY (task_num) REFERENCES tasks(task_num) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);
*/

