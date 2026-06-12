import { configDotenv } from "dotenv";
configDotenv();
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import cloudinary from "../config/cloudinary.js";
import Generation from "../models/generationModel.js";
import Post from "../models/postModel.js";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pollLeonardoJob = async (generationId, apiKey) => {
  const maxRetries = 30;

  for (let i = 0; i < maxRetries; i++) {
    const response = await axios.get(
      `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          accept: "application/json",
        },
      },
    );

    console.log("Polling Response:", JSON.stringify(response.data, null, 2));

    const generation =
      response.data.generations_by_pk || response.data.generation_by_pk;

    if (!generation) {
      throw new Error("Generation data missing");
    }

    if (generation.status === "COMPLETE") {
      const image =
        generation.generated_images?.[0] || generation.generate_image?.[0];

      if (!image?.url) {
        throw new Error("Image generated but URL missing");
      }

      return image.url;
    }

    if (generation.status === "FAILED") {
      throw new Error("Leonardo generation failed");
    }

    await sleep(5000);
  }
  throw new Error("Leonardo generation timeout");
};

export const generatePost = async (req, res) => {
  try {
    const { prompt, tone, generateImage } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        message: "Gemini API key is missing.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const textResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a social media post based on this prompt: ${prompt}.
        Tone: ${tone}
        Return ONLY valid JSON:
        {
          "content": "...",
          "imagePrompt": "..."
        }`,
    });

    let content = "";
    let imagePrompt = prompt;

    try {
      const rawText = textResponse.text || "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);

      const data = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : {
            content: rawText,
            imagePrompt: prompt,
          };

      content = data.content;
      imagePrompt = data.imagePrompt;
    } catch {
      content = textResponse.text || "";
    }

    let mediaUrl = "";

    if (generateImage) {
      const leonardoKey = process.env.LEONARDO_API_KEY;

      if (!leonardoKey) {
        throw new Error("LEONARDO_API_KEY missing");
      }

      console.log("Starting Leonardo generation...");

      const generationResponse = await axios.post(
        "https://cloud.leonardo.ai/api/rest/v1/generations",
        {
          prompt: imagePrompt,
          width: 1024,
          height: 1024,
          num_images: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${leonardoKey}`,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );

      const generationId =
        generationResponse.data.sdGenerationJob?.generationId ||
        generationResponse.data.generate?.generationId;

      if (!generationId) {
        throw new Error("Leonardo generationId missing");
      }

      const imageUrl = await pollLeonardoJob(generationId, leonardoKey);

      console.log("Generated Image URL:", imageUrl);

      const uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: "Ai-generations",
      });

      mediaUrl = uploadResult.secure_url;

      console.log("Cloudinary Upload Success:", mediaUrl);
    }

    console.log("MEDIA URL BEFORE SAVE:", mediaUrl);

    const generation = await Generation.create({
      user: req.user._id,
      prompt,
      content,
      mediaUrl: mediaUrl,
      mediaType: mediaUrl ? "image" : undefined,
      tone,
    });

    console.log("SAVED DOCUMENT:", generation);

    return res.status(201).json(generation);
  } catch (err) {
    console.error("GENERATE POST ERROR:", err);

    return res.status(500).json({
      message: err.message || "Server Error",
    });
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
    const posts = await Post.find({ user: req.user._id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
};

export const schedulePosts = async (req, res) => {

  try {
    const { content, platforms, scheduledFor, status } = req.body;

    let parsedPlatforms = platforms;
    if (typeof platforms === "string") {
      try {
        parsedPlatforms = JSON.parse(platforms);
      } catch (e) {
        parsedPlatforms = platforms.split(",");
      }
    }

    let mediaUrl = req.body.mediaUrl;
    let mediaType = req.body.mediaType;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        console.log("CLOUDINARY CONFIG:");
        console.log(cloudinary.config());
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "social-scheduler",
          },
          (error, result) => {
           console.log("CLOUDINARY CALLBACK");
           console.log("ERROR:", error);
           console.log("RESULT:", result);

           if (error) reject(error);
           else resolve(result);
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
  } catch (err) {
    console.log("================================");
    console.log("FULL ERROR");
    console.dir(err, { depth: null });
    console.log("================================");

    res.status(500).json({
      message: err.message,
    });
  }
};