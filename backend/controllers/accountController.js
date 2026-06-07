import Account from "../models/accountModel.js";
import zernio from "../config/zernio.js";

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id });
    const sanitizedAccounts = accounts.map((account) => {
      const plainAccount = account.toObject();
      return {
        ...plainAccount,
        status: plainAccount.status || "connected", // Fallback for OAuth synced records
      };
    });

    res.json(sanitizedAccounts);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
};
export const addAccount = async (req, res) => {
  try {
    const { platform, handle, avatarUrl } = req.body;

    const account = await Account.create({
      user: req.user._id,
      platform,
      handle,
      avatarUrl,
      status:"connected",
    });
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
};

export const disconnectAccount = async (req, res) => {
  try {

    const account = await Account.findOne({ _id: req.params.id , user:req.user._id });
    if(account.zernioAccountId){
        try {
            await zernio.accounts.deleteAccount({
                path:{accountId:account.zernioAccountId}
            })
        } catch (err) {
            res.status(500).json({ message: err.message || err.response.data.messgae});
            return;
        }
    }else{
        res.status(404).json({message:"Account not Found"});
        return;
    }

    await account.deleteOne();

    res.json({message:"Account disconnected successfully"});
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
};