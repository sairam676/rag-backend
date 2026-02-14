function cosineSimilarity(a,b){
   if (!Array.isArray(a) || !Array.isArray(b)) return 0;
   const len = Math.min(a.length, b.length);
   if(len==0)return 0;

   let dot=0,normA=0,normB=0;

   for(let i=0;i<len;i++){
    dot+=a[i]*b[i];
    normA+=a[i]*a[i];
    normB+=b[i]*b[i];
   }
   if (normA === 0 || normB === 0) return 0;

   return dot/(Math.sqrt(normA)*Math.sqrt(normB));
   
}

function keywordScore(query,text){
   const queryWords=query.toLowerCase().split(/\W+/);
   const textLower=text.toLowerCase();

   let matchCount=0;

   for(let word of queryWords){
      if(word&&textLower.includes(word)){
         matchCount++;

      }
   }

   return matchCount/queryWords.length;
}

module.exports={cosineSimilarity,keywordScore};