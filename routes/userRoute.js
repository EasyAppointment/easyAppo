const express = require('express');
const router = express.Router();
const User = require("../models/userModels");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Doctor = require("../models/doctorModels");
const twilio = require('twilio');

const accountSid = 'AC5e5eed181f5cb11ce51adf4350a12100'; 
const authToken = 'e0ab55122a65c67e6cd57ad11c55df00'; 
const client = new twilio(accountSid, authToken);


// Patient Register
router.post('/register' , async(req, res) =>{
    
    
    try{

        const userExists = await User.findOne({phone:req.body.email});
        
        if(userExists){
            return res.status(401).send({message: "User already exists", sucess:false})
        }

        const password = req.body.password;
        console.log(req.body);
        
        

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
      
       
    //    const newUser = new User(req.body);
    const newUser = new User({
        name: null,
        password: hashedPassword , 
        phone: null,
        email : req.body.email

        
    });

       await newUser.save();
       res.status(200).send({message:"User created sucessfully" , sucess:true})

    }catch(error){
       res.status(500).send({message: error,sucess:false})
       
     
    }
})

//Patient Login
router.post('/login' , async(req, res) =>{
    
    try{
      const user = await User.findOne({phone:req.body.phone});
      if(!user){

        return res.status(401).send({message:"User does not exist" , success:false })
      }
      const isMatch = await bcrypt.compare(req.body.password , user.password)
      if(!isMatch){
        return res.status(400).send({message:"Password is incorrect" , success:false , status :"400"})
      }else{
        const token = jwt.sign({id:user._id}, "EasyAppointment" , {
            expiresIn:"75d"
        });
        res.status(200).send({message:"login successful", success:true , data :token , userData : user , status :"200"})
      }

    }catch(error){
        res.status(500).send({error:error , success:false})
    }
})


// Get all doctors by pateint 
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized', success: false });
  }

  jwt.verify(token, 'EasyAppointment', (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid token', success: false });
    }

    req.user = user;
    next();
  });
};

router.get('/doctors', verifyToken, async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).send({ message: 'Doctors fetched successfully', success: true, data: doctors });
  } catch (error) {
    res.status(500).send({ message: error, success: false });
  }
});

//otp based 
const otps = {};
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
router.post('/generate-otp', async (req, res) => {
  const phone = req.body.phone;

  try {
    const userExists = await User.findOne({ phone });

    if (!userExists) {
      return res.status(401).send({ message: "User does not exist", success: false });
    }

    const otp = generateOTP();
    otps[phone] = otp;

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP for login is: ${otp}`,
      from:  '9264976820', 
      to: phone
    });

    res.status(200).send({ message: "OTP sent successfully", success: true });
  } catch (error) {
    res.status(500).send({ message: error, success: false });
  }
})

router.post('/otp-login', async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).send({ message: "Phone number and OTP are required", success: false });
  }

  if (otps[phone] && otps[phone] == otp) {
    // OTP is valid
    delete otps[phone]; // Remove the OTP from temporary storage

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).send({ message: "User does not exist", success: false });
    }
    const token = jwt.sign({ id: user._id }, "EasyAppointment", {
      expiresIn: "75d"
    });

    res.status(200).send({ message: "Login successful", success: true, data: token, userData: user, status: "200" });
     } else {
    return res.status(400).send({ message: "Invalid OTP", success: false });
  }
});



module.exports = router;