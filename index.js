const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

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

// Choices functions
const deptNames = () => {
    var deptArray = []
    return new Promise ((resolve, reject) => {
        connection.query("SELECT * FROM department", (err, results) => {
            if(err) throw err
            results.forEach((item) => {
                deptArray.push(item)
            })
            resolve (deptArray)
        })
    })
};

const roleNames = () => {
    var roleArray = []
    return new Promise ((resolve, reject) => {
        connection.query("SELECT * FROM role", (err, results) => {
            if(err) throw err
            results.forEach((item) => {
                roleArray.push(item)
            })
            resolve (roleArray)
        })
    })
};






const viewTest = async () => {
    const deptChoices = []
    const deptArr = await deptNames()
    deptArr.map(({name}) => {deptChoices.push(name)})

    // const roleChoices = []
    // const roletArr = await roleNames()
    // roletArr.map(({title}) => {roleChoices.push(title)})

        inquirer.prompt([
            {
                type: "list",
                name: "selectdept",
                choices: deptChoices,
                message: "Please select department ?",
            }
            // {
            //     type: "list",
            //     name: "selectrole",
            //     choices: roleChoices,
            //     message: "Please select role ?",
            // }
        ])
        .then(data => {
            console.log(data)
            console.log(deptArr)
            let deptID = deptArr.filter(index => index.name.includes(data.selectdept))
            console.log(deptID[0].id)
            // console.log(data.selectrole)
            Employee();
        })
        .catch((err) => console.error(err));
};


// ------- Employee functions -------
const Employee = () => {
    inquirer
    .prompt({
        name: 'select',
        type: 'list',
        message: 'Choose employee action ?',
        choices: ['View All Employees', 'View Test' ,'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', "Remove Employee", "Update Employee Role", "Update Employee Manager", 'Back to main menu'],
    })
    .then((data) => {
        switch (data.select) {
            case 'View All Employees':
                viewAllEmployee();
                break;
            case 'View Test':
                viewTest();
                break;  
            case 'View All Employees By Department':
                viewEmployeeByDept();
                break;
            case 'View All Employees By Manager':
                viewEmployeeByManager();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                break;
            case 'Back to main menu':
                start();
                break;
        };
    })
};

const viewAllEmployee = () => {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`, (err, data) => {
        if (err) throw err;
        console.table(data);
        Employee();
    });
};

const viewEmployeeByDept = async () => {
    const deptChoices = []
    const deptArr = await deptNames()
    deptArr.map(({name}) => {deptChoices.push(name)})
    inquirer.prompt([
            {
                type: "list",
                name: "select",
                choices: deptChoices,
                message: "select the department to view employee information ?"
            },
    ])
    .then((data) => {
            connection.query(`
            SELECT employee.id, employee.first_name, employee.last_name, name AS department, title
            FROM employee LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id
            WHERE name = '${data.select}'; `, (err, res) => {
                if(err) throw err;
                console.table(res);
                Employee();
            });
    })
    .catch((err) => console.error(err));
};

const viewEmployeeByManager = () => {
    connection.query(`
    SELECT DISTINCT CONCAT(m.first_name, ' ', m.last_name) AS Manager, m.id
    FROM employee e JOIN employee m
    WHERE e.manager_id = m.id;`, (err, results) => {
        if(err) throw err;
        inquirer.prompt([
                {
                    type: "list",
                    name: "select",
                    choices() {
                        const Array = [];
                        results.forEach(({Manager})=> {
                            Array.push(Manager);
                        })
                        return Array;
                    },
                    message: "Which employee do you want to see direct reports for ?"
                },
        ])
        .then((data) => {
            let chosen;
            results.forEach((item) => {
                if (item.Manager === data.select) {
                    chosen = item;
                    console.log(chosen)
                };
            })
            connection.query(`
            SELECT employee.id, employee.first_name, employee.last_name, name AS department, title
            FROM employee LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id
            WHERE employee.manager_id = ${chosen.id};`, (err, res) => {
                if(err) throw err;
                console.table(res);
                Employee();
            });
        })
        .catch((err) => console.error(err));
    });  
}

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
                            console.log('======================================')
                            console.log('new Employee Added successfully.');
                            console.log('======================================')
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
                console.log('======================================');
                console.log('Employee deleted successfully');
                console.log('======================================');
                Employee();
            })
        })
    })
}

const updateEmployeeRole = () => {
    connection.query(`SELECT employee.id, CONCAT(employee.id, '.', employee.first_name, ' ' , employee.last_name) AS fullname, employee.role_id, CONCAT(role.id, '.', role.title) AS Role
    FROM employee INNER JOIN role on employee.role_id = role.id;`, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'empSelect',
                choices() {
                    let Array = [];
                    results.forEach(({fullname}) => {
                        Array.push(fullname);
                    });
                    return Array;
                },
             
                message: 'Select employee ?',
            },
            {
                type: 'list',
                name: 'Choice',
                choices() {
                    let Array = [];
                    
                    results.forEach(({Role}) => {
                        Array.push(Role);
                    });
                    const uniqueRoles = [...new Set(Array)];
                    return uniqueRoles;
                },
                message: 'Select employee new role ?',
            },
        ])
        .then((data) => {
            results.forEach((item) => {
                n = data.empSelect.indexOf(".");
                emp_id_sub = data.empSelect.substring(0,n)
                // 0123456
                // 2021.
                // indexof(")") -> 5
                // substring(1,5) -> 2021
                if (item.id === parseInt(emp_id_sub)) {
                    // 0123456
                    // (2021).
                    // indexof(")") -> 5
                    // substring(1,5) -> 2021
                    m = data.Choice.indexOf(")");
                    role_id_sub = data.Choice.substring(1,m)                   
                    connection.query('UPDATE employee SET ? WHERE ?',
                      [
                        {
                          role_id: role_id_sub ,
                        },
                        {
                          id: emp_id_sub,
                        },
                      ],
                      (error) => {
                        if (error) throw err;
                        console.log('======================================');
                        console.log('Role updated successfully!');
                        console.log('======================================');
                        Employee()
                    }); 
                };
            });
        })
        .catch((err) => {
            if(err) throw err; console.log(err)
        });
    });
};

const updateEmployeeManager = () => {
    connection.query(`
    SELECT id, CONCAT(first_name, ' ', last_name) AS Employee
    FROM employee;`, 
    (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'empSelect',
                choices() {
                    let Array = [];
                    results.forEach(({Employee}) => {
                        Array.push(Employee);
                    });
                    return Array;
                },
                message: 'Select employee fullname ?',
            },
            {
                type: 'list',
                name: 'mgrSelect',
                choices() {
                    let Array = [];
                    results.forEach(({Employee}) => {
                        Array.push(Employee);
                    });
                    return Array;
                },
                message: 'Select manager that employee to report to ?',
            },
        ])
        .then((data) => {
            let chosenEmp, chosenMgr;
            results.forEach((item) => {
                if (item.Employee === data.empSelect) {
                    chosenEmp = item;
                };   
            })

            results.forEach((item) => {
                if (item.Employee === data.mgrSelect) {
                    chosenMgr = item;
                    console.log(chosenMgr.id);
                };   
            })
            connection.query('UPDATE employee SET ? WHERE ?',
            [
              {
                manager_id: chosenMgr.id,
              },
              {
                id: chosenEmp.id,
              },
            ],
            (error) => {
              if (error) throw err;
              console.log('======================================');
              console.log('Emploee manager updated successfully!');
              console.log('======================================');
              Employee()
          }); 
        })
        .catch((err) => {
            if(err) throw err; console.log(err)
        });
    });
};


// ------- Roles functions -------
const Roles = () => {
    inquirer.prompt(
        {
        name: 'select',
        type: 'list',
        message: 'Choose the Roles action ?',
        choices: ['View Roles', 'Add Roles', 'Remove Roles','Back to main menu'],
         }
    )
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
                        console.log('======================================');
                        console.log('Role added successfully');
                        console.log('======================================');
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
                    console.log('======================================');
                    console.log('Role deleted successfully');
                    console.log('======================================');
                    Roles();
                })
            } else {
                console.log('======================================')
                console.log('no action taken');
                console.log('======================================')
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
        choices: ['View Departments', 'Add Departments', 'Remove Departments', 'View Department Budget','Back to main menu'],
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
            case 'View Department Budget':
                viewDeptBudget();
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

const viewDeptBudget = async () => {
    const deptChoices = [];
    const deptArr = await deptNames();
    deptArr.map(({name}) => {deptChoices.push(name)});
        inquirer.prompt([
                {
                    type: "list",
                    name: "select",
                    choices: deptChoices,
                    message: "select the department to view utlilized budget ?"
                },
        ])
        .then((data) => {
                connection.query(`
                SELECT name AS department, SUM(salary) AS Budget
                FROM employee LEFT JOIN role ON employee.role_id = role.id 
                LEFT JOIN department ON role.department_id = department.id
                WHERE name = "${data.select}";`, 
                (err, res) => {
                    if(err) throw err;
                    console.table(res);
                    Depts();
                });
        })
        .catch((err) => console.error(err));
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
            console.log('======================================')
            console.log('Department added successfully');
            console.log('======================================')
            Depts();
        })
    })
    .catch((err) => console.error(err));       
};

const removeDepts = async () => {
    const deptChoices = [];
    const deptArr = await deptNames();
    deptArr.map(({name}) => {deptChoices.push(name)});
    inquirer.prompt([ 
        {
            type: "list",
            name: "select",
            choices: deptChoices,
            message: "select the department to remove ?"
        },
        {
            name: "confirmRemove",
            type: "input",
            message: "Are you sure you want to remove (y/n)?",
            validate: function confirmRemoval(ans){
                if(ans !== '' && ans === 'y' || ans !== '' && ans === 'n'){
                    return true;
                };
            }
        },
    ])
    .then((data) => {
        if (data.confirmRemove === 'y') {
            connection.query(`DELETE FROM department WHERE ?`, {name: data.select}, (err, res) => {
                if(err) throw err;
                console.log('======================================');
                console.log('Department deleted successfully');
                console.log('======================================');
                Depts();
            })
        } else {
            console.log('======================================');
            console.log('no action taken');
            console.log('======================================');
            Depts();
        }
    })
    .catch((err) => console.error(err));
};

// start the app
connection.connect((err) => {
    if (err) throw err;
    start();
});