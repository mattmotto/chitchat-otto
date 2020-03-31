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
				<Form.Control type="text" placeholder="Email ID" value={this.state.email} onChange={this.handleEmailChange}/>
			</Form.Group>
            <br />
            <Button className="homeButton" style={{marginRight: "1vw", width: "5vw", marginTop: "3vh"}} onClick={() => {
                console.log(this.state.email);
            }}>Reset</Button>
            <Button className="homeButton" style={{marginLeft: "1vw", width: "5vw", marginTop: "3vh"}} onClick={this.props.close}>Close</Button>
        </div>
        );
    }
}