
const mongoose=require('mongoose');

const documentSchema=new mongoose.Schema({
    filename:{
        type:String,
        require:true,
    },
    mimetype:{
        type:String,
        required:true,
    },
    size:{
        type:Number,
        require:true,
    },
},{timestamps:true});

module.exports=mongoose.model("Document",documentSchema);