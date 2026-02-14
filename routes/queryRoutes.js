const express=require("express");
const Chunk=require("../models/Chunk");
const {cosineSimilarity,keywordScore}=require("../services/similarity.service");
const answerWithContext=require("../services/llm.service");
const miniLMEmbdedding = require("../services/embeddingService");
const router=express.Router();
const embeddingCache=new Map();
const responseCache =new Map();

router.post("/",async(req,res)=>{
    const {query}=req.body||{};
    const {documentId}=req.query||{};
    if(!query)return res.status(400).json({error:"Query required"});
        
    //cahching embedding
    let queryEmbedding;
    if(embeddingCache.has(query)){
        queryEmbedding=embeddingCache.get(query);
    }else{
         queryEmbedding=await miniLMEmbdedding(query);
         embeddingCache.set(query,queryEmbedding);
    }

    //llm querying with caching
    const cacheKey=`${documentId||"all"}:${query}`;
    if(responseCache.has(cacheKey)){
        const cached = responseCache.get(cacheKey);
        return res.json({
               ...cached,
        metadata: {
            ...cached.metadata,
            fromCache: true
        }
        });
    }
     
    const chunks = documentId?await Chunk.find({documentId}):await Chunk.find();
    const scoredChunks = chunks.map(chunk=>{
    const vectorScore=cosineSimilarity(queryEmbedding,chunk.embedding);
    const keywordMatchScore=keywordScore(query,chunk.text);
    const hybridScore=0.7*vectorScore+0.3*keywordMatchScore;
    return{
        text:chunk.text,
        score:hybridScore,};
    });
      
    scoredChunks.sort((a,b)=>b.score-a.score);
 
    const topChunks=scoredChunks.filter(c=>c.score>0.2).slice(0,3);// top 3 chunks
    if (topChunks[0]?.score < 0.18) {
   return res.json(`I don't know`);
};
    const contextTexts=topChunks.map(c=>c.text);
    const answer=await answerWithContext(query,contextTexts);

    const result={
        answer,sources:topChunks,
        metadata:{
            totalChunks:chunks.length,
            topScore:topChunks[0]?.score||0,
            fromCache:false,
        }
    }
     responseCache.set(cacheKey,result);
    res.json(result);
});

module.exports=router;
