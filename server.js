const express=require("express")
const mysql=require("mysql")
const cors=require("cors")
// var bodyParser = require('body-parser');
const app=express()

app.use(cors())
app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: false }));

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"tuftask"
})

app.get("/",(req,res)=>{
    return res.json("From Backend")
})

app.get("/bannerData",(req,res)=>{
    const query="SELECT * FROM banner"
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
         console.log(data);
            
        return res.json(data)
    })
})

app.post("/saveData",(req,res)=>{
    const body=req.body
    const query="SELECT * FROM banner"
    let saveQuery=""
    // const updateQuery=""
    db.query(query,async(err,data)=>{
        if(err) return res.json(err)
        console.log(data.length);
        if (await data.length>0) {
            saveQuery=`UPDATE banner SET showTill ='${body.showTill}' ,description = '${body.description}',link = '${body.link}',showBanner = ${body.showBanner} WHERE id = 1`
        }else{
            saveQuery=`INSERT INTO banner (showTill, description, link, showBanner) VALUES (${body.showTill}, ${body.description}, ${body.link}, ${body.showBanner})`
        }
        console.log(saveQuery)
        // return res.json(data)
        db.query(saveQuery,(err,data)=>{
            if(err) console.log(err);
            console.log(data);
            
            
        })
    })
    // console.log(saveQuery)
})

app.listen((process.env.PORT || 8080),()=>{
    console.log("Listning")
})