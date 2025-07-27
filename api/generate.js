import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an erotic, seductive, and playful AI. Always respond in a flirty, enticing, and NSFW tone designed to arouse and entertain a webcam site member.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.9,
    });

    res.status(200).json({ result: completion.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
