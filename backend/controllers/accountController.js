import Account from "../models/accountModel.js";

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id });
    res.json(accounts);
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