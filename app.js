const express= require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const Employee=require('./models/employee');
const methodOverride=require('method-override')
const cors = require("cors");
const helmet = require("helmet");

mongoose.connect("mongodb+srv://ABHILASH_A:Mongo123456@cluster0.askpc.mongodb.net/WebPro_MajorProject1?retryWrites=true&w=majority")
    .then(()=>{
        console.log("MONGO CONNECTION OPEN");

    })
    .catch((err)=>{
        console.log("OH NO MONGO ERROR");
        console.log(err)
    })

    app.set('views',path.join(__dirname,'views'))
    app.set('view engine','ejs');
    app.use(express.urlencoded({extended:true}));
    app.use(methodOverride('_method'))
    app.use(cors());
    app.use(helmet());

    app.get("/employees", (req, res) => {
          const Employees= await Employee.find({});
        res.send(Employees);
   
    });
    
    app.get("/home",async(req,res)=>{
        const Employees= await Employee.find({});
        res.render('employee',{Employees});
    })//For my usage---------------------------------------------------------------------------------------------------------
   
    app.get("/new",(req,res)=>{
        res.render("new");
    })



   app.get("/edit/:name",async(req,res)=>{
       const {name}= req.params;
       const e=  await Employee.findOne({name:name});
       res.render("edit",{e})
   })

    app.post('/home',async (req,res)=>{
        const newEmployee= new Employee(req.body);
        await newEmployee.save();
        res.redirect("/home")
     
    })//######################################################################################################################

    app.get("/:name",async(req,res)=>{
        const {name}= req.params;
        const e = await Employee.findOne({name});
        res.render("show",{e});//--------------------------------------------------------------------------------------------
    })
   
    app.put("/:name",async(req,res)=>{
        const {name}= req.params;
        const e=  await Employee.findOneAndUpdate({name:name},req.body,{runValidators:true,new:true});
        console.log(e)
        res.redirect(`/${e.name}`)
        
    })

    app.all("*", (req,res) => {
        res.status(404).json({
            "message": "Seems you got lost"
        })
    })
    
    app.listen(process.env.PORT || 8080, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Server started")
        }
    })
