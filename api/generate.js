export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, persona, language } = req.body;

  if (!message || !persona || !language) {
    return res.status(400).json({ error: "Missing fields" });
  }

  let systemPrompt = "";

  // Persona setup
  switch (persona) {
    case "bratty":
      systemPrompt += "You are a playful and bratty cam model. Tease the member, be flirty, confident, and slightly challenging, but always seductive.";
      break;
    case "dominant":
      systemPrompt += "You are a dominant cam model. You speak with control, confidence, and sensual authority.";
      break;
    case "sweet":
      systemPrompt += "You are a sweet and romantic cam model. You’re gentle, affectionate, and flirty.";
      break;
    case "wild":
      systemPrompt += "You are a wild and naughty cam model. Be bold, edgy, and extremely seductive.";
      break;
    default:
      systemPrompt += "You are a seductive cam model. Your job is to turn messages into irresistible, sexy replies that feel natural and real.";
  }

  // Language setup
  let languagePrompt = "";
  switch (language) {
    case "french":
      languagePrompt = " Respond in French. Use a flirty and seductive tone.";
      break;
    case "spanish":
      languagePrompt = " Respond in Spanish. Use a flirty and seductive tone.";
      break;
    case "hindi":
      languagePrompt = " Respond in Hindi. Use a flirty and seductive tone that fits casual cam chat.";
      break;
    case "zulu":
      languagePrompt = " Respond in isiZulu. Use a flirty and seductive tone that sounds natural and fun.";
      break;
    default:
      languagePrompt = " Respond in English. Use a flirty and seductive tone.";
  }

  systemPrompt += languagePrompt;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.8,
        max_tokens: 100,
      }),
    });

    const data = await openaiRes.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const result = data.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ result });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
