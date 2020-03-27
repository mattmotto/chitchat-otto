import React, {Component} from 'react';
import io from 'socket.io-client';

import VonageWrapper from "./VonageWrapper"

import MatchesView from "./MatchesView"

import PlusImage from "../resources/plusButton.png"
import DisconnectImage from "../resources/disconnect.png"


import "../styles/chatinterface.css"

export default class ChatInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            isLoading: false,
            socket: null
        }
    }

    isConnectedHandler = (onComplete) => {
        this.setState({
            connected: true,
            isLoading: false
        }, () => {
            if(onComplete) {
                onComplete();
            }
        })
    }

    isDisconnectedHandler = (onComplete) => {
        this.setState({
            connected: false,
            socket: null,
            isLoading: false
        }, () => {
            if(onComplete) {
                onComplete();
            }
        })
    }

    findMatch = () => {
        const socket = io.connect('/', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity
        });
        this.setState({
            isLoading: true
        }, () => {
            const vonageWrapper = new VonageWrapper(socket, this.isConnectedHandler, this.isDisconnectedHandler);
            this.setState({
                socket: vonageWrapper
            }, () => {
                vonageWrapper.startSession();
            })
        })
    }

	render() {
        console.log("CONNECTED: "+this.state.connected);
		return (
		<div>
			<div className="left" style={{width: "75%", paddingTop: 0, height: "100vh"}}>
                {
                    this.state.isLoading ?  (
                        <div className="callControlButton" style={{backgroundColor: "#FFFFFF", border: "1px solid #5CABB4"}}>
                            <img src={"https://i.pinimg.com/originals/3f/2c/97/3f2c979b214d06e9caab8ba8326864f3.gif"} className="callControlImage" />
                        </div>
                    ) : this.state.connected ? (
                        <div className="callControlButton" style={{backgroundColor: "rgb(192, 39, 39)"}} onClick={() => console.log("Disconnecting")}>
                            <img src={DisconnectImage} className="callControlImage" />
                        </div>
                    ) : (
                        <div className="callControlButton" style={{backgroundColor: "#5CABB4"}} onClick={this.findMatch}>
                            <img src={PlusImage} className="callControlImage" />
                        </div>
                    )
                }
                {
                    this.state.connected ? (
                        <div id="clientVideo"></div>
                    ) : (
                        <div className="clientWaiting">
                            <h2 className="waitingPrompt">What're you waiting for?</h2>
                            <img src={"https://cdn.dribbble.com/users/149398/screenshots/4143720/023-perrin.gif"} className="waitingGraphic" />
                        </div>
                    )
                }
                <div id="myVideo"></div>
            </div>
            <div className="right" style={{width: "25%", paddingLeft: 0, paddingRight: 0, paddingTop: 0}}>
                <MatchesView user_id={0}/>
            </div>
		</div>
		);
	}
}