import { parse } from 'querystring';

export const config = {
  api: {
    bodyParser: false, // disable default Next.js JSON parser
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  // Manually read raw request body (URL encoded)
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  const parsedBody = parse(body);

  const userInput = parsedBody.userInput || '';
  const persona = parsedBody.persona || 'submissive';
  const tone = parsedBody.tone || 'young';

  if (!userInput) {
    res.status(400).send('Missing userInput');
    return;
  }

  const prompt = `Generate a seductive and NSFW reply from a cam model with the persona "${persona}" using a ${tone} tone. The member said: "${userInput}". Keep it brief, flirtatious, and suitable for adult cam sites. Do not mention you are AI.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("OpenAI API error response:", errorDetails);
      throw new Error("OpenAI API request failed");
    }

    const data = await response.json();

    // Send plain text response (not JSON)
    res.status(200).send(data.choices[0].message.content.trim());
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).send('Failed to generate response');
  }
}
