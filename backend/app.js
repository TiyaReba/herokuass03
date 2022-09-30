const express = require('express');
const cors = require('cors');
var bodyparser=require('body-parser');
const UserData = require ('./models/usermodel')
const BookData = require('./models/booksmodel')
const bcrypt=require('bcrypt');
const path = require('path');
const app = new express();
app.use(bodyparser.json());
app.use(express.static("./dist/frontend"));



app.use(cors());
app.use(express.json());
// console.log("body"+ req.body);
app.post('/api/signup',function(req,res){
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-method:GET,POST,PUT,DELETE");
    console.log("this is");
    console.log("name:" +req.body.firstname)

    var thing = {
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    age:req.body.age,
    gender:req.body.gender,
    role:req.body.role,
    email:req.body.email,
    password:req.body.password,
    confirmpassword:req.body.confirmpassword
    }
    var data = UserData(thing);
    console.log("data=", data);
    data.save();
    UserData.find().then(function(data){
        res.send(data);
    })
})

// TO LOGIN

app.put("/api/login",(req,res)=>{
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-method:GET,POST,PUT,DELETE");
    console.log("inside login router")
    console.log("login body",req.body.email)
try {
       UserData.findOne({email: req.body.email})
        .then((data) => {
            if (data) {
                res.status(200);
                res.json(data);
            } else {
                res.status(404);
                res.json({
                    message: ["student not found"],
                });
            }
        })
        .catch((err) => {
            console.log("Error:", err);
            res.json(err);
        });
}
catch (err)
{
    console.log("error", err)
    res.status(500)
    res.json(err);
}
});

// post for addbooks
app.post('/api/addbook',function(req,res){
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-method:GET,POST,PUT,DELETE");
    console.log("this is");
    console.log("name:" +req.body)

    var book = {
        bookname:req.body.bookname,
    authorname:req.body.authorname,
    genre:req.body.genre,
    availability:req.body.availability
    }
    var bookdata = BookData(book);
    console.log("data=", bookdata);
    bookdata.save();
    BookData.find().then(function(bookdata){
        res.send(bookdata);
    })
})



// to get data to books page
app.get('/api/books',function(req,res) {
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-method:GET,POST,PUT,DELETE");
   BookData.find()
      .then(function(books){
         res.send(books);
})
})


// to delete data
app.delete('/api/remove/:id',(req,res)=>{
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-method:GET,POST,PUT,DELETE");
   
   const id = req.params.id;
    BookData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })

//   to update data
app.put('/api/update',(req,res)=>{
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-method:GET,POST,PUT,DELETE");
    console.log("hi")
     id=req.body._id,
    bookname=req.body.bookname,
    authorname=req.body.authorname,
    genre=req.body.genre,
    availability=req.body.availability
   BookData.findOneAndUpdate({"_id":id},
                                {$set:{"bookname":bookname,
                                "authorname":authorname,
                                "genre":genre,
                                "availability":availability
                               }})
   .then(function(){
       res.send();
   })
 })

app.get('/api/:id',(req,res)=>{
    console.log("getedit")
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-method:GET,POST,PUT,DELETE");
    BookData.findOne({"_id":req.params.id})
    .then (function(books){
        res.send(books);
    })
})


app.get('/*',(req,res)=>
    res.sendFile(path.join(_dirname +'/dist/frontend/index.html'))

);







app.listen(process.env.PORT || 3000, function(){
    console.log('listening to port 3000');
});

