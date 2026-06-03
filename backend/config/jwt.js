import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"});
}

export default generateToken;