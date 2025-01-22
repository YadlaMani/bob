import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { toast } from "sonner";


export default function Stats(){
    const [stats,setStats]=useState();
    const [quest,setQuest]=useState();
    const {questId}=useParams();
    // const [isLoading,setIsLoading]
    //fetching quest details
    async function fetchQuest(id){
        try{
            const response=await axios.get(`http://localhost:5555/api/v1/quests/${id}`);
            console.log(response.data);
            setQuest(response.data);

        }catch(err){
            toast.error("Failed to load stats");
        }
    }
    
    //fetching stats details
    async function getStats(){
        try{
            const response=await axios.get(`http://localhost:5555/api/v1/questStats/${questId}`,{
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
              fetchQuest(response.data.questId);
              console.log(response.data);
            
            setStats(response.data);

        }catch(err){
            toast.error("Failed to load stats");
        }
    }
    useEffect(()=>{
        getStats();
    },[questId]);
    return(
        <div>
            <h1>Stats Page</h1>
            
          
            
        </div>
    )
}