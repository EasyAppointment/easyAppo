const express = require('express');
const router = express.Router();
const User = require("../models/userModels");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



router.post('/register' , async(req, res) =>{
    
    
    try{

        const userExists = await User.findOne({email:req.body.email});
        if(userExists){
            return res.status(400).send({message: "User already exists", sucess:false})
        }

        const password = req.body.password;
        console.log(req.body);
        console.log("abhay")
        

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
      
       
    //    const newUser = new User(req.body);
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword , // Store the hashed password
        gender: req.body.gender,
        phone: req.body.phone,
        age:req.body.age
    });

       await newUser.save();
       res.status(200).send({message:"User created sucessfully" , sucess:true})

    }catch(error){
       res.status(500).send({message: error,sucess:false})
       
     
    }
})

router.post('/login' , async(req, res) =>{
    
    try{
      const user = await User.findOne({email:req.body.email});
      if(!user){

        return res.status(200).send({message:"User does not exist" , success:false })
      }
      const isMatch = await bcrypt.compare(req.body.password , user.password)
      if(!isMatch){
        return res.status(200).send({message:"Password is incorrect" , success:false})
      }else{
        const token = jwt.sign({id:user._id}, "EasyAppointment" , {
            expiresIn:"75d"
        });
        res.status(200).send({message:"login successful", success:true , data :token , userData : user})
      }

    }catch(error){
        res.status(500).send({error:error , success:false})
    }
})

module.exports = router;