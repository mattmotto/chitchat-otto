import React, {Component} from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Popup from "reactjs-popup";

import ChangePassword from "./popups/ChangePassword"
import EditSocials from "./popups/EditSocials"
import UploadProfile from "./popups/UploadProfile"

import "../styles/settings.css"

export default class UserSettings extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="settingsContainer">
                <img src={this.props.userData.photo_url} className="profilePicture"/>
                <p className="welcomeText">Welcome, {this.props.userData.name}!</p>
                <Popup trigger={
                                 <Button className="homeButton" style={{marginTop: "2vh", marginBottom: "2vh", width: "13vw"}}>Change Your Profile Picture</Button>
                                } modal closeOnDocumentClick position="top center">
                                    {close => (
                                        <UploadProfile close={close} userData={this.props.userData} refreshData={this.props.refreshData}/>
                                    )}
                                </Popup>
                <br />
                <Popup trigger={
                                 <Button className="homeButton" style={{marginBottom: "2vh", width: "13vw"}}>Edit Your Social Accounts</Button>
                                } modal closeOnDocumentClick position="top center">
                                    {close => (
                                        <EditSocials close={close} userData={this.props.userData} />
                                    )}
                                </Popup>
                <br />
                <Popup trigger={
                                 <Button className="homeButton" style={{width: "13vw"}}>Reset Your Password</Button>
                                } modal closeOnDocumentClick position="top center">
                                    {close => (
                                        <ChangePassword close={close} />
                                    )}
                                </Popup>
                <div className="footer">
                    <span>Please report any bugs/issues <a target="_blank" href="https://forms.gle/BTkzsgJenn5cvwYj9">here</a></span><br/>
                    <span>Shoutout to Natasha Levytska for <a href="https://dribbble.com/shots/4985430-Boredom">boredom</a> and Yimbo Escárrega for <a href="https://dribbble.com/shots/4143720-Waiting-around-to-die">Waiting around to die</a></span>
                </div>
            </div>
        );
    }
}