var session = null;

export default class VonageWrapper {
  
  constructor(socket, onConnect, onDisconnect, friendStateHandler, confirmFriendHandler) {
    this.socket = socket
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.friendStateHandler = friendStateHandler;
    this.confirmFriendHandler = confirmFriendHandler;
    document.myActiveConnection = this;
  }

  startSession() {
    // const SERVER = 'https://vontagetokbox-test.herokuapp.com';
    const that = this;

    this.socket.on('start-session', function (data) {
      console.log("Connection from: "+data.client);
      document.clientSocket = data.client;
      document.clientDataStore = data.clientData;
      that.apiKey = data.sessionData.apiKey;
      that.sessionId = data.sessionData.sessionId;
      that.token = data.sessionData.token;
      console.log("Initialising Session...");
      that.initializeSession();
    })

    this.socket.on('friend-check', function() {
      that.friendStateHandler(true);
    })

    this.socket.on('confirm-friend', function() {
      that.confirmFriendHandler(true);
    })

    this.socket.on('reject-friend', function() {
      that.confirmFriendHandler(false);
    })

    this.socket.on('abrupt-remove', function (data) {
      console.log("connectionDestroyed has been called as well, terminating session...");
    })

    this.socket.on('terminate-session', function () {
      document.myActiveConnection.onDisconnect(() => {
        document.myActiveConnection.socket.disconnect();
        session.disconnect();
        session = null;
      });
    })
  }

  initializeSession() {
    session = OT.initSession(this.apiKey, this.sessionId);
    var that = this;
    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
      session.subscribe(event.stream, 'clientVideo', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
      }, handleError);
    });

    session.on('connectionDestroyed', function(event) {
      document.clientSocket = null;
      document.clientDataStore = {};
      that.onDisconnect();
    })

    // Connect to the session
    session.connect(this.token, function(error) {
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        handleError(error);
      } else {
        that.onConnect(document.clientDataStore, () => {
          var publisher = OT.initPublisher('myVideo', {
            insertMode: 'append',
            width: '100%',
            height: '100%'
          }, handleError);
          session.publish(publisher, handleError);
        })
        // that.onConnect();
      }
    });
  }

  sendFriendMessage(mode) {
    console.log("Sending friend request...");
    this.socket.emit('friend-requested', mode);
  }

  confirmFriendRequest(mode) {
    this.socket.emit('friend-confirmed', mode);
  }

  endSession() {
    document.myActiveConnection.onDisconnect(() => {
      document.myActiveConnection.socket.disconnect();
      if(session != null) {
        session.disconnect();
        session = null; 
      }
    });
  }

}

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}
