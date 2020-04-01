import React, {Component} from 'react';
import Popup from "reactjs-popup";
import MatchDetailPopup from "./popups/MatchDetailPopup";
import data from "./match_mock"
import Cookies from 'js-cookie';
import {Row, Button} from 'react-bootstrap'

import MakePOST from "./wrappers/RequestWrapper";

import "../styles/matches.css"

const PAGE_SIZE = 10;

export default class MatchesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendPage: 0,
            matches: [],
            hasNextPage: false
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
                    <h2 className="matchTitle">My Friends</h2>
                    <Button disabled={this.state.friendPage==0}>Prev</Button>
                    <Button disabled={this.state.hasNextPage}>Next</Button>
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
                    <Button disabled={this.state.friendPage==0} onClick={() => {
                        let friendPage = this.state.friendPage - 1;
                        this.setState({
                            friendPage 
                        })
                    }}className="homeButton" style={{width: "3vw", marginLeft: "2.5vw", marginTop: "2vh", fontSize: "0.85rem"}}>Prev</Button>
                    <Button disabled={this.state.hasNextPage} onClick={() => {
                        let friendPage = this.state.friendPage + 1;
                        this.setState({
                            friendPage
                        })
                    }}className="homeButton" style={{width: "3vw", marginRight: "2.5vw", marginTop: "2vh", fontSize: "0.85rem", float: "right"}}>Next</Button>
                    <h2 className="matchTitle">My Friends</h2>
                    <hr className="cellLine" />
                    <div className="matchesTable">
                        <div className="matchCell">
                            <p className="matchName">No friends yet :(</p>
                        </div>
                    </div>
                </div>
            );
        }
    }
}