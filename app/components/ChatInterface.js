import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import io from 'socket.io-client';
import { SocketHandler } from './SocketHandler';

import "../styles/chatinterface.css"

const ADRIAN = "https://media-exp1.licdn.com/dms/image/C4D03AQHoi-mm4-ACRg/profile-displayphoto-shrink_200_200/0?e=1590624000&v=beta&t=1gHCI1yim7uOg7KM68lO8kR_qM-GDyprRtysatWTSW0";

export default class ChatInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false
        }
    }

    isConnectedHandler = (onComplete) => {
        this.setState({
            connected: true
        }, () => {
            if(onComplete) {
                onComplete();
            }
        })
    }

    isDisconnectedHandler = (onComplete) => {
        this.setState({
            connected: false
        }, () => {
            if(onComplete) {
                onComplete();
            }
        })
    }
    
    componentDidMount() {
        const socket = io.connect('http://localhost:5000', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity
        });
        SocketHandler(socket, this.isConnectedHandler, this.isDisconnectedHandler);
    }



	render() {
        console.log("CONNECTED: "+this.state.connected);
		return (
		<div>
			<div className="left" style={{width: "75%", paddingTop: 0, height: "100vh"}}>
                {
                    this.state.connected ? (
                        <video className="video-large" id="clientVideo" autoPlay></video>
                    ) : (
                        <div className="clientWaiting">
                            <h2 className="waitingPrompt">What're you waiting for?</h2>
                            <img src={"https://cdn.dribbble.com/users/149398/screenshots/4143720/023-perrin.gif"} className="waitingGraphic" />
                        </div>
                    )
                }
                <video className="video-large" id="myVideo" autoPlay></video>
            </div>
            <div className="right" style={{width: "25%", paddingLeft: 0, paddingRight: 0, paddingTop: 0}}>
                <div className="infoDiv">
                    {
                        this.state.connected ? (
                            <>
                                <img src={ADRIAN} className="infoImage" />
                                <div className="infoContent">
                                    <p style={{fontSize: "1.3rem", color: "#FFFFFF", marginBottom: "-0.5vh"}}>Adrian Rodriguez</p>
                                    <p style={{marginTop: "0", color: "#8D8D8D"}}>Columbia University</p>
                                </div>
                            </>
                        ) : (
                            <></>
                        )
                    }
                </div>
            </div>
		</div>
		);
	}
}