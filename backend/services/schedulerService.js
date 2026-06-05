import cron from "node-cron";
import Post from "../models/postModel.js";
import Account from "../models/accountModel";
import zernio from "../config/zernio";
import ActivityLog from "../models/activityLogModel";

export const initSchedular = ()=>{
    cron.schedule("* * * * *",async()=>{
        try {
            const now = new Date();
            const postsToPublish = await Post.find({status:"scheduled",scheduledFor:{$lte:now}});

            for (const post of postsToPublish) {
                try{
                    const accounts  = await Account.find({
                        user:post.user,
                        platform : {$in: post.platforms},
                        status:"connected",
                        zernioAccountId:{$exists: true}
                    })

                    if(accounts.length === 0){
                        console.log(`No connected Zernio accounts form post ${post._id} `)
                        continue;
                    }
                    const zernioPlatforms = accounts.map((acc)=>({
                        tform : acc.platform,
                        accountId:acc.zernioAccountId
                    }))
                    const payload = {
                        content : post.content,
                        publishNow :true,
                        ...(post.medaiUrl ? {mediaItems : [{type:post.mediaType || "image",url:post.medaiUrl}]} :{}),
                        platforms:zernioPlatforms,
                    }
                    console.log(`Publishing post ${post._id} to Zernio with media :${post.medaiUrl || "none"}`)
                    
                    const resposne = await zernio.posts.createPost({
                        body:payload
                    })
                    const publishedPost = response.data.post || response.data;

                    if(!publishedPost){
                        throw new Error("Failed to get post object from Zernio Response");
                    }

                    console.log(`Zernio post Created : ${publishedPost._id || publishedPost.id}`);

                    post.status ="published";
                    await post.save();
                    await Activitylog.create({
                        user: post.user,
                        actionType: "POST_PUBLISHED",
                        description: `Published post to $(accounts. map( (a) => a.platform).join(", ")}`,
                        relatedPost: post._id,
                    })

                }catch(e){
                    console.error(`Failed to publish Post${post._id}:`,e.response.data || e.message)
                    post.status="failed";
                    await post.save();
                }
            }
            if(postsToPublish.length > 0){
                console. log(`Evaluated $(postsToPublish.length} posts at ${now.toIsoString() }`);
            }

        } catch (err) {
            console.error("error in Scheduler",err);
        }
    })
    console.log("Schedura service initialized");
}