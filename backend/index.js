import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import mainRouter from "./routes/main.router.js";
import connectDB from "./config/db.js";
import { initSchedular } from "./services/schedulerService.js";

const app = express();
configDotenv();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({origin:"*"}));
app.use("/",mainRouter);


await connectDB();
initSchedular();

app.use((err,req,res,next)=>{
    console.error(err);
    res.status(res.statusCode || 500).json({message:err.message});
})

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT,()=>{
    console.log(`Server is live on http://localhost:${PORT}`)
})
}
export default app;
