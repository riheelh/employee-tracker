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

//start function
const start = () => {
    inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do ?',
            choices: ['Employees', "Roles", "Departments", "Exit"],
        })
    .then((data) => {
        switch (data.action) {
            case 'Employees':
                Employee();
                break;
            case 'Roles':
                Roles();
                break;
            case 'Departments':
                Depts();
                break;
            case 'Exit':
                console.log('GoodBye!')
                connection.end();
                break;
        }
    })
    .catch((error) => console.log(error));
};


// ------- Employee functions -------
const Employee = () => {
    inquirer
    .prompt({
        name: 'select',
        type: 'list',
        message: 'Choose the Roles action ?',
        choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', "Remove Employee", "Update Employee Role", "Update Employee Manager", 'Back to main menu'],
    })
    .then((data) => {
        switch (data.select) {
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
                removeEmployee();
                break;
            case 'Update Employee Role':
                console.log(data);
                break;
            case 'Update Employee Manager':
                console.log(data);
                break;
            case 'Back to main menu':
                start();
                break;
        };
    })
};

const viewAllEmployee = () => {
    connection.query(eAllTable, (err, data) => {
        if (err) throw err;
        console.table(data);
        Employee();
    });
};

const addEmployee = () => {
    connection.query(`SELECT * FROM role`, (err, results) => {
        if (err) throw err;
        inquirer.prompt([{
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
                    results.forEach(({title}) => {
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
            let chosen;
            results.forEach((item) => {
                if (item.title === data.roleChoice) {
                    chosen = item;
                    connection.query('INSERT INTO employee SET ?', {
                            first_name: data.first_name,
                            last_name: data.last_name,
                            role_id: chosen.id,
                            // manager_id: data.manager_id
                        },(err) => {
                            if (err) throw err;
                            console.log('new Employee Added successfully.');
                            Employee();
                        }
                    );
                };
            })
        })
        .catch((err) => console.error(err));
    })
}

const removeEmployee = () => {
    console.log('')
    connection.query(`SELECT * FROM employee`, (err, res) => {
        if(err) throw err;
        console.table(res);
        inquirer.prompt(
            {
                type: "input",
                name: "id",
                message: "Enter employee id to remove ?"
            }
        )
        .then((data) => {
            connection.query(`DELETE FROM employee WHERE ?`, {id: data.id}, (err, res) => {
                if(err) throw err;
                console.log('Employee deleted successfully');
                Employee();
            })
        })
    })
}


// ------- Roles functions -------
const Roles = () => {
    inquirer.prompt(
        {
        name: 'select',
        type: 'list',
        message: 'Choose the Roles action ?',
        choices: ['View Roles', 'Add Roles', 'Remove Roles','Back to main menu'],
    })
    .then((data) => {
        switch (data.select) {
            case 'View Roles':
                viewRoles();
                break;
            case 'Add Roles':
                addRoles();
                break;
            case 'Remove Roles':
                removeRoles();
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
        Roles();
    })
};

const addRoles = () => {
    connection.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;
        inquirer.prompt([{
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
                    chosen = item;
                    connection.query(`INSERT INTO role SET ? `, {
                        title: data.title,
                        salary: data.salary,
                        department_id: chosen.id,
                    }, (err, res) => {
                        if (err) throw err;
                        console.log('Role added successfully');
                        Roles();
                    })
                }
            });
        })         
    });
};

const removeRoles = () => {
    console.log('');
    connection.query(`SELECT * FROM role`, (err, results) => {
        if(err) throw err;
        inquirer.prompt([ 
            {
                type: "list",
                name: "select",
                choices() {
                    const Array = [];
                    results.forEach(({title})=> {
                        Array.push(title);
                    })
                    return Array;
                },
                message: "select the role to remove ?"
            },
            {
                name: "confirmRemove",
                type: "input",
                message: "Are you sure you want to remove (y/n)?",
                validate: function confirmRemoval(ans){
                    if(ans !== '' && ans === 'y' || ans !== '' && ans === 'n'){
                        return true;
                    } 
                }
            },
        ])
        .then((data) => {
            console.log(data);
            if (data.confirmRemove === 'y') {
                connection.query(`DELETE FROM role WHERE ?`, {title: data.select}, (err, res) => {
                    if(err) throw err;
                    console.log('Role deleted successfully');
                    Roles();
                })
            } else {
                console.log('no action taken');
                Roles();
            }
        })
    });
};

// ------- Departments functions -------
const Depts = () => {
    inquirer.prompt({
        name: 'select',
        type: 'list',
        message: 'Choose the department action ?',
        choices: ['View Departments', 'Add Departments', 'Remove Departments','Back to main menu'],
    })
    .then((data) => {
        switch (data.select) {
            case 'View Departments':
                viewDepts();
                break;
            case 'Add Departments':
                addDepts();
                break;
            case 'Remove Departments':
                removeDepts();
                break;    
            case 'Back to main menu':
                start();
                break;
        }
    })
};

const viewDepts = () => {
    connection.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;
        console.table(results);
        Depts();
    })
};

const addDepts = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Please enter new department name ?"
        }])
    .then((data) => { 
        connection.query(`INSERT INTO department SET ? `, { name: data.name}, (err, res) => {
            if (err) throw err;
            console.log('Department added successfully');
            Depts();
        })
    })         
}

const removeDepts = () => {
    connection.query(`SELECT * FROM department`, (err, results) => {
        if(err) throw err;
        inquirer.prompt([ 
            {
                type: "list",
                name: "select",
                choices() {
                    const Array = [];
                    results.forEach(({name})=> {
                        Array.push(name);
                    })
                    return Array;
                },
                message: "select the department to remove ?"
            },
            {
                name: "confirmRemove",
                type: "input",
                message: "Are you sure you want to remove (y/n)?",
                validate: function confirmRemoval(ans){
                    if(ans !== '' && ans === 'y' || ans !== '' && ans === 'n'){
                        return true;
                    } 
                }
            },
        ])
        .then((data) => {
            console.log(data);
            if (data.confirmRemove === 'y') {
                connection.query(`DELETE FROM department WHERE ?`, {name: data.select}, (err, res) => {
                    if(err) throw err;
                    console.log('Department deleted successfully');
                    Depts();
                })
            } else {
                console.log('no action taken');
                Depts();
            }
        })
    });
};


// start the app
connection.connect((err) => {
    if (err) throw err;
    start();
});