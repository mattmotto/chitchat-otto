import React, {Component} from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import "../styles/home.css"

import {Typeahead} from 'react-bootstrap-typeahead';
import {NotificationManager} from 'react-notifications';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import MakePOST from "./wrappers/RequestWrapper"

const FORM_MAP = {
	"fname" : "firstName",
	"lname" : "lastName",
	"email" : "email",
	"password": "password",
	"confirmPassword": "confirmPassword",
	"instagram": "instagram",
	"snapchat": "snapchat"
}

function validateEmail(elementValue){      
	var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailPattern.test(elementValue); 
} 


export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			options: [],
			selected: [],
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			instagram: "",
			snapchat: ""
		}
	}

	componentWillMount() {
		MakePOST("getuniversities", {}, (data) => {
			this.setState({
				options: data
			})
		})
	}

	checkEmailRegex = () => {
		let suffix = this.state.selected[0].email;
		let email = this.state.email;
		if(suffix.includes("&&&&")) {
			let multiple = suffix.split("&&&&");
			for(let i = 0; i < multiple.length; i++) {
				let specificSuffix = multiple[i]
				if(validateEmail(email) && email.endsWith(specificSuffix)) {
					return true;
				}
			}
			return false;
		} else {
			return (validateEmail(email) && email.endsWith(suffix))
		}
	}

	sendRegisterRequest = () => {
		if(this.state.firstName != "" && this.state.lastName != "" && this.state.email != "" && this.state.password != "" && this.state.confirmPassword != "") {
			if(this.state.password == this.state.confirmPassword) {
				if(this.checkEmailRegex()) {
					let payload = {
						name: this.state.firstName + " " + this.state.lastName,
						email: this.state.email,
						password: this.state.password,
						university: this.state.selected[0].name,
						photo_url: "https://davidwilsondmd.com/wp-content/uploads/2015/11/user-300x300.png",
						instagram_id: this.state.instagram,
						snapchat_id: this.state.snapchat
					}
					MakePOST("signupuser", payload, (data) => {
						if(data.status != 1) {
							NotificationManager.success("Welcome to ChitChat! Please use your credentials to sign in", "Success", 5000);
							this.setState({
								firstName: "",
								lastName: "",
								email: "",
								password: "",
								confirmPassword: "",
								selected: [],
								instagram: "",
								snapchat: ""
							})
						} else {
							NotificationManager.error("Oops. A user with this email ID already exists. Do you want to try and reset your password?", "Registration Error", 5000);
						}
					})
				} else {
					NotificationManager.error("Please enter the .edu email address associated with your school", "Registration Error", 5000);
				}
			} else {
				NotificationManager.error("Please make sure that your passwords match!", "Registration Error", 5000);
			}
		} else {
			NotificationManager.error("Please make sure that you've filled in all your needed fields!", "Registration Error", 5000);
		}
	}

	handleOnChange = (event) => {
		this.setState({
			[FORM_MAP[event.target.id]] : event.target.value
		});
	}

	changeSelectedSchool = (selected) => {
		this.setState({selected})
	}

	render() {
		return (
			<div>
			<div className="left">
			  <img
				src={
				  "https://cdn.dribbble.com/users/423861/screenshots/4985430/scene1.gif"
				}
				className="homeImage"
			  />
			</div>
			<div className="right">
			  <div className="centerContent">
				<h2>Social isolation doesn't mean isolation</h2>
				<br />
				<h4>Meet other college kids. By college kids, for college kids</h4>
				<br />
				<div className="signUpContent">
				  <Form>
					<Form.Label>Your Name</Form.Label>
					<Form.Row>
					  <Form.Group as={Col} controlId="fname">
						<Form.Control type="text" placeholder="First Name" value={this.state.firstName} onChange={this.handleOnChange}/>
					  </Form.Group>
					  <Form.Group as={Col} controlId="lname">
						<Form.Control type="text" placeholder="Last Name" value={this.state.lastName} onChange={this.handleOnChange}/>
					  </Form.Group>
					</Form.Row>
					<Form.Label>Email address &amp; University</Form.Label>
					<Form.Row>
					  <Form.Group as={Col} controlId="email">
						<Form.Control type="email" placeholder="Enter email" value={this.state.email} onChange={this.handleOnChange}/>
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
						  options={this.state.options}
						  selected={this.state.selected}
						/>
						<Form.Text className="text-muted">
						  <a href="https://forms.gle/yt6JKJRLmFWT87X98" target="_blank">Can't find your school?</a>
						</Form.Text>
					  </Form.Group>
					</Form.Row>
		  
					<Form.Label>Password</Form.Label>
					<Form.Row>
					  <Form.Group as={Col} controlId="password">
						<Form.Control type="password" placeholder="Password" value={this.state.password} onChange={this.handleOnChange}/>
					  </Form.Group>
					  <Form.Group as={Col} controlId="confirmPassword">
						<Form.Control type="password" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleOnChange}/>
					  </Form.Group>
					</Form.Row>
		  
					<Form.Label>Social Media</Form.Label>
					<Form.Row>
					  <Form.Group as={Col} controlId="instagram">
						<Form.Control type="text" placeholder="@Instagram ID (Optional!)" value={this.state.instagram} onChange={this.handleOnChange}/>
					  </Form.Group>
					  <Form.Group as={Col} controlId="snapchat">
						<Form.Control type="text" placeholder="Snapchat ID (Optional!)" value={this.state.snapchat} onChange={this.handleOnChange}/>
					  </Form.Group>
					</Form.Row>
					<Form.Text className="text-muted">
					  By pressing "Sign Up", I affirm that I'm both above 18 years of age, and I agree to ChitChat's <a href="/termsconditions" style={{color:"#5CABB4"}}>terms and conditions</a> and <a href="/privacypolicy" style={{color:"#5CABB4"}}>privacy policy</a>
					</Form.Text>
					<br />
		  
					<Button
					  className="homeButton"
					  style={{ marginLeft: "0.5vw" }}
					  onClick={this.sendRegisterRequest}
					>
					  Sign Up
					</Button>
				  </Form>
				</div>
			  </div>
			</div>
		  </div>
		);
	}
}