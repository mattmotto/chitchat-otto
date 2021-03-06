import React, {Component} from 'react';
import {Navbar, Button, Form, FormControl, Nav, NavDropdown} from 'react-bootstrap'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Cookies from 'js-cookie';
import Popup from "reactjs-popup";
import {NotificationManager} from 'react-notifications';
import DocumentView from "./DocumentView"

import MakePOST from "./wrappers/RequestWrapper"

import Home from './Home';
import ChatInterface from "./ChatInterface";
import UserSettings from "./UserSettings";
import ResetPassword from "./ResetPassword"

const CCLogo = "https://chitchat-us-bucket.s3.us-east-2.amazonaws.com/public_assets/cc_logo.png";

function checkCookie(){
    var cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled){ 
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie")!=-1;
    }
    return cookieEnabled;
}

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loggedIn: false,
            firstLogin: false,
            userData: {}
        }
    }
    componentWillMount() {
        this.fetchUserInformation();
    }

    fetchUserInformation = () => {
        const auto_id = Cookies.get('user_id');
        if(auto_id) {
            MakePOST("getuserinfo", {auto_id}, (data) => {
                console.log(data);
                this.setState({
                    loggedIn: true,
                    firstLogin: false,
                    userData: data.data
                })
            })
        }
    }

    updateEmail = (event) => {
        this.setState({
            email: event.target.value 
        });
    }

    updatePassword = (event) => {
        this.setState({
            password: event.target.value 
        });
    }

    getRoutes = () => {
        return (
            <React.Fragment>
                <Route path="/chat">
                    {this.state.loggedIn ? <ChatInterface userData={this.state.userData} /> : <Redirect to="/" />}
                </Route>
                <Route path="/me">
                    {this.state.loggedIn ? (<UserSettings userData={this.state.userData} refreshData={this.refreshData}/>) : <Redirect to="/" />}
                </Route>
                <Route exact path="/termsconditions">
                    <DocumentView isTC={true} />
                </Route>
                <Route exact path="/privacypolicy">
                    <DocumentView isTC={false} />
                </Route>
                <Route exact path="/">
                    {this.state.loggedIn ? <Redirect to="/chat" /> : <Home />}
                </Route>
            </React.Fragment>
        );
      }

    checkUser = () => {
        if(checkCookie() == false) {
            NotificationManager.warning("ChitChat requires cookies to function properly. Please enable cookies for an optimal experience.", "Cookie Error", 5000);
        }
        if(this.state.email && this.state.password) {
            MakePOST("loginuser", {"email": this.state.email, "password": this.state.password}, (response) => {
                if(response.status == 0) {
                    Cookies.set('user_id', response.auto_id);
                    MakePOST("getuserinfo", {auto_id: response.auto_id}, (data) => {
                        console.log(data);
                        this.setState({
                            email: "",
                            password: "",
                            loggedIn: true,
                            firstLogin: response.first_login,
                            userData: data.data
                        }, () => {
                            this.fetchUserInformation();
                        })
                    })
                } else {
                    NotificationManager.error("Invalid username/password! Please try again", "Authentication Error", 5000);
                }
            })
        } else {
            NotificationManager.error("Please enter a username and password", "Authentication Error", 5000);
        }
    }

    logoutUser = () => {
        Cookies.remove('user_id');
        this.setState({
            email: "",
            password: "",
            loggedIn: false,
            firstLogin: false
        })
    }

    refreshData = () => {
        this.fetchUserInformation();
    }

    render() {
        return (
            <div>
                <Router>
                <Navbar bg="light" variant="light" style={{paddingTop: "1vh", paddingBottom: "1vh", paddingRight: "0.5vw", paddingLeft: "0.5vw", height: "8vh"}}>
                    <Navbar.Brand id="titleLogo" href="/"><img src={CCLogo} style={{
                        width: "30vh", height: "auto", marginTop: "0.3vh", marginBottom: "0.3vh"
                        }} /></Navbar.Brand>
                    <Nav className="mr-auto">
                    </Nav>
                    {
                        this.state.loggedIn ? (
                            <NavDropdown title={<img src={this.state.userData["photo_url"]} style={{height: "5vh", width: "5vh", borderRadius: "50%"}} />} style={{marginRight: "4vw"}} id="basic-nav-dropdown">
                                <NavDropdown.Item href="/me">Account Settings</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={this.logoutUser}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                            <Form inline>
                                <FormControl type="text" placeholder="Email" className="mr-sm-2" value={this.state.email} onChange={this.updateEmail} />
                                <FormControl type="password" placeholder="Password" className="mr-sm-2" value={this.state.password} onChange={this.updatePassword} />
                                <Button variant="outline-primary" className="homeButton" onClick={this.checkUser}>Log In</Button>
                                <Popup trigger={
                                <Button variant="outline-primary" className="homeButton" style={{marginLeft: "0.5vw"}}>Forgot Password</Button>
                                } modal closeOnDocumentClick position="top center">
                                    {close => (
                                        <ResetPassword close={close} />
                                    )}
                                </Popup>
                            </Form>
                            </>
                        )
                    }
                </Navbar>
                {this.getRoutes()}
                </Router>
            </div>
        );
    }
}