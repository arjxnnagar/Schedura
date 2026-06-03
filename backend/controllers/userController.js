import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import generateToken from "../config/jwt.js";

export const registerUser = async (req, res,next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing Credentials" });
    }

    const user = await User.findOne({ email });
    if (user) {
        res.status(400);
        throw new Error("User Exists")
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email: email,
      name,
      password: hashedpass,
    });

    const token = generateToken(newUser._id);
    res
      .status(201)
      .json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token,
      });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Missing Credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const hashedpass = user.password;
    const isPass = await bcrypt.compare(password,hashedpass);
    
    if(isPass){
        const token = generateToken(user._id);
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
        });
    }else{
        return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server Error" });
  }
};