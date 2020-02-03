const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');

const app = express();


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

mysqlConnection.connect((error) => {
    if (error) {
        return console.log('DB Connection failed ! \n Error : ' + error);
    }
    console.log('DB Connection Succeded');
});

const viewsPath = path.join(__dirname, 'views');
const publicDirPath = path.join(__dirname,'public');

app.set('views',viewsPath);
app.set('view engine', 'hbs');
app.use(express.static(publicDirPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(3000, () => {
    console.log('Express Server is up and running on port 3000');
});


// Get all Employees
app.get('/employees', (req, res) => {
    mysqlConnection.query('select * from employee', (error, rows) => {
        if (error) {
            return console.log('Error Fetching Data : ' + error);
        }
        //res.send(rows);
        res.render('employee_views',{
            results: rows
        });
    });
});

// Get Employee by ID
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('select * from employee where empid = ?', [req.params.id], (error, rows, fields) => {
        if (error) {
            return console.log('Error Fetching Data : ' + error);
        }
        //res.send(rows);
        res.render('editForm', {
            result: rows
        });
    });
});

// Delete Employee by ID
app.get('/delete/:id', (req, res) => {
    mysqlConnection.query('delete from employee where empid = ?', [req.params.id], (error, rows, fields) => {
        if (error) {
            return console.log('Error Fetching Data : ' + error);
        }
        //res.send("Deleted Successfully !!");
        res.redirect('/employees');
    });
});

// Insert into Employee 
app.post('/save', (req, res) => {

    /* var empid = req.body.empid;
    var name = req.body.name;
    var empcode = req.body.empcode;
    var salary = req.body.salary;

    res.send("Empid : "+empid+"\nName : "+name+"\nEmpCode : "+empcode+"\nSalary : "+salary);
    */

    //const { name, empcode, salary } = req.body;
    //var empid = req.body.empid;
    var name = req.body.name;
    var empcode = req.body.empcode;
    var salary = req.body.salary;
    var insertQuery = "insert into employee (name, empcode, salary) values('" + name + "', '" + empcode + "'," + salary + ")";
    console.log("Query : " + insertQuery);
    mysqlConnection.query(insertQuery, (error, results) => {
        if (error) {
            return console.log('Error while inserting data : ' + error);
        }
        //res.send('Inserted Successfully !!');
        res.redirect('/employees');
    });
    //res.send("Empid : "+empid+"\nName : "+name+"\nEmpCode : "+empcode+"\nSalary : "+salary);
});

// Update an Employee
app.post('/update', (req, res) => {
    const { empid, name, empcode, salary } = req.body;
    //const empid = req.params.id;

    var updateQuery = "update employee set name = '" + name + "', empcode = '" + empcode + "', salary = " + salary + " where empid = " + empid;
    console.log("Update Query : " + updateQuery);
    mysqlConnection.query(updateQuery, (error, results) => {
        if (error) {
            return console.log('Error while updating data : ' + error);
        }
        //res.send('Updated Successfully !!');
        res.redirect('/employees');
    });
});

