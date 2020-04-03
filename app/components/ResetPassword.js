import React, {Component} from 'react';
import { Button, Form } from 'react-bootstrap';
import MakePOST from "./wrappers/RequestWrapper";
import {NotificationManager} from 'react-notifications';

export default class MatchDetailPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ""
        }
    }

    handleEmailChange = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    render() {
        return (
            <div style={{paddingTop: "2vh", paddingBottom: "2vh", textAlign: "center"}}>
            <p className="welcomeText">Enter your email ID</p>

            <Form.Group controlId="fname" style={{display: "inline-block"}}>
				<Form.Control type="text" placeholder="Email ID" value={this.state.email} onChange={this.handleEmailChange} style={{width: "15cd ..vw"}}/>
			</Form.Group>
            <br />
            <Button className="homeButton" style={{marginRight: "1vw", width: "5vw", marginTop: "3vh"}} onClick={() => {
                MakePOST("lostpassword", {
                    email: this.state.email
                }, (data) => {
                    if(data.status == 0) {
                        NotificationManager.success("Check your inbox for instructions to log back in!", "Reset email sent", 5000);
                        this.props.close();
                    } else {
                        NotificationManager.failure("No account found associated with this email ID", "Reset Error", 5000);
                    }
                })
            }}>Reset</Button>
            <Button className="homeButton" style={{marginLeft: "1vw", width: "5vw", marginTop: "3vh"}} onClick={this.props.close}>Close</Button>
        </div>
        );
    }
}