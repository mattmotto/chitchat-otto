import React, {Component} from 'react';

import Home from "./components/Home"
import Header from "./components/Header"
import ChatInterface from "./components/ChatInterface"
import Cookies from 'js-cookie';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: false,
			firstLogin: false
		}
	}

	componentWillMount() {
		let auto_id = Cookies.get('user_id');
		if(auto_id) {
			this.setState({
				isLoggedIn: true
			})
		}
	}

	onSignUp = () => {
		this.setState({
			isLoggedIn: true
		})
	}

	onLogIn = (firstLogin) => {
		this.setState({
			isLoggedIn: true,
			firstLogin: firstLogin
		})
	}

	onLogOut = () => {
		Cookies.remove('user_id');
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
						<ChatInterface firstLogin={this.state.firstLogin}/>
				) : (
					<Home onSignUp={this.onSignUp} />
				)
			}	
			</>
		)
	}
}