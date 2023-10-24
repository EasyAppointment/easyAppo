const express = require('express');
const router = express.Router();
const Doctor = require("../models/doctorModels");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register' , async(req, res) =>{
    
    
    try{

        const doctorExists = await Doctor.findOne({email:req.body.email});
        
        if(doctorExists){
            return res.status(400).send({message: "Doctor already exists", sucess:false })
        }

        const password = req.body.password;
        console.log(req.body);
        
        

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
      
       
    
    const newDoctor = new Doctor({
        name: req.body.name,
        email:req.body.email,
        password: hashedPassword , 
        role:req.body.role,
        phone: req.body.phone,
        
    });

       await newDoctor.save();
       res.status(200).send({message:"Doctor profile created sucessfully" , sucess:true})

    }catch(error){
       res.status(500).send({message: error.message,sucess:false})
       
     
    }
})

router.post('/login' , async(req, res) =>{
    
    try{
      const doctor = await Doctor.findOne({email:req.body.email});
      if(!doctor){

        return res.status(400).send({message:"Doctor profile does not exist" , success:false })
      }
      const isMatch = await bcrypt.compare(req.body.password , doctor.password)
      if(!isMatch){
        return res.status(500).send({message:"Password is incorrect" , success:false})
      }else{
        const token = jwt.sign({id:doctor._id}, "EasyAppointment" , {
            expiresIn:"75d"
        });
        res.status(200).send({message:"login successful", success:true , data :token , doctorData : doctor})
      }

    }catch(error){
        res.status(500).send({error:error , success:false})
    }
})






module.exports = router;