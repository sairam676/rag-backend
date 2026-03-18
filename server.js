const express = require("express");
const dotenv= require("dotenv");
const mongoose=require("mongoose");
const ingestRoutes=require("./routes/ingestRoutes");
const rateLimit=require("express-rate-limit");

require("dotenv").config();



mongoose.connect("mongodb://127.0.0.1:27017/rag-backend")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//rate limiting for ingestion
const ingestLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // max 5 uploads per minute
  message: {
    error: "Too many uploads. Slow down."
  }
});

app.use("/api/ingest",ingestLimiter,ingestRoutes);

//rate limiting for query
const queryLimiter=rateLimit({
    windowMs:60*1000,//1 min
    max:20,//max 20 req per min
    standardHeaders:true,
    legacyHeaders:false,
    message:{
        error:"Too many requests, please try again later."
    }
})

app.use("/api/query",queryLimiter,require("./routes/queryRoutes"));
app.use("/api/documents",require("./routes/documentRoutes"));
const PORT=process.env.PORT ||5050;
app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.staus(500).json({error:"Internal Server Error"});
})

app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`);});