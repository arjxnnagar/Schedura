import {v2 as cloudinary} from "cloudinary"

console.log("CLOUDINARY CONFIG");
console.log({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  secret_exists: !!process.env.CLOUDINARY_SECRET_KEY,
});
console.log("SDK CONFIG");
console.log(cloudinary.config());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export {cloudinary};