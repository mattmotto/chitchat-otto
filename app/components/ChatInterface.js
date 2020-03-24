import React, {Component} from 'react';
import io from 'socket.io-client';
import { SocketHandler } from './SocketHandler';

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
            onComplete();
        })
    }

    isDisconnectedHandler = (onComplete) => {
        this.setState({
            connected: false
        }, () => {
            onComplete();
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
            <video className="video-large" id="myVideo" autoPlay></video>
            <video className="video-large" id="clientVideo" autoPlay></video>
		</div>
		);
	}
}