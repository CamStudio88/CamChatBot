import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { userInput, persona, tone } = req.body;

  const prompt = `Generate a seductive and NSFW reply from a cam model with the persona "${persona}" using a ${tone} tone. The member said: "${userInput}". Keep it brief, flirtatious, and suitable for adult cam sites. Do not mention you are AI.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 120,
    });

    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
