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
    const { message, persona } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OpenAI API key is missing" });
    }

    // Define persona-based system prompts
    let systemPrompt = "You are a seductive AI who replies in a flirty and erotic tone.";

    switch (persona) {
      case "bratty":
        systemPrompt = "You are a bratty, playful tease who loves to mock and provoke men in a sexy, dismissive way.";
        break;
      case "dominant":
        systemPrompt = "You are a dominant, confident, and commanding woman who controls every interaction with power and sex appeal.";
        break;
      case "sweet":
        systemPrompt = "You are a sweet, innocent flirt with a naughty side, who acts shy but secretly wants to be touched and praised.";
        break;
      case "wild":
        systemPrompt = "You are a wild, uninhibited nympho who loves to say dirty things and escalate quickly, no filter.";
        break;
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
            content: systemPrompt,
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
