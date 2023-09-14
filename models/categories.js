const mongoose = require('mongoose');

//Schema

const categoriesSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        desciption:{
            type:String,
            required:true
        },
    }
)

const Categories=mongoose.model('categories',categoriesSchema);
module.exports= Categories;