const express = require('express');
const router = express.Router();
const Doctor = require("../models/doctorModels");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;



// Doctor Register
router.post('/register' , async(req, res) =>{
    
    
    try{

        const doctorExists = await Doctor.findOne({email:req.body.email});
        
        if(doctorExists){
            return res.status(401).send({message: "Doctor already exists", sucess:false })
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
        qualification:req.body.qualification,
        experienced:req.body.experienced,
        isApproved: false,
        photo:req.body.photo
      
        
    });

       await newDoctor.save();
       res.status(200).send({message:"Doctor profile created sucessfully" , sucess:true })

    }catch(error){
       res.status(500).send({message: error.message,sucess:false})
       
     
    }
})

//Doctor login
router.post('/login' , async(req, res) =>{
    
    try{
      const doctor = await Doctor.findOne({email:req.body.email});
      if(!doctor){

        return res.status(401).send({message:"Doctor profile does not exist" , success:false })
      }
      const isMatch = await bcrypt.compare(req.body.password , doctor.password)
      if(!isMatch){
        return res.status(400).send({message:"Password is incorrect" , success:false})
      }else{
        const token = jwt.sign({id:doctor._id}, "EasyAppointment" , {
            expiresIn:"75d"
        });
        res.status(200).send({message:"login successful", success:true , data :token , doctorData : doctor , isApproved : true})
      }

    }catch(error){
        res.status(500).send({error:error , success:false})
    }
})

//Doctor Photo 
cloudinary.config({ 
  cloud_name: 'dzfz1uhcx', 
  api_key: '872692412356279', 
  api_secret: 'H8_YAck8zuIWdtWPJgl67cAB1EA' 
});

router.post('/upload' , (req,res) =>{
    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath , (err ,result) =>{
      console.log(result)
      if (err) {
        return res.status(500).send({message: err.message, success: false});
      }
      res.status(200).send({message: "File uploaded successfully", success: true, data: result});
    } )
})
//IsApproved 
router.patch('/:id' , async (req, res) => {
  const doctorId = req.params.id;

  try {
      const updatedDoctor = await Doctor.findByIdAndUpdate(
          doctorId,
          { isApproved: req.body.isApproved },
          { new: true } 
      );

      if (!updatedDoctor) {
          return res.status(404).send({ message: "Doctor not found", success: false });
      }

      res.status(200).send({ message: "Doctor approval status updated successfully", success: true, data: updatedDoctor });
  } catch (error) {
      res.status(500).send({ message: error.message, success: false });
  }
});




// Get all Doctors
router.get("/", async (req, res) => {
  try {
      const doctors = await Doctor.find();
      res.status(200).send({ message: "List of Doctors", success: true, data: doctors });
  } catch (error) {
      res.status(500).send({ message: error, success: false });
  }
});






module.exports = router;