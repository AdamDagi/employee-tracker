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
            "Update an employee role",
            "Update employee manager",
            "View employees by department",
            "View employees by Managers",
            "Delete department",
            "Delete role",
            "Delete employee",
            "View the total utilized budget of a department"
        ],
        default: "No more"
    }
];

const addDepartment = [
    {
        type: "input",
        name: "id",
        message: "Please enter Id?",
        inputs: ""
    },
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
        name: "id",
        message: "Please enter ID?",
        inputs: ""
    },
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
        name: "departmentId",
        message: "Please enter Department ID?",
        inputs: ""
    }
];

const addEmployee = [
    {
        type: "input",
        name: "id",
        message: "Please enter ID?",
        inputs: ""
    },
    {
        type: "input",
        name: "empFirstName",
        message: "Please enter employee First Name?",
        inputs: ""
    },
    {
        type: "input",
        name: "empLastName",
        message: "Please enter employee Last Name?",
        inputs: ""
    },
    {
        type: "input",
        name: "empRoleId",
        message: "Please enter role id?",
        inputs: ""
    },
    {
        type: "input",
        name: "empManagerId",
        message: "Please enter manager id?",
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
            if (result && result.length) {
                printTable(result);
            } else {
                console.log("Table is Empty");
            }
            return addTypeOfSpecialist();
        });
    }
    if (answersDatabaseQuestions.questionOptions == "View all roles") {
        db.query(`SELECT * FROM Role`, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result && result.length) {
                const roleS = result;
                db.query(`SELECT * FROM Department`, (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    if (result && result.length) {
                        const rolesInDep = result;
                        roleS.forEach((role) => {
                            const depaTitle = rolesInDep.find((item) => item.id == role.department_id).NAME;
                            role.department = depaTitle;
                            delete role.department_id;
                        });
                        printTable(roleS);
                    } else {
                        console.log("Table is Empty");
                    }
                    return addTypeOfSpecialist();
                });
            } else {
                console.log("Table is Empty");
            }
            return addTypeOfSpecialist();
        });
    }
    if (answersDatabaseQuestions.questionOptions == "View all employees") {
        db.query(`SELECT * FROM Employee`, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result && result.length) {
                const allEmployeeData = result;
                db.query(`SELECT * FROM Role`, (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    if (result && result.length) {
                        const allRoleData = result;
                        db.query(`SELECT * FROM Department`, (err, result) => {
                            if (err) {
                              console.log(err);
                            }
                            if (result && result.length) {
                                const allDepartmentData = result;
                                allEmployeeData.forEach((employee, index) => {
                                    const role = allRoleData.find((role) => role.id == employee.role_id);
                                    employee.jobTitle = role.title;
                                    employee.salary = role.salary;
                                    const findDepa = allDepartmentData.find((depa) => depa.id == role.department_id);
                                    employee.department = findDepa.NAME;
                                    const employesManager = allEmployeeData.find((empl) => empl.id == employee.manager_id);
                                    if (employesManager) {
                                        employee.manager = `${employesManager.first_name} ${employesManager.last_name}`;
                                    } else {
                                        employee.manager = `null`;
                                    }
                                    delete employee.role_id;
                                    delete employee.manager_id;
                                })
                                printTable(allEmployeeData);
                                return addTypeOfSpecialist();
                            } else {
                                console.log("Table is Empty");
                            }
                            return addTypeOfSpecialist();
                        });
                    } else {
                        console.log("Table is Empty");
                    }
                    return addTypeOfSpecialist();
                });
            } else {
                console.log("Table is Empty");
            }
            return addTypeOfSpecialist();
        });
    }
    if (answersDatabaseQuestions.questionOptions == "Add a department") {
        const dataDepartment = await inquirer.prompt(addDepartment);
        db.query(`INSERT INTO Department(id, name) VALUES("${dataDepartment.id}", "${dataDepartment.departmentName}")`, (err, result) => {
            if (err) {
              console.log(err);
            }
            return addTypeOfSpecialist();
        });
    }
    if (answersDatabaseQuestions.questionOptions == "Add a role") {
        const dataRole = await inquirer.prompt(addRole);
        db.query(`INSERT INTO Role(id, title, salary, department_id) VALUES("${dataRole.id}", "${dataRole.roleTitle}", "${dataRole.roleSalary}" , "${dataRole.departmentId}")`, (err, result) => {
            if (err) {
              console.log(err);
            }
        });
        return addTypeOfSpecialist();
    }
    if (answersDatabaseQuestions.questionOptions == "Add an employee") {
        const dataEmployee = await inquirer.prompt(addEmployee);
        console.log(dataEmployee);
        if (dataEmployee.manager_id) {
            db.query(`INSERT INTO Employee(id, first_name, last_name, role_id, manager_id) VALUES("${dataEmployee.id}", "${dataEmployee.empFirstName}", "${dataEmployee.empLastName}", "${dataEmployee.empRoleId}", "${dataEmployee.empManagerId}")`, (err, result) => {
                if (err) {
                  console.log(err);
                }
            });
        } else {
            db.query(`INSERT INTO Employee(id, first_name, last_name, role_id) VALUES("${dataEmployee.id}", "${dataEmployee.empFirstName}", "${dataEmployee.empLastName}", "${dataEmployee.empRoleId}")`, (err, result) => {
                if (err) {
                  console.log(err);
                }
            });
        }
        return addTypeOfSpecialist();
    }
    if (answersDatabaseQuestions.questionOptions == "Update an employee role") {
        let namesArray;
        let rolesIdArray = [];
        db.query(`SELECT * FROM Department`, async (err, result) => {
            if (err) {
              console.log(err);
            } else {
                if(result && result.length) {
                    const nameOfDepa = result.map(item => item.NAME);
                    const questionUpdateRole = [
                        {
                            type: "list",
                            name: "selectDepartment",
                            message: "Choose department for update.",
                            choices: nameOfDepa
                        }
                    ];
                    const res = await inquirer.prompt(questionUpdateRole);
                    departmentId = result.find((depa) => depa.NAME == res.selectDepartment).id;
                    db.query(`SELECT title, id FROM Role WHERE department_id = "${departmentId}"`, async (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                            if(result && result.length) {
                                const rolesArray = result.map(item => item.title);
                                const questionChouseRole = [
                                    {
                                        type: "list",
                                        name: "selectRole",
                                        message: "Choose type of cpecialist whoom you want to upadte.",
                                        choices: rolesArray
                                    }
                                ];
                                const res = await inquirer.prompt(questionChouseRole);
                                const idOfChosenRole = result.find((item) => item.title == res.selectRole).id;
                                db.query(`SELECT first_name FROM Employee WHERE role_id = "${idOfChosenRole}"`, async (err, result) => {
                                    if (err) {
                                      console.log(err);
                                    } else {
                                        if(result && result.length) {
                                            namesArray = result.map(item => item.first_name);
                                            db.query(`SELECT title FROM Role WHERE department_id = "${departmentId}"`, async (err, result) => {
                                                if (err) {
                                                  console.log(err);
                                                } else {
                                                    if(result && result.length) {
                                                        const choosenRolesArray = result.map(item => item.title);
                                                        const questionUpdateRole = [
                                                            {
                                                                type: "list",
                                                                name: "selectEmployee",
                                                                message: "Which Employee would you like to update?",
                                                                choices: namesArray
                                                            },
                                                            {
                                                                type: "list",
                                                                name: "selectNewRole",
                                                                message: "Which Role you want to add to this Employee?",
                                                                choices: choosenRolesArray
                                                            }
                                                        ];
                                                        const res = await inquirer.prompt(questionUpdateRole);
                                                        db.query(`SELECT id FROM Role WHERE title = "${res.selectNewRole}" && department_id = "${departmentId}"`, async (err, result) => {
                                                            if (err) {
                                                            console.log(err);
                                                            } else {
                                                                if(result && result.length) {
                                                                    rolesIdArray = result.map(item => item.id);
                                                                    db.query(`UPDATE Employee SET role_id = "${rolesIdArray[0]}"  WHERE first_name = "${res.selectEmployee}"`, (err, result) => {
                                                                        if (err) {
                                                                        console.log(err);
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                        return addTypeOfSpecialist();
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "Update employee manager") {
        let namesArray;
        let idRoleManager;
        let managersArray;
        let fullMangersArray;
        let departmentId;
        db.query(`SELECT * FROM Department`, async (err, result) => {
            if (err) {
              console.log(err);
            } else {
                if(result && result.length) {
                    const departmentsName = result.map(item => item.NAME);
                    const questionUpdateManager = [
                        {
                            type: "list",
                            name: "selectDepartment",
                            message: "Choose department for update.",
                            choices: departmentsName
                        }
                    ];
                    const res = await inquirer.prompt(questionUpdateManager);
                    departmentId = result.find((depo) => depo.NAME == res.selectDepartment).id;
                    db.query(`SELECT id FROM Role WHERE title = "manager" && department_id = "${departmentId}"`, async (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                            if(result && result.length) {
                                idRoleManager = result.map(item => item.id);
                                console.log(idRoleManager)
                                db.query(`SELECT title, id FROM Role WHERE department_id = "${departmentId}" && title != "manager"`, async (err, result) => {
                                    if (err) {
                                      console.log(err);
                                    } else {
                                        if(result && result.length) {
                                            const rolesArray = result.map(item => item.title);
                                            const questionChouseRole = [
                                                {
                                                    type: "list",
                                                    name: "selectRole",
                                                    message: "Choose type of cpecialist whoom you want to upadte.",
                                                    choices: rolesArray
                                                }
                                            ];
                                            const res = await inquirer.prompt(questionChouseRole);
                                            const idOfChosenRole = result.find((item) => item.title == res.selectRole).id;
                                            db.query(`SELECT first_name FROM Employee WHERE role_id = "${idOfChosenRole}"`, async (err, result) => {
                                                if (err) {
                                                console.log(err);
                                                } else {
                                                    if(result && result.length) {
                                                        namesArray = result.map(item => item.first_name);
                                                        db.query(`SELECT first_name, id FROM Employee WHERE role_id = "${idRoleManager[0]}"`, async (err, result) => {
                                                            if (err) {
                                                            console.log(err);
                                                            } else {
                                                                if(result && result.length) {
                                                                    fullMangersArray = result;
                                                                    managersArray = result.map(item => item.first_name);
                                                                    const questionUpdateManager = [
                                                                        {
                                                                            type: "list",
                                                                            name: "selectEmployee",
                                                                            message: "Which Employee's manger would you like to update?",
                                                                            choices: namesArray
                                                                        },
                                                                        {
                                                                            type: "list",
                                                                            name: "selectNewManager",
                                                                            message: "Which Manager you want to set to this Employee?",
                                                                            choices: managersArray
                                                                        }
                                                                    ];
                                                                    const res = await inquirer.prompt(questionUpdateManager);
                                                                    const newManager = fullMangersArray.find((manager) => manager.first_name = res.selectNewManager);
                                                                    db.query(`UPDATE Employee SET manager_id = "${newManager.id}"  where first_name = "${res.selectEmployee}"`, (err, result) => {
                                                                        if (err) {
                                                                        console.log(err);
                                                                        }
                                                                    });
                                                                    return addTypeOfSpecialist();
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "View employees by department") {
        db.query(`SELECT id, name FROM Department`, async (err, result) => {
            if (err) {
              console.log(err);
            } else {
                if(result && result.length) {
                    const departmentsName = result.map(item => item.name);
                    const questionUpdateRole = [
                        {
                            type: "list",
                            name: "selectDepartment",
                            message: "Wich Department's Employes you want to view?",
                            choices: departmentsName
                        }
                    ];
                    const res = await inquirer.prompt(questionUpdateRole);
                    departmentId = result.find((item) => item.name == res.selectDepartment).id;
                    db.query(`SELECT title, id FROM Role WHERE department_id = "${departmentId}"`, async (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                            if(result && result.length) {
                                const allEpmloyeeArray = [];
                                const unicRolesId = result;
                                let allEmployesName;
                                result.forEach((item, index) => {
                                    db.query(`SELECT first_name, last_name FROM Employee WHERE role_id = "${item.id}"`, async (err, result) => {
                                        if (err) {
                                          console.log(err);
                                        } else {
                                            allEmployesName = allEpmloyeeArray.concat(result);
                                            if (index == unicRolesId.length - 1) {
                                                printTable(allEmployesName);
                                                return addTypeOfSpecialist();
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "View employees by Managers") {
        db.query(`SELECT * FROM Department`, async (err, result) => {
            if (err) {
              console.log(err);
            } else {
                if(result && result.length) {
                    const nameOfDepa = result.map(item => item.NAME);
                    const questionUpdateRole = [
                        {
                            type: "list",
                            name: "selectDepartment",
                            message: "Choose department.",
                            choices: nameOfDepa
                        }
                    ];
                    const res = await inquirer.prompt(questionUpdateRole);
                    departmentId = result.find((depa) => depa.NAME == res.selectDepartment).id;
                    db.query(`SELECT title, id FROM Role WHERE department_id = "${departmentId}" && title = "manager"`, async (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                            if(result && result.length) {
                                const roleIdMan = result[0].id;
                                db.query(`SELECT first_name, last_name, id FROM Employee WHERE role_id = "${roleIdMan}"`, async (err, result) => {
                                    if (err) {
                                    console.log(err);
                                    } else {
                                        if(result && result.length) {
                                            fullMangersArray = result;
                                            managersArray = result.map(item => item.first_name);
                                            const questionUpdateManager = [
                                                {
                                                    type: "list",
                                                    name: "selectNewManager",
                                                    message: "Which Manager's Employes you want to view ?",
                                                    choices: managersArray
                                                }
                                            ];
                                            const res = await inquirer.prompt(questionUpdateManager);
                                            const newManager = fullMangersArray.find((manager) => manager.first_name = res.selectNewManager);
                                            db.query(`SELECT * FROM Employee`, async (err, result) => {
                                                if (err) {
                                                  console.log(err);
                                                } else {
                                                    const data = [];
                                                    const employeeOfManager = result.filter(item => item.manager_id === newManager.id);
                                                    if (employeeOfManager) {
                                                        employeeOfManager.forEach((item,index)=> {
                                                            data[index] = {};
                                                            data[index].index = index;
                                                            data[index][`${newManager.first_name} ${newManager.last_name}`] = `${item.first_name} ${item.last_name}`; 
                                                        });
                                                        printTable(data);
                                                    } else {
                                                        console.log("List is empty");
                                                    }
                                                    return addTypeOfSpecialist();
                                                }
                                            });
                                            return addTypeOfSpecialist();
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });

    }
    if (answersDatabaseQuestions.questionOptions == "Delete department") {
        db.query(`SELECT name FROM Department`, async (err, result) => {
            if (err) {
              console.log(err);
            } else {
                const namesArray = Object.values(result);
                if(namesArray && namesArray.length) {
                    const selectDeliteDepartment = [{
                        type: "list",
                        name: "departmentName",
                        message: "Which department would you like to delete?",
                        choices: namesArray
                    }];
                    const res = await inquirer.prompt(selectDeliteDepartment);
                    const deleteName = res.departmentName;
                    db.query(`DELETE FROM Department WHERE name = ("${deleteName}")`, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }    
                return addTypeOfSpecialist();
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "Delete role") {
        db.query(`SELECT title FROM Role`, async (err, result) => {
            if (err) {
              console.log(err);
            } else {
                if(result && result.length) {
                    const namesArray = result.map(item => item.title);
                    console.log(namesArray);
                    const selectDeliteRole = [{
                        type: "list",
                        name: "roleTitle",
                        message: "Which role would you like to delete?",
                        choices: namesArray
                    }];
                    const res = await inquirer.prompt(selectDeliteRole);
                    const deleteTitle = res.roleTitle;
                    db.query(`DELETE FROM Role WHERE title = ("${deleteTitle}")`, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                return addTypeOfSpecialist();
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "Delete employee") {
        db.query(`SELECT first_name FROM Employee`, async (err, result) => {
            if (err) {
              console.log(err);
            } else {
                if(result && result.length) {
                    const namesArray = result.map(item => item.first_name);
                    const selectDeliteEmployee = [{
                        type: "list",
                        name: "employeeFirstName",
                        message: "Which Employee would you like to delite?",
                        choices: namesArray
                    }];
                    const res = await inquirer.prompt(selectDeliteEmployee);
                    const deleteFirstName = res.employeeFirstName;
                    db.query(`DELETE FROM Employee WHERE first_name = ("${deleteFirstName}")`, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                return addTypeOfSpecialist();
            }
        });
    }
    if (answersDatabaseQuestions.questionOptions == "View the total utilized budget of a department") {
        db.query(`SELECT * FROM Employee`, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result && result.length) {
                const allEmployeeData = result;
                db.query(`SELECT * FROM Role`, (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    if (result && result.length) {
                        const allRoleData = result;
                        db.query(`SELECT * FROM Department`, (err, result) => {
                            if (err) {
                              console.log(err);
                            }
                            if (result && result.length) {
                                const allDepartmentData = result;
                                let budgetSummary = 0;
                                allEmployeeData.forEach((employee, index) => {
                                    const role = allRoleData.find((role) => role.id == employee.role_id);
                                    employee.jobTitle = role.title;
                                    employee.salary = role.salary;
                                    const findDepa = allDepartmentData.find((depa) => depa.id == role.department_id);
                                    employee.department = findDepa.NAME;
                                    const employesManager = allEmployeeData.find((empl) => empl.id == employee.manager_id);
                                    if (employesManager) {
                                        employee.manager = `${employesManager.first_name} ${employesManager.last_name}`;
                                    } else {
                                        employee.manager = `null`;
                                    }
                                    budgetSummary = budgetSummary + Number(employee.salary);
                                    delete employee.role_id;
                                    delete employee.manager_id;
                                })
                                printTable(allEmployeeData);
                                console.log(`The total Sallery Budget of department:  ${budgetSummary}`);
                                return addTypeOfSpecialist();
                            } else {
                                console.log("Table is Empty");
                            }
                        });
                    } else {
                        console.log("Table is Empty");
                    }
                });
            } else {
                console.log("Table is Empty");
            }
        });
        return addTypeOfSpecialist();
    }
};

async function start() {
    const answersWorkers = await addTypeOfSpecialist();
};

(async() => {
    await start();
})();