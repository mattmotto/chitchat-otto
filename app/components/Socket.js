var peerConnection = window.RTCPeerConnection ||
window.mozRTCPeerConnection ||
window.webkitRTCPeerConnection ||
window.msRTCPeerConnection;

var sessionDescription = window.RTCSessionDescription ||
window.mozRTCSessionDescription ||
window.webkitRTCSessionDescription ||
window.msRTCSessionDescription;

var pc = null;

export default class Socket {
    constructor(socket, onConnect, onDisconnect) {
        this.socket = socket;
        this.connectedHandler = onConnect;
        this.disconnectedHandler = onDisconnect;
        this.target_socket = null;
        this.stream = null;
        this.webcamStream = null;
        this.pc = null;
        document.socketObject = this;
    }

    webcamErrorHandler(err) {
        console.log("Error with opening user webcam")
        document.socketObject.socket.close();
        document.socketObject.disconnectedHandler();
    }

    pcErrorHandler(err) {
        console.log("Error with the NAV getUserMedia: "+err)
    }

    endSession() {
        pc.close();
        document.socketObject.socket.close();
        document.socketObject.target_socket = null;
        document.getElementById("clientVideo").srcObject = null;
        document.socketObject.disconnectedHandler();
    }

    startSession() {
        this.answersFrom = {}, 
        this.offer;
        var that = this;

        pc = new peerConnection({
            iceServers: [{
                url: "stun:stun.services.mozilla.com",
                username: "somename",
                credential: "somecredentials"
            }]
        });

        if(document.socketObject.webcamStream) {
            pc.addStream(document.socketObject.webcamStream);
        }

        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function(stream) {
            var video = document.getElementById('myVideo');
            video.srcObject = stream;
            document.socketObject.webcamStream = stream;
            pc.addStream(stream);
        })
        .catch(function(err) {
            console.log("Something went wrong - do you have the right permissions?");
        })

        pc.onaddstream = function (obj) {
            console.log("Stream added!")
            that.connectedHandler(() => {
                var vid = document.getElementById("clientVideo");
                this.stream = obj.stream;
                vid.srcObject = obj.stream;
            })
        }
        
        this.socket.on('add-users', function (data) {
            let id = data.users[0];
            that.target_socket = id.to;
            if(id.from == that.socket.id) {
                let target = id.to;
                that.target_socket = target;
                console.log("GOT: "+JSON.stringify(id));
                createOffer(target);
            }       
        });
    
        this.socket.on('abrupt-remove', function(data) {
            const {removed, client} = data;
            if(that.socket.id.trim() == (removed ? removed : "").trim() || that.socket.id.trim() == (client ? client : "").trim()) {
                that.target_socket = null;
                document.getElementById("clientVideo").srcObject = null;
                that.disconnectedHandler();
            }
        })
    
        this.socket.on('offer-made', function (data) {
            that.offer = data.offer;
            pc.setRemoteDescription(new sessionDescription(data.offer), function () {
                pc.createAnswer(function (answer) {
                    pc.setLocalDescription(new sessionDescription(answer), function () {
                        that.socket.emit('make-answer', {
                            answer: answer,
                            to: data.socket
                        });
                    }, that.pcErrorHandler);
                }, that.pcErrorHandler);
            }, that.pcErrorHandler);
    
        });
    
        this.socket.on('answer-made', function (data) {
            that.connectedHandler(() => {
                pc.setRemoteDescription(new sessionDescription(data.answer), function () {
                    if (!that.answersFrom[data.socket]) {
                        createOffer(data.socket);
                        that.answersFrom[data.socket] = true;
                    }
                }, that.pcErrorHandler);
            });
        });

        function createOffer(id) {
            pc.createOffer(function (offer) {
                pc.setLocalDescription(new sessionDescription(offer), function () {
                    that.socket.emit('make-offer', {
                        offer: offer,
                        to: id
                    });
                }, that.pcErrorHandler);
            }, that.pcErrorHandler);
        }
    }
}