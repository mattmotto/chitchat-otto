import React, {Component} from 'react';
import Popup from "reactjs-popup";
import MatchDetailPopup from "./popups/MatchDetailPopup";
import data from "./match_mock"
import Cookies from 'js-cookie';
import {Row, Button} from 'react-bootstrap'

import MakePOST from "./wrappers/RequestWrapper";

import "../styles/matches.css"
const LEFTARROW = "https://chitchat-us-bucket.s3.us-east-2.amazonaws.com/public_assets/left.png";
const RIGHTARROW = "https://chitchat-us-bucket.s3.us-east-2.amazonaws.com/public_assets/right.png";

const PAGE_SIZE = 10;

export default class MatchesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendPage: 0,
            matches: [],
            hasNextPage: false,
        }
    }

    componentWillMount() {
        this.updateFriendList();
    }

    componentWillReceiveProps(prevProps) {
        const { refresh } = this.props;
        if (prevProps.refresh != refresh) {
            this.updateFriendList();
        }
      }

    updateFriendList = () => {
        const auto_id = Cookies.get('user_id');
        MakePOST("getusermatches", {
            user: auto_id,
            pageNumber: this.state.friendPage,
            pageLength: PAGE_SIZE
        }, (data) => {
            this.setState({
                matches: data.matches,
                hasNextPage: data.hasNextPage
            })
        })
    }

    render() {
        if(this.state.matches.length != 0) {
            return (
                <div className="matchesTableWrapper" id="friendTitle">
                    <img src={LEFTARROW} disabled={this.state.friendPage==0} style={{height: "3vh", width: "auto", marginLeft: "2.5vw", marginTop: "2vh", float: "left"}} onClick={() => {
                        let friendPage = this.state.friendPage - 1;
                        this.setState({
                            friendPage 
                        }, ()=> {
                            this.updateFriendList();
                        })
                    }}/>

                    <img src={RIGHTARROW} disabled={!this.state.hasNextPage} style={{height: "3vh", width: "auto", marginRight: "2.5vw", marginTop: "2vh", float: "right"}} onClick={() => {
                        let friendPage = this.state.friendPage + 1;
                        this.setState({
                            friendPage 
                        }, ()=> {
                            this.updateFriendList();
                        })
                    }}/>

                    <h2 className="matchTitle">My Friends</h2>

                    <hr className="cellLine" />
                    <div className="matchesTable">
                    {
                        this.state.matches.map((match) => (
                            <React.Fragment>
                                <Popup trigger={
                                    <Row className="matchCell">
                                        <img src={match.photo_url} className="matchProfilePicture" />
                                        <div className="matchContent">
                                            <p className="matchName">{match.name}</p>
                                            <p className="matchUniversity">{match.university}</p>
                                        </div>
                                    </Row>
                                    } modal closeOnDocumentClick position="top center">
                                        {close => (
                                            <MatchDetailPopup data={match} close={close} handleDelete={this.updateFriendList}/>
                                        )}
                                    </Popup>
                                <hr className="cellLine"/>
                            </React.Fragment>
                        ))
                    }
                    </div>
                </div>
            );
        } else {
            return (
                <div className="matchesTableWrapper" id="friendTitle">
                    <img src={LEFTARROW} className="imageButton" disabled={this.state.friendPage==0} style={{height: "3vh", width: "auto", marginLeft: "2.5vw", marginTop: "2vh", float: "left"}} onClick={() => {
                        let friendPage = this.state.friendPage - 1;
                        this.setState({
                            friendPage 
                        }, ()=> {
                            this.updateFriendList();
                        })
                    }}/>

                    <img src={RIGHTARROW} className="imageButton" disabled={!this.state.hasNextPage} style={{height: "3vh", width: "auto", marginRight: "2.5vw", marginTop: "2vh", float: "right"}} onClick={() => {
                        let friendPage = this.state.friendPage + 1;
                        this.setState({
                            friendPage 
                        }, ()=> {
                            this.updateFriendList();
                        })
                    }}/>

                    <h2 className="matchTitle">My Friends</h2>

                    <hr className="cellLine" />
                    <div className="matchesTable" style={{overflow: "hidden"}}>
                        <div className="matchCell">
                            <p className="matchName">No friends yet :(</p>
                        </div>
                    </div>
                </div>
            );
        }
    }
}