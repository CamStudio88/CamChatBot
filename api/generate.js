export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await req.json?.() ?? await new Response(req.body).json();
    const { message } = body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an erotic, seductive, and playful AI. Always respond in a flirty, enticing, and NSFW tone designed to arouse and entertain a webcam site member."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.choices?.[0]?.message?.content || "No result." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal server error." });
  }
}
