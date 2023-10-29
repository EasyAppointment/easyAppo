const mongoose = require('mongoose');


const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    experienced:{
        type:String,
        required:true
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