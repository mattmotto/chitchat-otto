import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import MakePOST from "../wrappers/RequestWrapper";
import {NotificationManager} from 'react-notifications';
import ImageUploader from 'react-images-upload';

export default class UploadProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            picture: null,
            isUploading: false
        };
    }
    
    onDrop = (picture) => {
        console.log(picture);
        var reader = new FileReader();
        const that = this;
        reader.onload = function(event) {
            that.setState({
                picture: picture[0],
                pictureSrc: event.target.result
            })
        };
        reader.readAsDataURL(picture[0]);
    }

    render() {
        return (
            <div style={{paddingTop: "2vh", paddingBottom: "2vh", textAlign: "center"}}>
            <p className="welcomeText">Upload a new profile picture!</p>
            {
                this.state.picture ? (<img src={this.state.isUploading ? "https://thumbs.gfycat.com/AccurateShortCommabutterfly-size_restricted.gif" : this.state.pictureSrc} className="profilePicture" style={{marginTop: "3vh", marginBottom: "3vh"}}/>)
                : (
                    <ImageUploader
                        withIcon={true}
                        singleImage={true}
                        buttonText="Choose an image"
                        label='Upload an image from your laptop/pc'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.png', '.jpeg']}
                        maxFileSize={5242880}
                    />
                )
            }

            <br />
            {
                this.state.isUploading ? (
                    <Button className="homeButton" disabled style={{marginRight: "1vw", width: "5vw", marginTop: "3vh"}}>Update</Button>
                ) : this.state.picture ? (
                    <Button className="homeButton" style={{marginRight: "1vw", width: "5vw", marginTop: "3vh"}} onClick={() => {
                        const formData  = new FormData();
                        formData.append("user", this.props.userData.auto_id);
                        formData.append("profilePicture", this.state.picture);

                        this.setState({
                            isUploading: true
                        }, () => {
                            fetch("/uploadprofpic", {
                                method: "POST",
                                body: formData
                            }).then(data => data.json())
                            .then((data) => {
                                if(data.status == 0) {
                                    this.setState({
                                        isUploading:false
                                    }, () => {
                                        this.props.refreshData();
                                        this.props.close();
                                    })
                                }
                            })
                        })

                    }}>Update</Button>
                ) : (
                    <Button className="homeButton" disabled style={{marginRight: "1vw", width: "5vw", marginTop: "3vh"}}>Update</Button>
                )
            }
            <Button className="homeButton" style={{marginLeft: "1vw", width: "5vw", marginTop: "3vh"}} onClick={this.props.close}>Close</Button>
        </div>
        );
    }
}