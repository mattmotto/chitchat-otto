import React, {Component} from 'react';

import ChatInterface from "./ChatInterface"

export default class Home extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div>
			<ChatInterface />
		</div>
		);
	}
}