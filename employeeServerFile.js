let express = require("express");
let app = express();
const cors = require("cors");
app.use(cors());
const {Client} = require("pg");
const client = new Client({
    user: "postgres",
    password: "Emppass@29Emp",
    database: "postgres",
    port : 5432,
    host: "db.gauvaomgpidnqgpgurqt.supabase.co",
    ssl:{rejectUnauthorized:false},
});
client.connect(function(res,error){
    console.log(`Connected!!!`);
});
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Orgin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
let mysql = require("mysql");
let connData = {
    host : "localhost",
    user:"root",
    password:"",
    database:"testDB",
};
const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
let {employees} = require("./employeeData.js");
let fs = require("fs");

app.get("/svr/employees",function(req,res,next){
    let department = req.query.department;
    let designation = req.query.designation;

    let arr1 = employees;



    // let connection = mysql.createConnection(connData);
    const query = "";
    if(department && !designation){
        query = "Select * FROM employees WHERE department=?";
        client.query(query,department,function(err,result){
            if(err) console.log(err);
            else res.send(result.rows);
            client.end();

        })

    }
    if(designation && !department){
        query = "Select * FROM employees WHERE designation=?";
        client.query(query,designation,function(err,result){
            if(err) console.log(err);
            else res.send(result.rows);
            client.end();

        })

    }
    if(!designation && !department){
        query = "Select * FROM employees";
        client.query(query,function(err,result){
            if(err) console.log(err);
            else res.send(result.rows);
            client.end();

        })

    }
    if(designation && department){
        query = "Select * FROM employees WHERE designation=? AND department=?";
        client.query(query,[designation,department],function(err,result){
            if(err) console.log(err);
            else res.send(result.rows);
            client.end();

        })

    }
    
});


app.get("/svr/employees/:id",function(req,res,next){
    let id = +req.params.id;

    // let connection = mysql.createConnection(connData);
    const query  = `Select * FROM employees WHERE empCode=?`;
    client.query(query,id,function(err,result){
        if(err) res.status(404).send("No Employee found");
        else res.send(result.rows);
    client.end();
    })
    
    
});

app.post("/svr/employees",function(req,res,next){
    var values = Object.values(req.body);
    // let connection = mysql.createConnection(connData);
    let query  = `INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES($1,$2,$3,$4,$5,$6)`;
    client.query(query,values,function(err,result){
        if(err) console.log(err);
        else {
        let query2  = "Select * FROM employees";
    client.query(query2,function(err,result){
        if(err) console.log(err);
        else res.send(result.rows);
    })
    }
    })
   
});

app.put("/svr/employees/:id",function(req,res,next){
    let body = req.body;
    let id = +req.params.id;
    let values =[body.empCode,body.name,body.department,body.designation,body.salary,body.gender,id]
    // let connection = mysql.createConnection(connData);
    let query  = "UPDATE employees SET empCode=$1,name=$2,department=$3,designation=$4,salary=$6,gender=$7 WHERE empCode=$8";
    client.query(sql,values,function(err,result){
        if(err) console.log(err);
        else {
        res.send(result.rows);
    }
    })
});


app.delete("/svr/employees/:id",function(req,res,next){
    let id = +req.params.id;
    // let connection = mysql.createConnection(connData);
    let query  = "DELETE FROM employees WHERE empCode=?";
    client.query(query,id,function(err,result){
        if(err) res.send("No employee found")
        else {
        res.send("Successfully Deleted.");
        }
            
    });

});


