import React, {Component} from 'react';
import CCLogo from "../resources/cc_logo.png"

export default function MobileLanding(props) {
    return (
        <div style={{padding: "3vh", height: "100vh", textAlign: "center"}}>
        <img src={CCLogo} style={{width: "70vw", height: "auto", marginTop: "23vh", marginBottom: "4vh"}} />
        <p style={{fontSize: "1.3rem", marginBottom: "2vh"}}> Thanks for checking ChitChat out! We aren't mobile-friendly yet, but we'll be there soon :)</p>
        <p style={{fontSize: "1rem"}}> Reach us at: <a href="mailto: chitchat@chitchat.buzz">chitchat@chitchat.buzz</a></p>
        </div>
    );
}