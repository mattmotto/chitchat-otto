import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import "../styles/home.css"
import coffee from "../resources/coffee.png"
import ChatInterface from "./ChatInterface"

const PRIMARY = "#2A36CF";

export default class Home extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div>
			<div className="left">
				<img src={"https://cdn.dribbble.com/users/423861/screenshots/4985430/scene1.gif"} className="homeImage" />
				<span className="centerSubtext">By Matthew Otto, David Carratu, and Raghav Mecheri</span>
			</div>
			<div className="right">
				<div className="centerContent">
					<h2>Social isolation doesn't mean boredom</h2>
					<br />
					<h4>An online platform to meet other college kids. By college kids, for college kids.</h4>
					<br />
					<br />
					<Button className="homeButton" style={{marginRight: "0.5vw"}}>Login</Button>
					<Button className="homeButton" style={{marginLeft: "0.5vw"}}>Sign Up</Button>
				</div>
			</div>
		</div>
		);
	}
}