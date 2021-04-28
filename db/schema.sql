DROP DATABASE IF EXISTS trackingDB;
CREATE database trackingDB;
USE trackingDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);


-- View All Employee
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id;


-- View Employee by Department
SELECT employee.id, employee.first_name, employee.last_name, name AS department, title
FROM employee LEFT JOIN role ON employee.role_id = role.id 
LEFT JOIN department ON role.department_id = department.id
WHERE name = 'Department Name';


-- View Employee by Manager
SELECT employee.id, employee.first_name, employee.last_name, name AS department, title
FROM employee LEFT JOIN role ON employee.role_id = role.id 
LEFT JOIN department ON role.department_id = department.id
WHERE employee.manager_id = id;

