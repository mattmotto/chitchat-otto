import React, {Component} from 'react';
import io from 'socket.io-client';
import {NotificationManager} from 'react-notifications';
import Cookies from 'js-cookie';

import VonageWrapper from "./wrappers/VonageWrapper"
import MakePOST from "./wrappers/RequestWrapper"

import MatchesView from "./MatchesView"

const PlusImage = "https://chitchat-us-bucket.s3.us-east-2.amazonaws.com/public_assets/plusButton.png";
const DisconnectImage = "https://chitchat-us-bucket.s3.us-east-2.amazonaws.com/public_assets/disconnect.png";
const CCIcon = "https://chitchat-us-bucket.s3.us-east-2.amazonaws.com/public_assets/add2.png";
const TICKICON = "https://chitchat-us-bucket.s3.us-east-2.amazonaws.com/public_assets/tickmark.png";
const COLLEGE = "https://chitchat-us-bucket.s3.us-east-2.amazonaws.com/public_assets/college.png";
const GLOBE = "https://chitchat-us-bucket.s3.us-east-2.amazonaws.com/public_assets/globe.svg";

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
            needsTour: false,
            friendRequest: false,
            refreshFriends: false,
            collegeMode: true,
            clientData: {}
        }
    }

    componentWillMount() {
        let that = this;
        this.updateUserCounts(() => {
            let new_site = Cookies.get("CC_NT");
            if(!new_site) {
                that.setState({
                    needsTour: true
                }, () => {
                    Cookies.set("CC_NT", "CC_NT");
                }, () => {
                })
            }
        })
    }
    
    isConnectedHandler = (clientData, onComplete) => {
        this.setState({
            connected: true,
            isLoading: false,
            friendRequest: false,
            sentFriendRequest: false,
            areFriends: false,
            allCount: 0,
            universityCount: 0,
            clientData
        }, () => {
            const that = this;
            document.primaryTimerID = setTimeout(()=> {
                // When the timeout is done, give the user a buffer before we end the call
                document.secondaryTimerID = setTimeout(()=> {
                    // When the second timeout is done, just hang the call up after a warning
                    NotificationManager.error('Your ChitChat just ended! Remember, our calls have an 8 minute time limit', 'Call Limit', 7000);
                    that.state.socket.endSession();
                }, (BUFFER_TIME*60*1000))
                NotificationManager.warning('Your ChitChat is set to end in a minute! Remember to friend each other if you want to keep this going :)', 'Call Limit', 5000);
            },(TIME_LIMIT*60*1000))
            if(onComplete) {
                onComplete();
            }
        })
    }

    friendStateHandler = (friendRequest) => {
        if(friendRequest) {
            NotificationManager.success('Hey! It looks like your ChitChat buddy is trying to add you as a friend. Hit the friend button to accept!', 'Friend Request', 7000);
        }
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
        let mode = this.state.collegeMode ? "C" : "G"
        if(this.state.friendRequest) {
            this.state.socket.confirmFriendRequest(mode);
        } else {
            if(this.state.sentFriendRequest) {
                NotificationManager.warning("You've already sent this user a friend request!", "Request Already Sent", 5000);
            } else {
                this.setState({
                    sentFriendRequest: true
                }, () => {
                    this.state.socket.sendFriendMessage(mode);
                })
            }
        }
    }

    isDisconnectedHandler = (onComplete) => {
        if(document.primaryTimerID) {
            clearTimeout(document.primaryTimerID);
        }
        if(document.secondaryTimerID) {
            clearTimeout(document.secondaryTimerID);
        }
        this.setState({
            connected: false,
            socket: null,
            isLoading: false,
            clientData: {}
        }, () => {
            this.updateUserCounts(() => {
                if(onComplete) {
                    onComplete();
                }
            });
        })
    }
    
    hadStreamError = (message) => {
        NotificationManager.error(message, "ChitChat Error", 5000);
    }

    switchRegionMode = (event) => {
        let oldCollegeMode  = this.state.collegeMode;
        this.setState({
            collegeMode: !oldCollegeMode
        })
    }

    updateUserCounts = (onCompletion) => {
        const auto_id = this.props.userData.auto_id;
        console.log("Counting active users for: "+auto_id)
        MakePOST("countactiveusers", {auto_id}, (response) => {
            let {university, all} = response
            console.log(response);
            this.setState({
                allCount: all,
                universityCount: university
            }, () => {
                if(onCompletion) {
                    onCompletion();
                }
            })
        })
    }

    findMatch = () => {
        if(this.props.userData.email) {
            navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(()=> {
                let mode = this.state.collegeMode ? "C" : "G"
                const socket = io.connect('/', {
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax : 5000,
                    reconnectionAttempts: Infinity,
                    query:`email=${this.props.userData.email}&mode=${mode}`
                });
                const vonageWrapper = new VonageWrapper(socket, this.isConnectedHandler, this.isDisconnectedHandler, this.friendStateHandler, this.confirmFriendHandler, this.hadStreamError);
                this.setState({
                    isLoading: true,
                    socket: vonageWrapper
                }, () => {
                    vonageWrapper.startSession();
                })
            }).catch(()=> {
                NotificationManager.error("Oops, we were unable to access your webcam and audio! Please enable webcam and microphone access for your browser", "Connection Error", 5000);
            })
        } else {
            NotificationManager.error("An unknown connection error occured. Please try logging out, and logging into ChitChat again.", "Connection Error", 5000);
        }
    }

	render() {
		return (
        <>
		<div>
			<div className="left" id="chatSection" style={{width: "75%", paddingTop: 0, height: "100vh"}}>
                {
                    this.state.isLoading ?  (
                        <>
                            <div className="callControlButton" style={{backgroundColor: "#FFFFFF", border: "1px solid #5CABB4"}} onClick={this.state.socket.endSession}>
                                <img src={"https://i.pinimg.com/originals/3f/2c/97/3f2c979b214d06e9caab8ba8326864f3.gif"} className="callControlImage" />
                            </div>

                            <div className="ccIconButton" disabled style={{backgroundColor: "#5CABB4", border: "1px solid #5CABB4"}}>
                                <img src={CCIcon} className="callControlImage" style={{padding: "1vh"}} />
                            </div>

                            <div className="regionControlButton" disabled style={{backgroundColor: "#5CABB4", border: "1px solid #5CABB4"}}>
                                <img src={this.state.collegeMode ? COLLEGE : GLOBE} className="regionControlImage" style={{padding: "1vh"}} />
                            </div>

                            <div className="connectedDetails">
                                <p className="connectedText">Total Online: {this.state.allCount}</p>
                                <p className="connectedText">Your School: {this.state.universityCount}</p>
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

                            <div className="regionControlButton" disabled style={{backgroundColor: "#5CABB4", border: "1px solid #5CABB4"}}>
                                <img src={this.state.collegeMode ? COLLEGE : GLOBE} className="regionControlImage" style={{padding: "1vh"}} />
                            </div>

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

                            <div className="regionControlButton" id="regionControl" style={{backgroundColor: "#5CABB4", border: "1px solid #5CABB4"}} onClick={this.switchRegionMode}>
                                <img src={this.state.collegeMode ? COLLEGE : GLOBE} className="regionControlImage" style={{padding: "1vh"}} />
                            </div>

                            <div className="connectedDetails">
                                <p className="connectedText">Total Online: {this.state.allCount}</p>
                                <p className="connectedText">Your School: {this.state.universityCount}</p>
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
                <MatchesView user_id={this.props.userData.auto_id} refresh={this.state.refreshFriends}/>
            </div>
		</div>
        <Tour steps={STEPS} isOpen={this.state.needsTour} onRequestClose={() => this.setState({needsTour:false})}/>
        </>
		);
	}
}

const STEPS = [
    {
        selector: '#chatSection',
        content: 'Hey! Thanks for signing up with ChitChat! What you see in front of you is your main chat window. Use it to meet up with cool new people :)'
    },{
        selector: '#startCall',
        content: 'This is your start call button. Use it when you\'re ready to get started!'
    },{
        selector: '#addFriend',
        content: 'Use this to mark yourself as friend-able to your new ChitChat pal! If you see the button pulsing before you hit it, that means that your ChitChat pal wants to friend you. If both of you hit this button, you\'ll both automatically get added to each others\' friend lists.' 
    },{
        selector: "#regionControl",
        content: "Use this to either enter global mode, or stick to college mode! College mode allows you to connect with people only from your school, while global mode lets you meet college kids across the world!"
    },{
        selector: '#friendTitle',
        content: 'And finally, you can find your ChitChat friends here! Access their social media information (if they\'ve added any), and stay in touch with them as we all get through these testing times.' 
    },
]