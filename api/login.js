import jwt from 'jsonwebtoken';

const users = {
  admin: "adminpassword123",  // CHANGE THIS before production
  model1: "model1password",
  model2: "model2password"
};

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  if (!(username in users) || users[username] !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });

  res.status(200).json({ token });
}
