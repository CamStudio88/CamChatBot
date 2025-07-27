// api/login.js

import jwt from 'jsonwebtoken'

// Simulated user database (for testing)
// You should move this to a real DB later
const users = {
  admin: { password: "admin123", role: "admin" },
  model1: { password: "modelpass", role: "model" },
  model2: { password: "modelpass2", role: "model" }
}

// Secret key for signing JWTs
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" })
  }

  const user = users[username]

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  // Generate a JWT token with username and role
  const token = jwt.sign(
    { username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  )

  // Respond with token
  res.status(200).json({ token })
}
