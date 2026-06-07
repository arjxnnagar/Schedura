import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { generateAuthUrl, syncAccount } from "../controllers/socialController.js";
import { protect } from "../middleware/m.auth.js";
import { addAccount, disconnectAccount, getAccounts } from "../controllers/accountController.js";
import { generatePost, getGenerations, getPosts, schedulePosts } from "../controllers/postController.js";
import { upload } from "../config/multer.js";
import { getActivity } from "../controllers/activityController.js";

const mainRouter = express.Router();

mainRouter.get("/",(req,res)=>{
    res.send("Server is live");
})

mainRouter.post("/users/register",registerUser);
mainRouter.post("/users/login", loginUser);
mainRouter.get("/socials/sync",protect,syncAccount);
mainRouter.get("/socials/:platform", protect, generateAuthUrl);
mainRouter.get("/accounts", protect, getAccounts);
mainRouter.post("/accounts", protect, addAccount);
mainRouter.delete("/accounts/:id", protect, disconnectAccount);
mainRouter.get("/posts",protect,getPosts);
mainRouter.get("/posts/generations", protect, getGenerations);
mainRouter.post("/posts/generate", protect, generatePost);
mainRouter.post("/schedule-posts", protect, upload.single("media") ,schedulePosts);
mainRouter.get("/activity",protect,getActivity);



export default mainRouter;