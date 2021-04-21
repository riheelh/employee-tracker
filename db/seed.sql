INSERT INTO department (name)
VALUES ("Sales"),("Engineering"),("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("SalesPerson", 3000, 1), ('Sales Lead', 5000, 2), ('Accountant', 4000, 3)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1), ("Jane", "Doe", 1)
