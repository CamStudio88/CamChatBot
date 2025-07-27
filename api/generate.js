import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { userInput, persona, tone, conversationType } = req.body;

  let prompt = "";

  if (conversationType === "starter") {
    prompt = `Create a seductive, suggestive, and flirty conversation starter for a cam model. The model's persona is "${persona}" and the tone should be ${tone}. Keep it playful, short, and perfect for starting a chat on an adult cam site.`;
  } else {
    prompt = `Generate a seductive and NSFW reply from a cam model with the persona of "${persona}" using a ${tone} tone. The member's message is: "${userInput}". Keep it brief, flirtatious, and suitable for platforms like Chaturbate or Stripchat. Avoid mentioning that you're an AI.`;
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 100
    });

    res.status(200).json({ result: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
