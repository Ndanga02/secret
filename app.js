//jshint esversion:6
require('dotenv').config();
const express= require('express');
const app= express();
const bodyParser= require('body-parser');
const ejs= require('ejs');
const mongoose= require('mongoose');
const encrypt=require('mongoose-encryption');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/secretsDB');

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
console.log(process.env.SECRET_KEY)

const secret=process.env.SECRET_KEY;


userSchema.plugin(encrypt,{secret:secret,requireAuthenticationCode: false,encryptedFields: ['password']}); 

const User=new mongoose.model('User',userSchema);

app.get('/', (req,res)=>{

res.render('home');

})

app.get('/login', (req,res)=>{

    res.render('login');
    
})

app.post('/login', (req,res)=>{
    const username=req.body.username;
    const pass=req.body.password;

    User.findOne({email:username}).then((foundUser)=>{
        if(foundUser){
            if(foundUser.password == pass){
                res.render('secrets');
            }
            else{res.send('wrong password');}
        }
        else{res.send('user not found');}
    })


});
    
app.get('/register', (req,res)=>{

        res.render('register');
        
})
        
app.post('/register', (req,res)=>{
    const newUser= new User(
        {
            email:req.body.username,
            password:req.body.password
        }
    );
    newUser.save().then((found)=>{
        if(found){res.render('secrets');
    console.log("GOOD TO GO");}
        else{console.log("error");}
    });
})

app.get('/logout',(req,res)=>{
    res.redirect('/');
})

app.get('/submit',(req,res)=>{
    res.render('submit');
})

app.post('/submit',(req,res)=>{
    
})









app.listen(3000,()=>{
    console.log('server is running on port 3000');
})