import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";

export default async function handle(req, res) {
  if (req.method === "POST") {
    handlePOST(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// GET /api/post/:id
async function handlePOST(req, res) {
  const user = req.body;
  let password = await bcrypt.hash(user.password, 10);

  user.password = password;
  const newUser = await prisma.user.create({
    data: user,
  });
  res.json(newUser);
}
