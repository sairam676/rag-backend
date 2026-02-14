const  express= require("express");
const {ingestDocument}=require("../controllers/ingestController");
const upload= require("../middlewares/uploadMiddleware");

const router= express.Router();

router.post("/",(req,res,next)=>{
    upload.single("file")(req,res,(err)=>{
         if(err){
        return res.status(400).json({message:err.message});
    }
    next();
    });
},ingestDocument);

module.exports=router;