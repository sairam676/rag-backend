const Document=require("../models/Document");
const Chunk=require("../models/Chunk");
const extractText=require("../services/textExtractor.service");
const chunkText=require("../services/chunker.service");
const miniLMEmbdedding = require("../services/embeddingService");
const ingestDocument = async (req,res)=>{
   if(!req.file){
    return res.status(400).json({message:"No file uploaded"});
   }

   //save doc data
   const document = await Document.create({
    filename:req.file.originalname,
    mimetype:req.file.mimetype,
    size:req.file.size,
   });

   //text extraction
   const text= await extractText(req.file);

   //creating chunks
   const chunks=chunkText(text);

   //save chunks
const chunkDocs=[];
for(let i=0;i<chunks.length;i++){
    const embedding=await miniLMEmbdedding(chunks[i].text);
    chunkDocs.push({
        documentId:document._id,
        index:i,
        text:chunks[i].text,
        embedding,
        startOffset:chunks[i].start,
        endOffset:chunks[i].end,
    });
}


if (chunkDocs.length > 5000) {
  throw new Error("Too many chunks — ingestion aborted");
}
    await Chunk.insertMany(chunkDocs);
    res.json({
        message:"Doc ingested",
        totalChunks:chunks.length,
        preview:chunks[0]?.text.slice(0,200)
    });
};

module.exports={ingestDocument};