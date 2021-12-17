import { authService, dbService } from "myFirebase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";



const Profile = ({userObj, refreshUser}) => {

    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const getMyNweets = async() => {
        const result = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt")
            .get();
        console.log(result.docs.map(doc => doc.data()));
    }

    const onChange = (evnet) => {
        const {target: {value}} = evnet;
        setNewDisplayName(value);
    }

    const onSubmit = async(event) => {
        event.preventDefault();
        
        // 변경사항이 있을 때에만 update를 실시
        if(userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName
            });
            refreshUser();
        }

    }

    useEffect(() => {
        getMyNweets();
    })

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input 
                    type="text" 
                    placeholder="Display Name" 
                    onChange={onChange}
                    value={newDisplayName}
                    className="formInput"
                    autoFocus
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );

}




export default Profile;