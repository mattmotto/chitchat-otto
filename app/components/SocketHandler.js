export const SocketHandler = (socket, toggleConnection) => {
    var target_socket = null;
    var answersFrom = {}, offer;
    var peerConnection = window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection ||
        window.msRTCPeerConnection;

    var sessionDescription = window.RTCSessionDescription ||
        window.mozRTCSessionDescription ||
        window.webkitRTCSessionDescription ||
        window.msRTCSessionDescription;

        navigator.getUserMedia  = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    var pc = new peerConnection({
        iceServers: [{
            url: "stun:stun.services.mozilla.com",
            username: "somename",
            credential: "somecredentials"
        }]
    });

    pc.onaddstream = function (obj) {
        var vid = document.getElementById("clientVideo");
        vid.srcObject = obj.stream;
    }

    navigator.getUserMedia({video: true, audio: true}, function (stream) {
        var video = document.querySelector('video');
        video.srcObject = stream;
        pc.addStream(stream);
    }, error);

    socket.on('add-users', function (data) {
        let id = data.users[0];
        target_socket = id.to;
        if(id.from == socket.id) {
            let target = id.to;
            target_socket = target;
            console.log("GOT: "+JSON.stringify(id));
            createOffer(target);
        }       
    });

    socket.on('abrupt-remove', function(id) {
        if(id == socket.id || id == target_socket) {
            target_socket = null;
            document.getElementById("clientVideo").srcObject = null;
            toggleConnection();
        }
    })

    socket.on('remove-user', function (id) {
        console.log("Graceful remove");
    });


    socket.on('offer-made', function (data) {
        offer = data.offer;
        pc.setRemoteDescription(new sessionDescription(data.offer), function () {
            pc.createAnswer(function (answer) {
                pc.setLocalDescription(new sessionDescription(answer), function () {
                    socket.emit('make-answer', {
                        answer: answer,
                        to: data.socket
                    });
                }, error);
            }, error);
        }, error);

    });

    socket.on('answer-made', function (data) {
        toggleConnection(() => {
            pc.setRemoteDescription(new sessionDescription(data.answer), function () {
                if (!answersFrom[data.socket]) {
                    createOffer(data.socket);
                    answersFrom[data.socket] = true;
                }
            }, error);
        });
    });

    function createOffer(id) {
        pc.createOffer(function (offer) {
            pc.setLocalDescription(new sessionDescription(offer), function () {
                socket.emit('make-offer', {
                    offer: offer,
                    to: id
                });
            }, error);
        }, error);
    }

    function error(err) {
        console.warn('Error', err);
    }
}