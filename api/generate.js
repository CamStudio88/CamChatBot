export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, persona, language } = req.body;

  if (!message || !persona || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `You are a seductive webcam model. Your persona is ${persona}. You reply in ${language}. 
  Keep it short, engaging, playful, and human-like. Here is the user's message: "${message}"`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ reply: data.choices[0].message.content.trim() });
    } else {
      res.status(500).json({ error: "No response from OpenAI" });
    }
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
