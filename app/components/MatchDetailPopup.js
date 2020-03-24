import React, {Component} from 'react';
import { Button } from 'react-bootstrap';

export default function MatchDetailPopup(props) {
    return (
        <div>
            {JSON.stringify(props.data)}
        </div>
    );
}