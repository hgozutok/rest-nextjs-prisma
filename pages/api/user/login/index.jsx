import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";

var jwt = require("jsonwebtoken");

export default async function handle(req, res) {
  if (req.method === "POST") {
    handlePOST(req, res);
  } else {
    res.status(401).json({
      message: `The HTTP ${req.method} method is not supported at this route.`,
    });
  }
}

// GET /api/post/:id
async function handlePOST(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(401).json({ message: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Password is incorrect" });
  }
  let token = jwt.sign({ userId: user.id }, process.env.NEXT_PUBLIC_SECRET, {
    expiresIn: "1h",
  });
  let autToken = await prisma.verificationToken.create({
    data: {
      token: token,
      identifier: user.id,
      expires: new Date(Date.now() + 60 * 60 * 24),
    },
  });
  res.json({ ...user, token: autToken });
}
