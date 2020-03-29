import React, {Component} from 'react';
import { Button, Row, Col } from 'react-bootstrap';

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
                <Button className="homeButton" style={{marginTop: "2vh", marginBottom: "2vh", width: "13vw"}}>Change Your Profile Picture</Button> <br />
                <Button className="homeButton" style={{marginBottom: "2vh", width: "13vw"}}>Edit Your Social Accounts</Button> <br />
                <Button className="homeButton" style={{width: "13vw"}}>Reset Your Password</Button>
                <div className="footer">
                    <span>By Matthew Otto, Raghav Mecheri, and David Carratu</span><br />
                    <span>Shoutout to Natasha Levytska for <a href="https://dribbble.com/shots/4985430-Boredom">boredom</a> and Yimbo Escárrega for <a href="https://dribbble.com/shots/4143720-Waiting-around-to-die">Waiting around to die</a></span>
                </div>
            </div>
        );
    }
}