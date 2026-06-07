import zernio from "../config/zernio.js";
import User from "../models/userModel.js";
import Account from "../models/accountModel.js";


const getOrCreateZernioProfile = async(user)=>{

    try{
        const result = await zernio.profiles.listProfiles();
        const data = result.data;
        const profiles = Array.isArray(data) ? data : data.profiles || data.data || [];

        if(profiles.length>0){
            const pid = profiles[0]._id || profiles[0].id;
            await User.findByIdAndUpdate(user._id , {zernioProfileId:pid});
            return pid;
        }

        const createResult = await zernio.profiles.createProfile({
            body :{name: `${user.name || user.email}'s workspace`}
        })

        const created = (createResult.data).profile || createResult.data;
        const pid = created._id || created.id;

        if(!pid){
            throw new Error("Failed to create Zerino profile - No Id returned");
        }

        await User.findByIdAndUpdate(user._id,{zernioProfileId:pid});
        return pid;
    }catch(err){
        console.error("getOrCreateZernioProfile Error",err.message || err);
        throw err;
    }
}

export const generateAuthUrl = async(req,res)=>{

    try{
        const {platform} = req.params;
        const profileId = await getOrCreateZernioProfile(req.user);

        const origin = req.headers.origin;
        const redirectUrl = `${origin}/accounts`;
        console.log("Platform received:", platform);
        const result = await zernio.connect.getConnectUrl({
            path : {platform:platform},
            query:{
                profileId,
                redirect_url: redirectUrl,
            }
        })

        const data = result.data;
        console.log("getConnectUrl response:",JSON.stringify(data));

        const authUrl = data.authUrl;
        if(!authUrl){
            throw new Error(`Zernio returned no authUrl .Full response :${JSON.stringify(data)}`);
        }
        res.json({url : authUrl})
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

export const syncAccount = async (req,res)=>{

    try{
        const profileId = await getOrCreateZernioProfile(req.user);
        const result = await zernio.accounts.listAccounts({profileId});

        const data = result.data;
        const zernioAccounts = data.accounts || (Array.isArray(data) ? data : []);
        const supportedPlaforms = ["twitter","linkedin","facebook","instagram"];
        const syncedAccounts = [];

        for(const zernioAccount of zernioAccounts){
            const zid = zernioAccount._id || zernioAccount.id;
            if(!zid){
                console.warn("Skipping Account with no Id:",zernioAccount);
                continue;
            }

            const rawPlatform = (zernioAccount.platform || zernioAccount.typr || "").toLowerCase();
            const normalizedPlatform = supportedPlaforms.find((p)=>rawPlatform.includes(p));

            if(!normalizedPlatform){
                console.log(`Skipping unsupported platform "${rawPlatform}" `);
                continue;
            }

            const account = await Account.findOneAndUpdate(
                {zernioAccountId : zid},
                {
                    user:req.user._id,
                    platform:normalizedPlatform,
                    handle: zernioAccount.username || zernioAccount.name || zernioAccount.handle || "unknown",
                    zernioAccountId:zid,
                    status :"connected",
                    avatarUrl: zernioAccount.avatarUrl || zernioAccount.picture || zernioAccount.profile_image_url,
                },
                {upsert:true,returnDocument:'after'}
            )
            syncedAccounts.push(account);
        }
        res.json(syncedAccounts)
    }catch(err){
        res.status(500).json({message: err.message || "Server Error"});
    }
}

