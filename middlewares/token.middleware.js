import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided." });
  }

  const splitToken = token.split(" ");

  // Check if the token is in the correct format (Bearer <token>)
  if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
    return res
      .status(403)
      .json({ success: false, message: "Invalid token format." });
  }

  try {
    const decoded = jwt.verify(splitToken[1], process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

export default { verifyToken };
