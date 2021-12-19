USE EmployeeTracker;
SET FOREIGN_KEY_CHECKS = 1;
CREATE TABLE Department (    
    id INT (15) PRIMARY KEY,    
    NAME VARCHAR(30)
);
CREATE TABLE Role (
    id INT (15) PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT (15),
    FOREIGN KEY (department_id) REFERENCES Department (id)
);
CREATE TABLE Employee (
    id INT (15) PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT (15),
    manager_id INT (15),
    FOREIGN KEY (role_id) REFERENCES Role (id),
    FOREIGN KEY (manager_id) REFERENCES Employee (id)
);