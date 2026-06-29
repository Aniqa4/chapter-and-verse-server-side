const mongoose = require('mongoose');

//Schema

const authorsSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
        },
        phone:{
            type:String,
        },
        description:{
            type:String,
            required:true
        },
    }
)

const Authors=mongoose.model('authors',authorsSchema);
module.exports= Authors;