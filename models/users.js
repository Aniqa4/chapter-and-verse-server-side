const mongoose = require('mongoose');

//Schema

const usersSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        role:{
            type:String,
            required:true
        },
    }
)

const Users=mongoose.model('users',usersSchema);
module.exports= Users;