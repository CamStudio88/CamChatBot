import jwt from 'jsonwebtoken';

let users = {
  admin: { password: "admin123", role: "admin" },
  model1: { password: "modelpass", role: "model" },
};

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: "Missing token" });

  const token = authorization.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (decoded.role !== "admin") return res.status(403).json({ error: "Not authorized" });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  if (users[username]) return res.status(400).json({ error: "User already exists" });

  users[username] = { password, role: "model" };
  res.status(200).json({ message: "User created" });
}
