import React, {Component} from 'react';
import io from 'socket.io-client';
import { SocketHandler } from './SocketHandler';

export default class ChatInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false
        }
        this.toggleConnection = this.toggleConnection.bind(this);
    }

    toggleConnection(postToggle) {
        let {connected} = this.state
        connected = !connected
        this.setState({connected}, () => {
            postToggle();
        });
    }
    
    componentDidMount() {
        const socket = io.connect('http://localhost:5000', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity
        });
        SocketHandler(socket, this.toggleConnection);
    }



	render() {
		return (
		<div>
            {this.state.connected ? (
                <React.Fragment>
                    <video class="video-large" id="myVideo" autoPlay></video>
                </React.Fragment>
            ): (
                <React.Fragment>
                    <video class="video-large" autoPlay></video>
                    <video class="video-large" id="clientVideo" autoPlay></video>
                </React.Fragment>
            )}
		</div>
		);
	}
}