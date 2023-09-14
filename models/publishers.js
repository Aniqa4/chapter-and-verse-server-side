const mongoose = require('mongoose');

//Schema

const publishersSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        desciption:{
            type:String,
            required:true
        },
    }
)

const Publishers=mongoose.model('publishers',publishersSchema);
module.exports= Publishers;