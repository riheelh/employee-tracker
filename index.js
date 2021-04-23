const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const eAllTable = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id;
`
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
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', "Add Employee", "Remove Employee", "Update Manager", "Roles", "Exit"],
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
                    addEmployee();
                    break;
                case 'Remove Employee':
                    console.log(data);
                    break;
                case 'Update Manager':
                    console.log(data);
                    break;
                case 'Roles':
                    Roles();
                    break;
                case 'Exit':
                    console.log('GoodBye!')
                    connection.end();
                    break;
            }
        })
        .catch((error) => console.log(error));
};

// ---- Employee ----
const viewAllEmployee = () => {
    connection.query(eAllTable, (err, data) => {
        if (err) throw err;
        console.table(data);
        connection.end();
        start();
    })
};

const addEmployee = () => {
    connection.query(`SELECT * FROM role`, (err, results) => {
        if (err) throw err;
        inquirer
        .prompt([{
                type: "input",
                name: "first_name",
                message: "Please enter first name ?"
            },
            {
                type: "input",
                name: "last_name",
                message: "Please enter last name ?"
            },
            {
                type: 'list',
                name: 'roleChoice',
                choices() {
                    const Array = [];
                    results.forEach(({
                        title
                    }) => {
                        Array.push(title);
                    });
                    return Array;
                },
                message: 'Select employee role ?',
            },
            {
                type: 'input',
                name: 'managerChoice',
                message: 'Select employee manager ?',
            },
        ])
        .then((data) => {
            console.log(data.roleChoice)
            let chosen;
            results.forEach((item) => {
                if (item.title === data.roleChoice) {
                    chosen = item
                    console.log(chosen)
                    connection.query('INSERT INTO employee SET ?', {
                            first_name: data.first_name,
                            last_name: data.last_name,
                            role_id: chosen.id,
                            // manager_id: data.manager_id
                        },
                        (err) => {
                            if (err) throw err;
                            console.log('new Employee Added successfully.')
                            connection.end();
                            start()
                        }
                    );
                }
            })
        })
        .catch((err) => console.error(err));
    })
}

// ---- Roles ----
const Roles = () => {
    inquirer
    .prompt({
        name: 'select',
        type: 'list',
        message: 'Choose the Roles action ?',
        choices: ['View Roles', 'Add Roles', 'Update Roles', 'Back to main menu'],
    })
    .then((data) => {
        switch (data.select) {
            case 'View Roles':
                viewRoles();
                break;
            case 'Add Roles':
                addRoles();
                break;
            case 'Update Roles':
                updateRoles();
                break;
            case 'Back to main menu':
                start();
                break;
        }
    })
};

const viewRoles = () => {
    connection.query(`SELECT * FROM role`, (err, results) => {
        if (err) throw err;
        console.table(results);
        // connection.end();
        Roles();
    })
};

const addRoles = () => {
    connection.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;
        inquirer
        .prompt([{
                type: "input",
                name: "title",
                message: "Please enter role title ?"
            },
            {
                type: "input",
                name: "salary",
                message: "Please enter role monthly salary ?"
            },
            {
                type: "list",
                name: "dept",
                choices() {
                    const deptArray = [];
                    results.forEach(({name})=> {
                        deptArray.push(name)
                    })
                    return deptArray;
                },
                message: "Please enter department id ?"
            },
        ])
        .then((data) => { 
            let chosen;
            results.forEach((item) => {
                if (item.name === data.dept) {
                    chosen = item
                    connection.query(`INSERT INTO role SET ? `, {
                        title: data.title,
                        salary: data.salary,
                        department_id: chosen.id,
                    }, (err, res) => {
                        if (err) throw err;
                        console.log('Role added successfully')
                    })
                }
            })
        })         
    })
}








connection.connect((err) => {
    if (err) throw err;
    start();
});