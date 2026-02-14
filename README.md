# RAG-Powered Knowledge Intelligence Backend

A backend system that ingests PDF/TXT documents, builds semantic indexes using transformer-based embeddings, and generates grounded answers using Retrieval-Augmented Generation (RAG).

This project focuses on retrieval engineering, LLM integration, hybrid ranking strategies, and backend production safeguards rather than UI or chatbot wrappers.

---

## Tech Stack

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- MiniLM (Sentence Transformers)  
- Groq-hosted LLM  
- pdf-parse  
- express-rate-limit  
- dotenv  

---

## Core Concepts Implemented

### Document Ingestion Pipeline

- Supports PDF and TXT uploads  
- Extracts raw text from files  
- Performs structured chunking with offset tracking  
- Stores documents separately from chunks  
- Maintains chunk-level indexing for scalable retrieval  

---

### Semantic Embeddings and Vector Search

- Generates MiniLM embeddings for each chunk  
- Uses cosine similarity for semantic ranking  
- Stores embeddings alongside chunk metadata  
- Enables meaning-based search beyond keyword matching  

---

### Hybrid Retrieval Strategy

- Combines:
  - Semantic similarity (vector embeddings)
  - Keyword overlap scoring  
- Hybrid scoring improves ranking precision  
- Prevents purely lexical or purely semantic failure cases  
- Only top-ranked chunks are passed to the LLM  

---

### Grounded LLM Response Generation

- Groq-hosted LLM used for answer generation  
- Strict context enforcement (LLM only sees retrieved chunks)  
- Reduces hallucination risk  
- Controls context size to manage token usage  

---

## High-ROI Production Features

### Response Caching

- In-memory caching of query responses  
- Avoids repeated LLM calls for identical queries  
- Reduces latency and inference cost  
- Designed to be replaceable with Redis for distributed deployments  

---

### Rate Limiting

- Query endpoint protected with request rate limiting  
- Prevents abuse and uncontrolled inference usage  
- Implemented as middleware before business logic  
- Easily extendable to per-user or per-document limits  

---

### Document Lifecycle Management

- Upload documents  
- List indexed documents  
- Retrieve document metadata by ID  
- Delete documents along with associated chunks  
- Track chunk count per document  

---

## Folder Structure

```
src/
├── config/
│   └── db.js
├── controllers/
│   └── ingestController.js
├── middleware/
│   ├── uploadMiddleware.js
│   └── rateLimit.js
├── models/
│   ├── Document.js
│   └── Chunk.js
├── routes/
│   ├── ingestRoutes.js
│   ├── queryRoutes.js
│   └── documentRoutes.js
├── services/
│   ├── chunker.service.js
│   ├── embeddingService.js
│   ├── similarity.service.js
│   ├── textExtractor.service.js
│   └── llm.service.js
└── server.js
```

---

## Key Design Decisions

### Why Chunk-Level Indexing

Large documents reduce retrieval precision.  
Chunking enables fine-grained semantic matching and better context control.

---

### Why Hybrid Retrieval Instead of Pure Vector Search

Pure embeddings may miss exact technical terms.  
Keyword scoring boosts lexical precision.  
Hybrid scoring balances recall and accuracy.

---

### Why No High-Level LLM Frameworks

Retrieval, embedding, and ranking logic are implemented manually.  
This ensures transparency and avoids hidden orchestration complexity.

---

### Why In-Memory Caching

Designed for clarity and demonstration.  
Easily replaceable with Redis for multi-instance deployments.

---

## What This Project Is Not

- Not a chatbot UI  
- Not a frontend-heavy demo  
- Not a vector database benchmark  
- Not an over-engineered distributed system  

This project demonstrates controlled LLM integration and retrieval-focused backend architecture.

---

## Possible Extensions

- Redis-backed distributed caching  
- Dedicated vector database (FAISS / Qdrant)  
- Per-user document isolation  
- Background ingestion queue  
- Streaming LLM responses  

---

## Author

**Devarasetty Sairam**

- GitHub: https://github.com/sairam676  
- LinkedIn: https://linkedin.com/in/sairamdevarasetty676  
