import authenticated from "../../../components/authenticationCheck";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "GET") {
    authenticated(handleGET(res));
  } else if (req.method === "POST") {
    handlePOST(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// GET /api/company
async function handleGET(res) {
  const company = await prisma.company.findMany();
  res.json(company);
}

async function handlePOST(req, res) {
  const company = req.body;
  var result = await prisma.company.create({
    data: company,
  });

  res.json(result);
}
