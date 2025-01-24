import { React, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
const Profile = () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
  }
  const wallet = useWallet();
  if (!wallet) {
    toast.error("Connect wallet to withdraw");
  }

  async function handleWithdraw(e) {
    e.preventDefault();
    const data = {
      pubKey: wallet.publicKey,
    };
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/withdraw`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success(response.data.message);
  }
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  async function fetchUserDetails() {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setUser(response.data[0]);
  }
  async function fetchUserQuest() {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/quests`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setQuests(response.data);
  }
  useEffect(() => {
    fetchUserDetails();
    fetchUserQuest();
  }, []);
  return (
    <div>
      {user ? (
        <div>
          <div>
            <h1>Profile info</h1>
            <div>
              <h2>Username:{user.username}</h2>
              <h2>Email:{user.email}</h2>
              <h2>Earnings:{user.earnings}</h2>
              <h2>Balance:{user.balance}</h2>
              <button
                className="border-2 "
                onClick={(e) => {
                  handleWithdraw(e);
                }}
              >
                Withdraw
              </button>
            </div>
          </div>
          <div>
            {quests &&
              quests.map((quest) => (
                <a href="/questStats/:questId">
                  <div key={quest._id} className="border-2 mt-2">
                    <h2>{quest.title}</h2>
                    <h2>{quest.description}</h2>
                  </div>
                </a>
              ))}
          </div>
          <div>
            {user.earningsHistory &&
              user.earningsHistory.map((earning) => (
                <div>
                  <h2>{earning.time}</h2>
                  <h2>{earning.amount}</h2>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div>loading</div>
      )}
    </div>
  );
};

export default Profile;
