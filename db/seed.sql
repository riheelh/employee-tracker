INSERT INTO department (name)
VALUES ("Sales"),("Marketing"),("Finance"),("Technology"),("Legal"),("Admin");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Person", 3000, 1), ('Sales Lead', 5000, 1), ('Accountant', 4000, 3), ('FullStack Developer', 5000, 4), ('IT Helpdesk', 4000, 4),
('Legal Advisor', 5000, 5),('Secratry', 4000, 6),('System Engineer', 6000, 4),('Accounting Manager', 8000, 3),('IT Manager', 8000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 7), ("Jane", "Doe", 1, 7), ("Ray", "Fisher", 4, 5), ("Clark", "Kent", 1, 7), ("Bruce", "Wayne", 11), 
("Barry", "Allen", 5, 5), ("Michael", "Scotch", 2), ("Jim", "Halpart", 1 , 7), ("John", "Smith", 6);
