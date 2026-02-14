const mongoose=require("mongoose");

const chunkSchema=new mongoose.Schema({
    documentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Document",
        required:true,
    },
    index:{
        type:Number,
        required:true,   
    },
    embedding:{
type:[Number],
required:true,
    },
    text:{
        type:String,
        required:true,
    },
    startOffset:Number,
    endOffset:Number,
},{timestamps:true});

module.exports=mongoose.model("Chunk",chunkSchema);