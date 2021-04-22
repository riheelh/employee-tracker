const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// connection to db
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Lab@2021',
    database: 'trackingDB',
});

//Init function
const start = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do ?',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', "Add Employee", "Remove Employee", "Update Role", "Update Manager", "Exit"],
        })
        .then((data) => {
            switch (data.action) {
                case 'View All Employees':
                    viewAllEmployee();
                    break;
                case 'View All Employees By Department':
                    console.log(data);
                    break;
                case 'View All Employees By Manager':
                    console.log(data);
                    break;
                case 'Add Employee':
                    addAllEmployee();
                    break;
                case 'Remove Employee':
                    console.log(data);
                    break;
                case 'Update Role':
                    console.log(data);
                    break;
                case 'Update Manager':
                    console.log(data);
                    break;
                case 'Exit':
                    console.log('Good Bye!')
                    connection.end();
                    break;
            }
        })
        .catch((error) => console.log(error));
};

// Add new employee function
const addAllEmployee = () => {
    inquirer
        .prompt([{
                type: "input",
                name: "first_name",
                message: "Please enter first name"
            },
            {
                type: "input",
                name: "last_name",
                message: "Please enter last name"
            },
            // need to show list of job roles insted of input here
            // add input validation for role_id and manager_id
            {
                type: "input",
                name: "role_id",
                message: "Please enter role id "
            },
            {
                type: "input",
                name: "manager_id",
                message: "Please enter manager id "
            }
        ])
        .then((data) => {
                const query = connection.query(
                    //posibillity of classes use here ?
                    'INSERT INTO employee SET ?', {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        role_id: data.role_id,
                        manager_id: data.manager_id
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('new Employee Added successfully.')
                    });
                    start();
        })
        .catch((error) => console.log(error));
}

// print all employee infomration on terminal
const viewAllEmployee = () => {
    connection.query(
        'SELECT * FROM employee', (err, data) => {
            if(err) throw err;
            console.table(data)
            connection.end();
        }
    )
}




//run the app when mysql connected
connection.connect((err) => {
    if (err) throw err;
    start();
  });