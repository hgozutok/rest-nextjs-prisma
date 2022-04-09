import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const companyId = req.query.id;

  if (req.method === "GET") {
    handleGET(companyId, res);
  } else if (req.method === "DELETE") {
    handleDELETE(companyId, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// GET /api/post/:id
async function handleGET(companyId, res) {
  const company = await prisma.company.findUnique({
    where: { id: Number(companyId) },
  });
  res.json(company);
}

// DELETE /api/post/:id
async function handleDELETE(companyId, res) {
  const company = await prisma.company.delete({
    where: { id: Number(companyId) },
  });
  res.json(company);
}
