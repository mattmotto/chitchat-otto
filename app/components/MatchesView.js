import React, {Component} from 'react';

import "../styles/matches.css"

import MockMatches from "./match_mock"

export default class MatchesView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="matchesTableWrapper">
                <h2 className="matchTitle">My Friends</h2>
                <hr className="cellLine" />
                <div className="matchesTable">
                {
                    MockMatches.map((match) => (
                        <React.Fragment>
                            <div className="matchCell">
                                <img src={match.profile} className="matchProfilePicture" />
                                <div className="matchContent">
                                    <p className="matchName">{match.name}</p>
                                    <p className="matchUniversity">{match.university}</p>
                                </div>
                            </div>
                            <hr className="cellLine"/>
                        </React.Fragment>
                    ))
                }
                </div>
            </div>
        );
    }
}