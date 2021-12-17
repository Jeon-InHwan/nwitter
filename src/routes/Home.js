import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService} from "myFirebase";
import React, { useEffect, useState } from "react";




const Home = ({userObj}) => {

    const [nweets, setNweets] = useState([]);
    
    
    // 실시간이 아닌, 예전 방식으로 nweets를 가져오는 function
    /*
    const getNweets = async() => {
        
        const dbNweets = await dbService.collection("nweets").get();
        
        dbNweets.forEach(document => {
            const nweetObject = {
                ...document.data(),
                id: document.id
            } 
            setNweets((prev) => [nweetObject, ...prev]);
        });
    }
    */


    useEffect(() => {
        // getNweets();
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const nweetArray = snapshot.docs.map(doc => ({
                id:doc.id, 
                ...doc.data()
            }));
            setNweets(nweetArray);
        });
    }, []);


    return (
        <div className="container">
            <NweetFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => ( 
                    <Nweet 
                        key={nweet.id} 
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}   
                    />
                ))}
            </div>
        </div>
    );

}



export default Home;