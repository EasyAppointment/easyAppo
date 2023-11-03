const mongoose = require('mongoose');


const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        
    },
    
    phone:{
        type:String,
       
    },
    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
      
    },

    password:{
        type:String,
        required:true

    },
    qualification:{
        type:String,
       
    },
    experienced:{
        type:String,
       
    },
    isApproved:{
        type: Boolean
    },
    photo:{
        type:String
    }
    

},{
    timestamps:true
})


const userModel = mongoose.model('doctors', doctorSchema);

module.exports = userModel;