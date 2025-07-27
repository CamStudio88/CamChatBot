export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OpenAI API key is missing" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an erotic, seductive, and playful AI. Always respond in a flirty, enticing, and NSFW tone designed to arouse and entertain a webcam site member.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.9,
      }),
    });

    const data = await response.json();

    console.log("OpenAI raw response:", JSON.stringify(data, null, 2));

    const result = data?.choices?.[0]?.message?.content;

    if (!result) {
      return res.status(200).json({ result: "⚠️ AI returned no result. Try again." });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
