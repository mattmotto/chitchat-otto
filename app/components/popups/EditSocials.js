import React, {Component} from 'react';
import { Button, Form } from 'react-bootstrap';
import MakePOST from "../wrappers/RequestWrapper";
import {NotificationManager} from 'react-notifications';

export default class EditSocials extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instagram: "",
            snapchat: ""
        }
    }

    componentWillMount() {
        MakePOST("getuserinfo", {
            auto_id: this.props.userData.auto_id
        }, (data) => {
            if(status == 0) {
                this.setState({
                    instagram: data.data.instagram_id,
                    snapchat: data.data.snapchat_id
                })
            }
        })
    }

    handleInstagramChange = (event) => {
        this.setState({
            instagram: event.target.value
        })
    }
    
    handleSnapchatChange = (event) => {
        this.setState({
            snapchat: event.target.value
        })
    }

    render() {
        return (
            <div style={{paddingTop: "2vh", paddingBottom: "2vh", textAlign: "center"}}>
            <p className="welcomeText">Change Your Social Media Accounts</p>

            <Form.Group controlId="fname" style={{display: "inline-block", marginRight: "1vw"}}>
				<Form.Control type="text" placeholder="Instagram Account" value={this.state.instagram} onChange={this.handleInstagramChange}/>
			</Form.Group>

            <Form.Group controlId="fname" style={{display: "inline-block", marginLeft: "1vw"}}>
				<Form.Control type="text" placeholder="Snapchat Account" value={this.state.snapchat} onChange={this.handleSnapchatChange}/>
			</Form.Group>
            
            <br />

            <Button className="homeButton" style={{marginRight: "1vw", width: "5vw", marginTop: "3vh"}} onClick={() => {
                MakePOST("updatesocialmedia", {
                    user: this.props.userData.auto_id,
                    snapchat_id: this.state.snapchat,
                    instagram_id: this.state.instagram
                }, (data) => {
                    if(data.status == 0) {
                        NotificationManager.success("Your social media accounts have been sucessfully updated!", "Sucessful Update", 5000);
                        this.props.fixSM(this.state.snapchat, this.state.instagram);
                        this.props.close();
                    } else {
                        NotificationManager.success("An unforseen error occured. Please try again later.", "Unsucessful Update", 5000);
                    }
                })
            }}>Change</Button>
            <Button className="homeButton" style={{marginLeft: "1vw", width: "5vw", marginTop: "3vh"}} onClick={this.props.close}>Close</Button>
        </div>
        );
    }
}