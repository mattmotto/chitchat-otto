import React, {Component} from 'react';

import Home from "./components/Home"
import Header from "./components/Header"

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<>
				<Header />
				<Home />
			</>
		)
	}
}