import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import MakePOST from "../wrappers/RequestWrapper";
import {NotificationManager} from 'react-notifications';

export default function MatchDetailPopup(props) {
    return (
        <div style={{paddingTop: "3vh", paddingBottom: "3vh"}}>
            <img src={props.data.photo_url} className="profilePicture"/>
            <p className="welcomeText">{props.data.name}</p>
            <div style={{marginTop: "2vh", marginBottom: "2vh"}}>
                <span style={{marginRight: "1vw"}}>Instagram: {props.data.instagram_id ? props.data.instagram_id : "N/A"}</span>
                <span style={{marginRight: "1vw"}}>Snapchat: {props.data.snapchat_id ? props.data.snapchat_id : "N/A"}</span>
            </div>
            <Button className="homeButton" style={{marginRight: "2vh", width: "5vw"}} onClick={() => {
                MakePOST("deleteusermatch", {
                    user_1: props.auto_id,
                    user_2: props.data.auto_id
                }, (data) => {
                    if(data.status == 0) {
                        NotificationManager.success("Friend sucessfully deleted!", "Delete successful", 5000);
                        props.handleDelete();
                    } else {
                        NotificationManager.failure("An unknown error occured - please try again later", "Delete failed", 5000);
                    }
                })
            }}>Remove</Button>
            <Button className="homeButton" style={{marginLeft: "2vh", width: "5vw"}} onClick={props.close}>Close</Button>
        </div>
    );
}