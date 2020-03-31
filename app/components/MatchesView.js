import React, {Component} from 'react';
import Popup from "reactjs-popup";
import MatchDetailPopup from "./popups/MatchDetailPopup";
import Cookies from 'js-cookie';

import MakePOST from "./wrappers/RequestWrapper";

import "../styles/matches.css"

const PAGE_SIZE = 10;

export default class MatchesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendPage: 0,
            matches: []
        }
    }

    componentWillMount() {
        this.updateFriendList();
    }

    componentWillReceiveProps(prevProps) {
        const { refresh } = this.props;
        console.log("IN THE OTHER COMPONENT")
        console.log(refresh)
        console.log(prevProps.refresh)
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
                matches: data
            })
        })
    }

    render() {
        if(this.state.matches.length != 0) {
            return (
                <div className="matchesTableWrapper" id="friendTitle">
                    <h2 className="matchTitle">My Friends</h2>
                    <hr className="cellLine" />
                    <div className="matchesTable">
                    {
                        this.state.matches.map((match) => (
                            <React.Fragment>
                            <Popup  trigger={
                                <div className="matchCell">
                                    <img src={match.photo_url} className="matchProfilePicture" />
                                    <div className="matchContent">
                                        <p className="matchName">{match.name}</p>
                                        <p className="matchUniversity">{match.university}</p>
                                    </div>
                                </div>
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