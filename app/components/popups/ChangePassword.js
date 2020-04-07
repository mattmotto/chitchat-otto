import React, {Component} from 'react';
import { Button, Form } from 'react-bootstrap';
import MakePOST from "../wrappers/RequestWrapper";
import {NotificationManager} from 'react-notifications';
import Cookies from 'js-cookie';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            changedPass1: "",
            changedPass2: ""
        }
    }

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value
        })
    }
    
    handlecPasswordChange = (event) => {
        this.setState({
            changedPass1: event.target.value
        })
    }

    handlecPasswordChange2 = (event) => {
        this.setState({
            changedPass2: event.target.value
        })
    }

    render() {
        return (
            <div style={{paddingTop: "2vh", paddingBottom: "2vh", textAlign: "center"}}>
            <p className="welcomeText">Change Your Password</p>

            <Form.Group controlId="fname" style={{display: "inline-block"}}>
				<Form.Control type="password" placeholder="Old Password" value={this.state.password} onChange={this.handlePasswordChange}/>
			</Form.Group>
            <br />
            <Form.Group controlId="fname" style={{display: "inline-block"}}>
				<Form.Control type="password" placeholder="New Password" value={this.state.changedPass1} onChange={this.handlecPasswordChange}/>
			</Form.Group>
            <br />
            <Form.Group controlId="fname" style={{display: "inline-block"}}>
				<Form.Control type="password" placeholder="Confirm New Password" value={this.state.changedPass2} onChange={this.handlecPasswordChange2}/>
			</Form.Group>
            <br />
            <Button className="homeButton" style={{marginRight: "1vw", width: "5vw", marginTop: "3vh"}} onClick={() => {
                if(this.state.changedPass1 == this.state.changedPass2) {
                    MakePOST("changepassword", {
                        user: this.props.auto_id,
                        password: this.state.password,
                        newPass: this.state.changedPass1
                    }, (data) => {
                        if(data.status == 0) {
                            NotificationManager.success("Your password has been sucessfully changed", "Password Changed", 5000);
                            this.props.close();
                        } else if(data.status == 1) {
                            NotificationManager.error("Your old password is invalid - try again!", "Password Change Failed", 5000);
                        } else {
                            NotificationManager.error("An unexpected error occured. Please try later, and contact chitchat@chitchat.buzz if the error persists", "Password Change Failed", 5000);
                        }
                    })
                } else {
                    NotificationManager.error("Please make sure that your new passwords match!", "Reset Error", 5000);
                }
            }}>Change</Button>
            <Button className="homeButton" style={{marginLeft: "1vw", width: "5vw", marginTop: "3vh"}} onClick={this.props.close}>Close</Button>
        </div>
        );
    }
}