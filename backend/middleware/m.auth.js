import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = JsonWebTokenError.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ message: err.message || "Not authorized , token failed" });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized , token failed",
    });
  }
};
