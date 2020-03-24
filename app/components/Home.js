import React, {Component} from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import "../styles/home.css"
import ChatInterface from "./ChatInterface"
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const PRIMARY = "#2A36CF";
import options from './data';


export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: []
		}
	}

	changeSelectedSchool = (selected) => {
		this.setState({selected})
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
					<div className="signUpContent">
						<Form>
						<Form.Label>Your Name</Form.Label>
							<Form.Row>
								<Form.Group as={Col} controlId="formName">
									<Form.Control type="text" placeholder="First Name" />
								</Form.Group>
								<Form.Group as={Col} controlId="formName">
									<Form.Control type="text" placeholder="Last Name" />
								</Form.Group>
							</Form.Row>
							<Form.Label>Email address &amp; University</Form.Label>
						<Form.Row>
								<Form.Group as={Col} controlId="formName">
									<Form.Control type="email" placeholder="Enter email" />
									<Form.Text className="text-muted">
									Please use your .edu email!
									</Form.Text>
								</Form.Group>
								<Form.Group as={Col} controlId="formName">
								<Typeahead
									id="basic-typeahead-example"
									labelKey="name"
									multiple={false}
									onChange={this.changeSelectedSchool}
									placeholder="Where do you study?"
									options={options}
									selected={this.state.selected}
								/>
								<Form.Text className="text-muted">
									To match you to awesome people
								</Form.Text>
								</Form.Group>
							</Form.Row>

							<Form.Label>Password</Form.Label>
							<Form.Row>
								<Form.Group as={Col} controlId="formName">
									<Form.Control type="password" placeholder="Password" />
								</Form.Group>
								<Form.Group as={Col} controlId="formName">
								<Form.Control type="password" placeholder="Confirm Password" />
								</Form.Group>
							</Form.Row>

							<Form.Label>Social Media</Form.Label>
							<Form.Row>
								<Form.Group as={Col} controlId="formName">
									<Form.Control type="text" placeholder="Instagram Handle" />
								</Form.Group>
								<Form.Group as={Col} controlId="formName">
								<Form.Control type="password" placeholder="Snapchat ID" />
								</Form.Group>
							</Form.Row>
							<Form.Text className="text-muted">
								You only share your social media with people that you really get along with. Also, it's optional.
							</Form.Text>
							<br />

						<Button className="homeButton" style={{marginLeft: "0.5vw"}} type="submit">Sign Up</Button>
						</Form>
					</div>
				</div>
			</div>
		</div>
		);
	}
}