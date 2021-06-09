const express = require('express');
const app = express();
var path = require('path');

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));
const port = 3000;

app.get("/",function(req,res){
    res.redirect("/login");
});

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/signup",function(req,res){
    res.render("signup");
})

app.listen(port,() => {
    console.log(`Project listening at http://localhost:${port}`);
});



