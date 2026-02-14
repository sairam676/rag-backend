const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function answerWithContext(question, texts) {
  const context = texts.join("\n\n");

  const prompt = `
Answer the question using ONLY the provided context.

If the context contains information that partially answers the question,
extract the relevant parts and explain them clearly.

Do NOT say "I don't know" if relevant information exists.

Context:
${context}

Question:
${question}
`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "user", content: prompt }
    ],
  });

  return response.choices[0].message.content;
}

module.exports = answerWithContext ;
