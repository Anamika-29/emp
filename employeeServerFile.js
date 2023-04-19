let express = require("express");
let app = express();
const cors = require("cors");
app.use(cors());
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

app.get("/svr/employees",function(req,res){
    let department = req.query.department;
    let designation = req.query.designation;

    let arr1 = employees;



    let connection = mysql.createConnection(connData);
    let sql = "";
    if(department && !designation){
        sql = "Select * FROM employees WHERE department=?";
        connection.query(sql,department,function(err,result){
            if(err) console.log(err);
            else res.send(result);
        })

    }
    if(designation && !department){
        sql = "Select * FROM employees WHERE designation=?";
        connection.query(sql,designation,function(err,result){
            if(err) console.log(err);
            else res.send(result);
        })

    }
    if(!designation && !department){
        sql = "Select * FROM employees";
        connection.query(sql,function(err,result){
            if(err) console.log(err);
            else res.send(result);
        })

    }
    if(designation && department){
        sql = "Select * FROM employees WHERE designation=? AND department=?";
        connection.query(sql,[designation,department],function(err,result){
            if(err) console.log(err);
            else res.send(result);
        })

    }
    
});


app.get("/svr/employees/:id",function(req,res){
    let id = +req.params.id;

    let connection = mysql.createConnection(connData);
    let sql  = "Select * FROM employees WHERE empCode=?";
    connection.query(sql,id,function(err,result){
        if(err) res.status(404).send("No Employee found");
        else res.send(result);
    })
    
    
});

app.get("/svr/employees/:id",function(req,res){
    let id = +req.params.id;

    let connection = mysql.createConnection(connData);
    let sql  = "Select * FROM employees WHERE empCode=?";
    connection.query(sql,id,function(err,result){
        if(err) res.status(404).send("No Employee found");
        else res.send(result);
    })
    
    
});

// app.get("/svr/mobiles/:brand",function(req,res){
//     let brand = req.params.brand;
//     let connection = mysql.createConnection(connData);
//     let sql  = "Select * FROM mobiles WHERE brand=?";
//     connection.query(sql,brand,function(err,result){
//         if(err) {res.status(404).send("No mobile found");}
//         else res.send(result);
//     })
    
// });


app.post("/svr/employees",function(req,res){
    let body = req.body;

    let connection = mysql.createConnection(connData);
    let sql  = "INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES(?,?,?,?,?,?)";
    connection.query(sql,[body.empCode,body.name,body.department,body.designation,body.salary,body.gender],function(err,result){
        if(err) console.log(err);
        else {
        let sql2  = "Select * FROM employees";
    connection.query(sql2,function(err,result){
        if(err) console.log(err);
        else res.send(result);
    })
    }
    })
   
});

app.put("/svr/employees/:id",function(req,res){
    let body = req.body;
    let id = +req.params.id;
    let connection = mysql.createConnection(connData);
    let sql  = "UPDATE employees SET empCode=?,name=?,department=?,designation=?,salary=?,gender=? WHERE empCode=?";
    connection.query(sql,[body.empCode,body.name,body.department,body.designation,body.salary,body.gender,id],function(err,result){
        if(err) console.log(err);
        else {
        res.send(result);
    }
    })
});


app.delete("/svr/employees/:id",function(req,res){
    let id = +req.params.id;
    let connection = mysql.createConnection(connData);
    let sql1  = "DELETE FROM employees WHERE empCode=?";
    connection.query(sql1,id,function(err,result){
        if(err) res.send("No employee found")
        else {
        res.send("Successfully Deleted.");
        }
            
    });

});


app.get("/svr/resetData",function(req,res){
    let data = JSON.stringify(mobilesData);

    let connection = mysql.createConnection(connData);
    let sql1  = "DELETE FROM mobiles";
    connection.query(sql1,function(err,result){
        if(err) console.log(err);
        else {
        
        let {mobiles} = require("./mobileData.js");
        let arr = mobiles.map(p=> [p.brand,p.price,p.model]);
        let sql2 = "INSERT INTO mobiles(brand,price,model) VALUES ?";
        connection.query(sql2,[arr],function(err,result){
            if(err) console.log(err);
            else {
                let sql  = "Select * FROM mobiles";
                connection.query(sql,function(err,result){
                    if(err) console.log(err);
                    else res.send(result);
                    })
            }
            });

    }
    });
});
