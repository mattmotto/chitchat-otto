import React, {Component} from 'react';
import {Navbar, Button, Form, FormControl, Nav, NavDropdown} from 'react-bootstrap'

const PLACEHOLDER="https://media-exp1.licdn.com/dms/image/C4D03AQE6Z2qUD8qVlg/profile-displayphoto-shrink_200_200/0?e=1586995200&v=beta&t=weFdlTvJ8BlZiV90O_Aide_rg_5jNzVji2syR5BeziU";

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
            <div>
                <Navbar bg="light" variant="light" style={{paddingTop: "1vh", paddingBottom: "1vh", paddingRight: "0.5vw", paddingLeft: "0.5vw", height: "8vh"}}>
                    <Navbar.Brand>Window</Navbar.Brand>
                    <Nav className="mr-auto">
                    <Nav.Link>About Us</Nav.Link>
                    </Nav>
                    {
                        this.props.loggedIn ? (
                            <NavDropdown title={<img src={PLACEHOLDER} style={{height: "5vh", width: "auto", borderRadius: "50%"}} />} style={{marginRight: "2vw"}} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={()=>console.log("Account settings")}>Account Settings</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={this.props.onLogOut}>Logout</NavDropdown.Item>
                            </NavDropdown>
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