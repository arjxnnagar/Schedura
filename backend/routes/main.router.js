import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { generateAuthUrl, syncAccount } from "../controllers/socialController.js";
import { protect } from "../middleware/m.auth.js";
import { addAccount, disconnectAccount, getAccounts } from "../controllers/accountController.js";

const mainRouter = express.Router();

mainRouter.get("/",(req,res)=>{
    res.send("Server is live");
})

mainRouter.post("/user/register",registerUser);
mainRouter.post("/user/login", loginUser);
mainRouter.get("/socials/:platform",protect,generateAuthUrl);
mainRouter.get("/socials/sync",protect,syncAccount);
mainRouter.get("/accounts", protect, getAccounts);
mainRouter.post("/accounts", protect, addAccount);
mainRouter.post("/accounts/:id", protect, disconnectAccount);

export default mainRouter; 