import React, {Component} from 'react';

import Home from "./components/Home"
import Header from "./components/Header"
import ChatInterface from "./components/ChatInterface"

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: false
		}
	}

	onSignUp = () => {
		this.setState({
			isLoggedIn: true
		})
	}

	onLogIn = () => {
		this.setState({
			isLoggedIn: true
		})
	}

	onLogOut = () => {
		this.setState({
			isLoggedIn: false
		})
	}

	render() {
		return (
			<>
			<Header loggedIn={this.state.isLoggedIn} onLogIn={this.onLogIn} onLogOut={this.onLogOut}/>
			{
				this.state.isLoggedIn ? (
						<ChatInterface />
				) : (
					<Home onSignUp={this.onSignUp} />
				)
			}	
			</>
		)
	}
}