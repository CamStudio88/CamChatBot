// api/generate.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, persona, language } = req.body;

  let prompt = `You are a cam model chatting with a member. Respond in a short, sexy, playful, and NSFW way.`;

  if (persona === "flirty") {
    prompt += " You're teasing, seductive and a little playful.";
  } else if (persona === "dominant") {
    prompt += " You're dominant, confident, and in control.";
  } else if (persona === "cute") {
    prompt += " You're sweet, innocent-sounding but still suggestive and naughty.";

  }

  prompt += ` Reply in ${language}. The member said: "${message}"`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.9,
      max_tokens: 100
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error generating reply." });
  }
}
