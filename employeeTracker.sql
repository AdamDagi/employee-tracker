create Database EmployeeTracker;
use EmployeeTracker;
create table Department (    
    id INT (15) NOT NULL AUTO_INCREMENT PRIMARY KEY,    
    name VARCHAR(30)
);
create table Role (
    id INT (15) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT (15),
    foreign key (department_id) references Department (id)
);
create table Employee (
    id INT (15) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT (15),
    manager_id INT (15),
    foreign key (role_id) references Role (id),
    foreign key (manager_id) references Employee (id)
);