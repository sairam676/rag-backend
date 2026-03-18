//convert raw file to text
const pdfParse=require("pdf-parse");

async function extractText(file){
    switch(file.mimetype){
        case "text/plain":
            return file.buffer.toString("utf-8");
        case "text/markdown":
            return file.buffer.toString("utf-8");
        case "application/pdf":
            const data = await pdfParse(file.buffer);
            return data.text;
        default:
            throw new Error("Unsupported file type for text extraction");
    }
}

module.exports=extractText;