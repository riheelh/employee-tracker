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
                    console.log('GoodBye!')
                    connection.end();
                    break;
            }
        })
        .catch((error) => console.log(error));
};

// Add new employee function
const addAllEmployee = () => {
    connection.query(`SELECT * FROM role;`, (err, results) => {
        if (err) throw err;
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
                {
                    name: 'roleChoice',
                    type: 'list',
                    choices() {
                        const Array = [];
                        results.forEach(({title}) => {
                            Array.push(title);
                        });
                        return Array;
                    },
                    message: 'Select employee role?',
                    // have duplicate issue
                },
                // {
                //     name: 'managerChoice',
                //     type: 'list',
                //     choices() {
                //         const Array = [];
                //         results.forEach(({manager}) => {
                //             manager = manager || 0 
                //             Array.push(manager);
                            
                //         })
                //         return Array;
                //     },
                //     message: 'Select employee manager',
                //     // have duplicate issue
                // },
            ])
            .then((data) => {

                console.log(data)
                console.log(results)
                console.log(data.roleChoice)
                
                for(let i = 0; i < results.length; i++){
                    if(data.roleChoice === results[i].title) {
                        role_id === results[i].id
                        connection.query(
                            'INSERT INTO employee SET ?', {
                                first_name: data.first_name,
                                last_name: data.last_name,
                                role_id: results.role_id,
                                // manager_id: data.manager_id
                            },
                            (err) => {
                                if (err) throw err;
                                console.log('new Employee Added successfully.')
                            }
                        );
                    }
                       
                }
                 
                    
            })
            
            .catch((err) => console.error(err));
            })
}

// print all employee infomration on terminal
const viewAllEmployee = () => { 
    connection.query(eAllTable, (err, data) => {
            if (err) throw err;
            // console.log('');
            console.table(data);
            connection.end();
            start()
        }
    )
};


//run the app when mysql connected
connection.connect((err) => {
    if (err) throw err;
    start();
});