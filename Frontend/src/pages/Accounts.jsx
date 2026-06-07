import React, { useEffect, useState } from "react";
import { PLATFORMS } from "../assets/assets.jsx";
import { PlusIcon } from "lucide-react";
import AccountList from "../components/AccountList.jsx";
import PlatformPickerModel from "../components/PlatformPickerModel.jsx";
import toast from "react-hot-toast";
import api from "../api/axios.js"


const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [connecting, setConnecting] = useState("");
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

   const fetchAccountData = async (isSync, platform, successMsg) => {
     try {
       if (isSync) {
         const label = platform
           ? platform.charAt(0).toUpperCase() + platform.slice(1)
           : "Social Media";
         toast.loading(`Syncing ${label} account...`, { id: "sync" });
         await api.get("/socials/sync");
         toast.success(successMsg || "Accounts synced!", { id: "sync" });
       }
       const { data } = await api.get("/accounts");
       setAccounts(data);
     } catch (err) {
       toast.error(err.message || "Failed to load Accounts");
     }
   };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedPlatform = params.get("connected");
    const connectedUsername = params.get("username");
    const syncNeeded  = params.get("sync") === "true";
    const errorMsg = params.get("error");

    window.history.replaceState({},document.timeline,window.location.pathname);

    if(connectedPlatform){
      const label = connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1);
      const handle = connectedUsername ? `(@${connectedUsername})` :""
      fetchAccountData(true,connectedPlatform,`${label}${handle} connected`);
    }else if(errorMsg){
      toast.error(`Connection Failed :${decodeURIComponent(errorMsg)}`);
      fetchAccountData();
    }else if(syncNeeded){
      fetchAccountData(true,null,"Accounts Synced");
    }else{
      fetchAccountData();
    }
  }, []);

  const handleConnect = async (platformId) => {
    setConnecting(platformId);
    try {
        const { data } = await api.get(`/socials/${platformId}`);
        window.location.href = data.url;
    } catch (err) {
      toast.error(err.message || `Failed to Connect ${platformId}`)
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId) => {
    try {
      await api.delete(`/accounts/${accountId}`);
      toast.success("Account Disconnected");
      await fetchAccountData();
    } catch (err) {
        toast.error(err.message ||  `Failed to Disconnect Account`);
    }
  };

  const connectedIds = accounts.map((a) => a.platform);

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
        <div>
          <h2 className="text-xl text-slate-900">Connected Accounts</h2>
          <p className="text-sm mt-0.5 text-slate-500">
            {accounts.length} of {PLATFORMS.length} platforms connected
          </p>
        </div>
        <button
          onClick={() => {
            setShowPlatformPicker(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center"
        >
          <PlusIcon className="size-4" /> Connect account
        </button>
      </div>

      {showPlatformPicker && (
        <PlatformPickerModel
          connectedIds={connectedIds}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}

      <AccountList accounts={accounts} onDisconnect={handleDisconnect} />
    </div>
  );
};

export default Accounts;
