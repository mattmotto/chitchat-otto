import React, {Component} from 'react';
import {Navbar, Button, Form, FormControl, Nav} from 'react-bootstrap'

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        console.log(nextProps);
        return (this.props.loggedIn != nextProps.loggedIn);
    }

    render() {
        return (
            <div style={{paddingTop: "1vh", paddingBottom: "1vh", paddingRight: "0.5vw", paddingLeft: "0.5vw"}}>
                <Navbar bg="light" variant="light">
                    <Navbar.Brand>Window</Navbar.Brand>
                    <Nav className="mr-auto">
                    <Nav.Link>About Us</Nav.Link>
                    </Nav>
                    {
                        this.props.loggedIn ? (
                            <Button variant="outline-primary" className="homeButton" onClick={this.props.onLogOut}>Log Out</Button>
                        ) : (
                            <>
                            <Form inline>
                                <FormControl type="text" placeholder="Email ID" className="mr-sm-2" />
                                <FormControl type="password" placeholder="Password" className="mr-sm-2" />
                                <Button variant="outline-primary" className="homeButton" onClick={this.props.onLogIn}>Log In</Button>
                            </Form>
                            </>
                        )
                    }
                </Navbar>
            </div>
        );
    }
}