const mysql = require('mysql');
const inquirer = require('inquirer');

// connection to db
// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: '',
//     database: 'trackingDB',
// });

//Init function
const start = () => {
inquirer
    .prompt({
    name: 'EmployeeAction',
    type: 'list',
    message: 'What would you like to do ?',
    choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', "Add Employee", "Remove Employee", "Update Role", "Update Manager", "Exit"],
    })
    .then((data) => {
    
    if (data.EmployeeAction === 'View All Employees') {
        console.log(data);
    } else if (data.EmployeeAction === 'View All Employees By Department') {
        console.log(data);
    } else if (data.EmployeeAction = "Exit") {
        return;
    }
    });
};
  
start()