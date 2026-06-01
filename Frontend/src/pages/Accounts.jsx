import React, { useEffect, useState } from "react";
import { dummyAccountsData, PLATFORMS } from "../assets/assets.jsx";
import { PlusIcon } from "lucide-react";
import AccountList from "../components/AccountList.jsx";
import PlatformPickerModel from "../components/PlatformPickerModel.jsx";
const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [connecting, setConnecting] = useState("");
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  useEffect(() => {
    const fetchAccountData = async () => {
      setAccounts(dummyAccountsData);
    };
    fetchAccountData();
  }, []);

  const handleConnect = async (platformId) => {
    setConnecting(platformId);
    setTimeout(() => {
      setConnecting(null);
      setAccounts((prev) => [...prev,]);
      showPlatformPicker(false);
    }, 1000);
  };

  const handleDisconnect = async (accountId) => {
    setAccounts(accounts.filter((a) => a._id !== accountId));
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
