import React, {Component} from 'react';
import io from 'socket.io-client';
import {NotificationManager} from 'react-notifications';

import VonageWrapper from "./wrappers/VonageWrapper"

import MatchesView from "./MatchesView"

import PlusImage from "../resources/plusButton.png"
import DisconnectImage from "../resources/disconnect.png"
import CCIcon from "../resources/add2.png"
import TICKICON from "../resources/tickmark.png"

import Tour from 'reactour'

import "../styles/chatinterface.css"
import 'react-notifications/lib/notifications.css';


const TIME_LIMIT = 7;
const BUFFER_TIME = 1;

export default class ChatInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            isLoading: false,
            socket: null,
            friendPage: 0,
            // needsTour: props.firstLogin
            needsTour: false,
            friendRequest: false,
            refreshFriends: false,
            userData: {},
            clientData: {}
        }
    }
    
    isConnectedHandler = (clientData, onComplete) => {
        this.setState({
            connected: true,
            isLoading: false,
            friendRequest: false,
            sentFriendRequest: false,
            areFriends: false,
            clientData
        }, () => {
            const that = this;
            if(onComplete) {
                setTimeout(()=> {
                    // When the timeout is done, give the user a buffer before we end the call
                    setTimeout(()=> {
                        // When the second timeout is done, just hang the call up after a warning
                        NotificationManager.warning('Your ChitChat just ended! Remember, our calls have an 8 minute time limit', 'Call Limit', 7000);
                        that.state.socket.endSession();
                    }, (BUFFER_TIME*60*1000))
                    NotificationManager.warning('Your ChitChat is set to end in a minute! Remember to friend each other if you want to keep this going :)', 'Call Limit', 5000);
                },(TIME_LIMIT*60*1000))
                onComplete();
            }
        })
    }

    friendStateHandler = (friendRequest) => {
        this.setState({
            friendRequest
        })
    }

    confirmFriendHandler = (resolution) => {
        if(resolution) {
            NotificationManager.success('You\'ve been added as friends!', 'Added Friend', 7000);
            this.setState({
                refreshFriends: !this.state.refreshFriends,
                areFriends: true
            })
        } else {
            NotificationManager.warning('The two of you are already friends!', 'Already Friends', 7000);
            this.setState({
                areFriends: true
            })
        }
        
    }

    handleFriendAdd = () => {
        if(this.state.friendRequest) {
            this.state.socket.confirmFriendRequest("G");
        } else {
            if(this.state.sentFriendRequest) {
                NotificationManager.warning("You've already sent this user a friend request!", "Request Already Sent", 5000);
            } else {
                this.setState({
                    sentFriendRequest: true
                }, () => {
                    this.state.socket.sendFriendMessage("G");
                })
            }
        }
    }

    isDisconnectedHandler = (onComplete) => {
        this.setState({
            connected: false,
            socket: null,
            isLoading: false,
            clientData: {}
        }, () => {
            if(onComplete) {
                onComplete();
            }
        })
    }

    findMatch = () => {
        if(this.props.userData.email) {
            const socket = io.connect('/', {
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax : 5000,
                reconnectionAttempts: Infinity,
                query:`email=${this.props.userData.email}&mode=${"G"}`
            });
            const vonageWrapper = new VonageWrapper(socket, this.isConnectedHandler, this.isDisconnectedHandler, this.friendStateHandler, this.confirmFriendHandler);
            this.setState({
                isLoading: true,
                socket: vonageWrapper
            }, () => {
                vonageWrapper.startSession();
            })
        } else {
            NotificationManager.error("An unknown connection error occured. Please try logging out, and logging into ChitChat again.", "Connection Error", 5000);
        }
    }

	render() {
		return (
        <>
		<div id="parent">
			<div className="left" style={{width: "75%", paddingTop: 0, height: "100vh"}}>
                {
                    this.state.isLoading ?  (
                        <>
                            <div className="callControlButton" style={{backgroundColor: "#FFFFFF", border: "1px solid #5CABB4"}} onClick={this.state.socket.endSession}>
                                <img src={"https://i.pinimg.com/originals/3f/2c/97/3f2c979b214d06e9caab8ba8326864f3.gif"} className="callControlImage" />
                            </div>

                            <div className="ccIconButton" style={{backgroundColor: "#5CABB4", border: "1px solid #5CABB4"}}>
                                <img src={CCIcon} className="callControlImage" style={{padding: "1vh"}} />
                            </div>
                        </>

                    ) : this.state.connected ? (
                        <>
                            <div className="callControlButton" style={{backgroundColor: "rgb(192, 39, 39)"}} onClick={this.state.socket.endSession}>
                                <img src={DisconnectImage} className="callControlImage" />
                            </div>
                            {
                                this.state.areFriends ? (
                                    <div className="ccIconButton" style={{backgroundColor: "#5CABB4", border: "1px solid #5CABB4", animation: "waitingPulse 2s 3"}}>
                                        <img src={TICKICON} className="callControlImage" style={{padding: "1vh"}} />
                                    </div>
                                ) : this.state.friendRequest ? (
                                    <div className="ccIconButton"  style={{backgroundColor: "#5CABB4", border: "1px solid #5CABB4", animation: "waitingPulse 2s infinite"}} onClick={this.handleFriendAdd}>
                                        <img src={CCIcon} className="callControlImage" style={{padding: "1vh"}} />
                                    </div>
                                ) : this.state.sentFriendRequest ? (
                                    <div className="ccIconButton"  style={{backgroundColor: "#5CABB4", border: "1px solid #5CABB4", animation: "waitingPulse 2s infinite"}} onClick={this.handleFriendAdd}>
                                        <img src={CCIcon} className="callControlImage" style={{padding: "1vh"}} />
                                    </div>
                                ): (
                                    <div className="ccIconButton"  style={{backgroundColor: "#5CABB4", border: "1px solid #5CABB4"}} onClick={this.handleFriendAdd}>
                                        <img src={CCIcon} className="callControlImage" style={{padding: "1vh"}} />
                                    </div>
                                )
                            }

                            <div className="userProfileInfo">
                                <img src={this.state.clientData.photo_url} className="profileImage"/>
                                <p style={{color: "#5CABB4", fontSize: "1.3rem", marginBottom: "0vh"}}>{this.state.clientData.name}</p>
                                <p style={{marginTop: "0.3vh", marginBottom: "0vh"}}>{this.state.clientData.university}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="callControlButton" id="startCall" style={{backgroundColor: "#5CABB4", animation: "waitingPulse 2s 3"}} onClick={this.findMatch}>
                                <img src={PlusImage} className="callControlImage" />
                            </div>

                            <div className="ccIconButton" id="addFriend" disabled style={{backgroundColor: "#5CABB4", border: "1px solid #5CABB4"}}>
                                <img src={CCIcon} className="callControlImage" style={{padding: "1vh"}} />
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
                <MatchesView id="#friendList" user_id={0} refresh={this.state.refreshFriends}/>
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