const express=require("express");
const Document=require("../models/Document");
const Chunk=require("../models/Chunk");
const router=express.Router();

router.get('/',async(req,res)=>{
    try {
        const documents=await Document.find().select(
            "_id filename mimetype size createdAt"
        );
        res.json(documents);
    } catch (error) {
        res.status(500).json({error:"Failed to fetch documents"});
    }
})

router.get('/:id',async(req,res)=>{
    try {
        const{id}=req.params;
        const document=await Document.findById(id);
        if(!document)return res.status(404).json({error:"Document not found"});
       const chunkCount = await Chunk.countDocuments({ documentId: id });

res.json({
  ...document.toObject(),
  chunkCount
});

        
    } catch (error) {
        res.status(500).json({error:"Invalid document ID"});
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        await Chunk.deleteMany({documentId:id});
        await Document.findByIdAndDelete(id);
        res.json({message:"Document deleted"});
    } catch (error) {
        res.status(500).json({error:"Failed to delete document"});
    }
})
module.exports=router;
