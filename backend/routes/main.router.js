import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const mainRouter = express.Router();

mainRouter.get("/",(req,res)=>{
    res.send("Server is live");
})

mainRouter.post("/register",registerUser);
mainRouter.post("/login", loginUser);

// mainRouter.get("",);
// mainRouter.get("",);
// mainRouter.get("",);
// mainRouter.get("",);
// mainRouter.get("",);
// mainRouter.get("",);
// mainRouter.get("",);

export default mainRouter; 