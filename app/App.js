import React, {Component} from 'react';

import Home from "./components/Home"
import Header from "./components/Header"
import MobileLanding from "./components/MobileLanding"

import {NotificationContainer} from 'react-notifications';
import MediaQuery from 'react-responsive'


export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<>
		<MediaQuery minDeviceWidth={1224}>
			<Header/><NotificationContainer/>
		</MediaQuery>
		<MediaQuery maxDeviceWidth={1224}>
			<MobileLanding />
		</MediaQuery>
		</>);
	}
}