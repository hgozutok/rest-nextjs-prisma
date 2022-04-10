import { verify } from "jsonwebtoken";

const authenticated = (fn) => async (req, res) => {
  verify(
    req.headers.authorization,
    process.env.NEXT_PUBLIC_SECRET,
    async function (err, decoded) {
      if (!err && decoded) {
        return await fn(req, res);
      }

      res.status(401).json({ message: "Sorry you are not authenticated" });
    }
  );
};

export default authenticated;
