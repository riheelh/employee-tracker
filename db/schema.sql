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
USE trackingdb;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
CONCAT(manager.first_name, ' ', manager.last_name) AS manager

FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id;



