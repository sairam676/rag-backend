const multer =require("multer");

const storage = multer.memoryStorage();
//file stays in mem for now(well parse later)

const fileFilter=(req,file,cb)=>{

    const allowedTypes=[
        "application/pdf",
        "text/markdown",
        "text/plain"
    ];
    if(!allowedTypes.includes(file.mimetype)){
        cb(new Error("unsupported file type"),false);
    }else{
cb(null,true);
        }
}
const upload =multer({
    storage,
    fileFilter,
    limits:{fileSize:2*1024*1024}//10MB limit
});

module.exports=upload;