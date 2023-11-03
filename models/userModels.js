const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
       
    },
    
    phone:{
        type:String,
       
    },

    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    }
    
    

},{
    timestamps:true
})


const userModel = mongoose.model('users', userSchema);

module.exports = userModel;