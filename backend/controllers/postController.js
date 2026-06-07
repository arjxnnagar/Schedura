import { configDotenv } from "dotenv";
configDotenv();
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { cloudinary } from "../config/clodinary.js";
import Generation from "../models/generationModel.js";
import Post from "../models/postModel.js"


const pollLeonardoJob = async (generationId , apiKey) =>{
    const maxRetries = 20;
    const delay = 5000;

    for(let i=0;i<maxRetries;i++){
        try {
            const response = await axios.get(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId} `,{
                headers:{
                    accept: "application/json",
                    authorization:`Bearer ${apiKey}`,
                }
            })

            const generation = response.data.generation_by_pk;
            if(generation.status === "COMPLETE"){
                if(generation.generate_image && generation.generate_image.length >0){
                    return generation.generate_image[0].url;
                }
                throw new Error("Generation Complete but no image Found")
            }
             if(generation.status === "FAILED"){
                throw new Error("Leonardo.ai Generation Failed");
             }
        } catch (err) {
            console.error("Polling Error",err.response.data || err.message);
        }

        await new Promise((resolve)=>setTimeout(resolve,delay));
    }

    throw new Error("Leonardo.ai generation Timeout");

}
 


export const generatePost = async (req, res) => {
  try {
    const { prompt, tone, generateImage } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(400).json({ message: "Gemini API key is missing." });
    }
    const ai = new GoogleGenAI({ apiKey });
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a social media post based on this prompt:${prompt}.
            The tonality of the image shoulr reflect ${tone}.
            The post should also include relevant hashtags.
            Format the response as JSON with "content" and "imagePrompt" fields
            The "imagePrompt" should be a highly descriptive prompt for an image generator that complements the post.
            `,
    });
    let content = "";
    let imagePrompt = prompt;

    try {
      const rawText = textResponse.text || "";
      const jsonMatcth = rawText.match(/\{[\s\S]*\}/);
      const data = jsonMatcth
        ? JSON.parse(jsonMatcth[0])
        : { content: rawText, imagePrompt: prompt };
      content = data.content;
      imagePrompt = data.imagePrompt;
    } catch (e) {
      content = textResponse.text || "";
    }

    let mediaUrl = "";
    if (generateImage) {
      try {
        const leonardoKey = process.env.LEONARDO_API_KEY;
        if (leonardoKey) {
          const leoResponse = await axios.post(
            "https://cloud.leonardo.ai/api/rest/v2/generations",
            {
              public: false,
              model: "gpt-image-2",
              parameters: {
                quality: "LOW",
                prompt: imagePrompt,
                quantity: 1,
                width: 1024,
                height: 1024,
                prompt_enhance: "OFF",
              },
            },
            {
              headers: {
                accept: "application/json",
                authorization:`Bearer ${leonardoKey}`,
                "content-type": "application/json",
              },
            },
          );

          const generationId = leoResponse.data.generate.generationId;
          const tempUrl = await pollLeonardoJob(generationId,leonardoKey);

          const uploadResult = await cloudinary.uploader.upload(tempUrl,{
            folder:"Ai-generations",
          });

          mediaUrl = uploadResult.secure_url;
        }
      } catch (err) {
        console.error("Image Generation Failed",err.message);
      }
    }

    const generation = await Generation.create({
        user:req.user._id,
        prompt,
        content,
        mediaUrl,
        mediaType : mediaUrl? "image": undefined,
        tone
    })

    res.json(generation);

  } catch (err) {
    res.status(500).json({message:err.message || "Server Error"});
  }
};

export const getGenerations = async (req, res) => {
  
    try {
       const generations = await Generation.find({ user: req.user._id }).sort({
         createdAt: -1,
       });
        res.json(generations);
    } catch (err) {
        console.error("GET /posts/generations error:", err);

        res.status(500).json({
          success: false,
          message: "Failed to fetch generations",
          error: err.message,
        });
    }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({user:req.user._id})
    res.json(posts);
  } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
  }
};

export const schedulePosts = async (req, res) => {
  try {
        const {content , platforms , scheduledFor , status} = req.body;

        let parsedPlatforms = platforms;
        if(typeof platforms === "string"){
            try{
                parsedPlatforms = JSON.parse(platforms);
            }catch(e){
                parsedPlatforms = platforms.split(",");
            }
        }

        let mediaUrl = req.body.mediaUrl;
        let mediaType = req.body.mediaType;

        if (req.file){
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto",
                folder: "social-scheduler",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            );

            stream.end(req.file.buffer);
          });

          mediaUrl = result.secure_url;
          mediaType = result.resource_type === "video" ? "video" : "image";
        }

        const post = await Post.create({
          user: req.user._id,
          content,
          platform: parsedPlatforms,
          mediaUrl,
          mediaType,
          scheduledFor,
          status,
        });
        res.status(201).json(post);

  }
        catch (err) {
          console.log("FULL ERROR:");
          console.log(err);

          if (err.response) {
              console.log("STATUS:", err.response.status);
              console.log("DATA:", err.response.data);
          }

          res.status(500).json({
              message: err.message
          });
        };

}