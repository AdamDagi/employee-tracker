const inquirer = require("inquirer");
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'Shiha005',
      database: 'EmployeeTracker'
    },
    console.log(`Connected to the inventory_db database.`)
);

const databaseQuestions = [
    {
        type: "list",
        name: "questionOptions",
        message: "What would you like to do?",
        choices: [
            "View all departments", 
            "View all roles", 
            "View all employees", 
            "Add a department",
            "Add a role", 
            "Add an employee", 
            "Update an employee role"
        ],
        default: "No more"
    }
];

const addDepartment = [
    {
        type: "input",
        name: "departmentName",
        message: "Please enter name?",
        inputs: ""
    }
];

const addRole = [
    {
        type: "input",
        name: "roleTitle",
        message: "Please enter title?",
        inputs: ""
    },
    {
        type: "input",
        name: "roleSalary",
        message: "Please enter salary?",
        inputs: ""
    },
    {
        type: "input",
        name: "roleDeaprtmentId",
        message: "Please enter department id?",
        inputs: ""
    }
];

const addEmployee = [
    {
        type: "input",
        name: "empFirstName",
        message: "Please enter title?",
        inputs: ""
    },
    {
        type: "input",
        name: "empLastName",
        message: "Please enter salary?",
        inputs: ""
    },
    {
        type: "input",
        name: "empRoleId",
        message: "Please enter department id?",
        inputs: ""
    },
    {
        type: "input",
        name: "empManagerId",
        message: "Please enter department id?",
        inputs: ""
    }
];

const addTypeOfSpecialist = async (inputs = []) => {
    let mergeAnswers;
    const answersDatabaseQuestions = await inquirer.prompt(databaseQuestions);
    if (answersDatabaseQuestions.questionOptions == "No more") {
        if (inputs.length > 0) {
            return inputs;
        }
        return;
    }
    if (answersDatabaseQuestions.questionOptions == "View all departments") {
        db.query(`SELECT * FROM Department`, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result.length) {
                printTable(result);
            } else {
                console.log("Table is Empty");
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "View all roles") {
        db.query(`SELECT * FROM Role`, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result.length) {
                printTable(result);
            } else {
                console.log("Table is Empty");
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "View all employees") {
        db.query(`SELECT * FROM Employee`, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result.length) {
                printTable(result);
            } else {
                console.log("Table is Empty");
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "Add a department") {
        const data = await inquirer.prompt(addDepartment);
        const name = data.departmentName;
        db.query(`INSERT INTO Department(name) VALUES("${name}")`, (err, result) => {
            if (err) {
              console.log(err);
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "Add a role") {
        const data = await inquirer.prompt(addRole);
        const roleTitle = data.roleTitle;
        const roleSalary = data.roleSalary;
        const roleDeaprtmentId = data.roleDeaprtmentId;
        db.query(`INSERT INTO Role(title) VALUES("${roleTitle}")`, (err, result) => {
            if (err) {
              console.log(err);
            }
        });
        db.query(`INSERT INTO Role(salary) VALUES("${roleSalary}")`, (err, result) => {
            if (err) {
              console.log(err);
            }
        });
        db.query(`INSERT INTO Role(department_id) VALUES("${roleDeaprtmentId}")`, (err, result) => {
            if (err) {
              console.log(err);
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "Add an employee") {
        const data = await inquirer.prompt(addEmployee);
        const empFirstName = data.empFirstName;
        const empLastName = data.empLastName;
        const empRoleId = data.empRoleId;
        const empManagerId = data.empManagerId;
        db.query(`INSERT INTO Employee(first_name) VALUES("${empFirstName}")`, (err, result) => {
            if (err) {
              console.log(err);
            }
        });
        db.query(`INSERT INTO Employee(last_name) VALUES("${empLastName}")`, (err, result) => {
            if (err) {
              console.log(err);
            }
        });
        db.query(`INSERT INTO Employee(role_id) VALUES("${empRoleId}")`, (err, result) => {
            if (err) {
              console.log(err);
            }
        });
        db.query(`INSERT INTO Employee(manager_id) VALUES("${empManagerId}")`, (err, result) => {
            if (err) {
              console.log(err);
            }
        });
    }
};
async function start() {
    const answersWorkers = await addTypeOfSpecialist();
};

(async() => {
    await start();
})();