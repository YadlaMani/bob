import { React, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
const Profile = () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
  }
  async function handleWithdraw(e){
    e.preventDefault();
    const response=await axios.get("http://localhost:5555/api/v1/user/withdraw",{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success(response.data.message);

  }
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  async function fetchUserDetails() {
    const response = await axios.get(
      "http://localhost:5555/api/v1/user",

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
      "http://localhost:5555/api/v1/user/quests",
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
              <button  className="border-2 " onClick={(e)=>{
                handleWithdraw(e);
              }}>Withdraw</button>
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
        </div>
      ) : (
        <div>loading</div>
      )}
    </div>
  );
};

export default Profile;
