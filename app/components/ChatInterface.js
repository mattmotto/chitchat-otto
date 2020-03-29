import React, {Component} from 'react';
import io from 'socket.io-client';
import Cookies from 'js-cookie';

import VonageWrapper from "./wrappers/VonageWrapper"
import MakePOST from "./wrappers/RequestWrapper"

import MatchesView from "./MatchesView"

import PlusImage from "../resources/plusButton.png"
import DisconnectImage from "../resources/disconnect.png"
import CCIcon from "../resources/cc_icon.png"
import Globe from "../resources/globe.svg"
import College from "../resources/college.png"

import Tour from 'reactour'

import "../styles/chatinterface.css"

export default class ChatInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            isLoading: false,
            socket: null,
            // universityMode: false,
            friendPage: 0,
            // needsTour: props.firstLogin
            needsTour: false,
            userData: {}
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
        console.log("User Email: "+this.props.userData.email);
        const socket = io.connect('/', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity,
            query:`email=${this.props.userData.email}&mode=${"G"}`
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

    /*
    switchRegionModes = () => {
        let {universityMode} = this.state;
        this.setState({
            universityMode: !universityMode
        })
    }
    */

	render() {
		return (
        <>
		<div id="parent">
			<div className="left" style={{width: "75%", paddingTop: 0, height: "100vh"}}>
                {
                    this.state.isLoading ?  (
                        <>
                            <div className="callControlButton" style={{backgroundColor: "#FFFFFF", border: "1px solid #5CABB4"}}>
                                <img src={"https://i.pinimg.com/originals/3f/2c/97/3f2c979b214d06e9caab8ba8326864f3.gif"} className="callControlImage" />
                            </div>

                            <div className="ccIconButton" disabled style={{backgroundColor: "#FFFFFF"}}>
                                <img src={CCIcon} className="ccIconImage" />
                            </div>
                        </>

                    ) : this.state.connected ? (
                        <>
                            <div className="callControlButton" style={{backgroundColor: "rgb(192, 39, 39)"}} onClick={this.state.socket.endSession}>
                                <img src={DisconnectImage} className="callControlImage" />
                            </div>

                            <div className="ccIconButton" style={{backgroundColor: "#FFFFFF", animation: "waitingPulse 2s 3"}} onClick={() => console.log("Add Friend")}>
                                <img src={CCIcon} className="ccIconImage" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="callControlButton" id="startCall" style={{backgroundColor: "#5CABB4", animation: "waitingPulse 2s 3"}} onClick={this.findMatch}>
                                <img src={PlusImage} className="callControlImage" />
                            </div>

                            <div className="ccIconButton" id="addFriend" disabled style={{backgroundColor: "#FFFFFF", border: "1px solid #5CABB4"}}>
                                <img src={CCIcon} className="ccIconImage" />
                            </div>
                        </>
                    )
                }
                {
                    this.state.connected ? (
                        <>
                            <div id="clientVideo"></div>
                            <div id="myVideo"></div>
                        </>
                    ) : (
                        <div className="clientWaiting">
                            <h2 className="waitingPrompt">What are you waiting for?</h2>
                            <img src={"https://cdn.dribbble.com/users/149398/screenshots/4143720/023-perrin.gif"} className="waitingGraphic" />
                        </div>
                    )
                }
            </div>
            <div className="right" style={{width: "25%", paddingLeft: 0, paddingRight: 0, paddingTop: 0}}>
                <MatchesView id="#friendList" user_id={0}/>
            </div>
		</div>
        {this.state.needsTour ? (<Tour steps={STEPS} />) : (<></>)}
        </>
		);
	}
}

const STEPS = [
    {
        selector: '#parent',
        content: 'Hey! Thanks for signing up with ChitChat! This is your main chat window. Use it to meet up with cool new people :)'
    },{
        selector: '#startCall',
        content: 'This is your start call button. Use it when you\'re ready to get started!'
    },{
        selector: '#addFriend',
        content: 'Use this to mark yourself as friend-able to your new ChitChat pal! If both of you hit this button, you\'ll both automatically get added to each others\' friend lists.' 
    },{
        selector: '#modeSelector',
        content: 'Looking for something closer to home? Use the ChitChat region control to either meet college students from the same school as you, or from across the US!' 
    },
    {
        selector: '#friendList',
        content: 'And finally, you can find your ChitChat friends here! Access their social media information (if they\'ve added any), and stay in touch with them as we all get through these testing times.' 
    },
]