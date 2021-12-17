import { dbService, storageService } from "myFirebase";
import React from "react";
import {useState} from "react";
import {v4 as uuidv4} from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {

    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");


    const onSubmit = async(event) => {
        
        if (nweet === "") {
            return;
        }

        event.preventDefault();
        
        // 이미지 업로드 추가하기 전 코드 부분
        /*
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid
        });
        setNweet("");
        */

        // Logic : 이미지 업로드가 있는지 확인 후, 있다면 그 이미지의 URL을 nweet에 같이 첨부
        // 이미지 URL은 firebase의 storage에 저장!

        let attachmentUrl = "";

        if(attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }

        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }

        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");

    }


    const onChange = (event) => {
        const {target:{value}} = event;
        setNweet(value);
    }


    const onFileChange = (event) => {
        const {target:{files}} = event;
        const theFile = files[0];
        console.log(theFile);
        const reader = new FileReader();
        reader.onloadend = (finishiedEvent) => {
            console.log(finishiedEvent);
            const {currentTarget: {result}} = finishiedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }


    const onClearAttachment = () => {
        setAttachment("");
    }



    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                <img
                  src={attachment}
                  alt="attachmentImage"
                  style={{
                    backgroundImage: attachment,
                  }}
                />
                <div className="factoryForm__clear" onClick={onClearAttachment}>
                  <span>Remove</span>
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              </div>
            )}
        </form>
    );

}

export default NweetFactory