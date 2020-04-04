var session = null;

export default class VonageWrapper {
  
  constructor(socket, onConnect, onDisconnect, friendStateHandler, confirmFriendHandler, hadStreamError) {
    this.socket = socket
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.friendStateHandler = friendStateHandler;
    this.confirmFriendHandler = confirmFriendHandler;
    this.hadStreamError = hadStreamError;
    document.myActiveConnection = this;
  }

  startSession() {
    // const SERVER = 'https://vontagetokbox-test.herokuapp.com';
    const that = this;

    this.socket.on('start-session', function (data) {
      document.clientSocket = data.client;
      document.clientDataStore = data.clientData;
      that.apiKey = data.sessionData.apiKey;
      that.sessionId = data.sessionData.sessionId;
      that.token = data.sessionData.token;
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
    })

    this.socket.on('terminate-session', function () {
      document.myActiveConnection.onDisconnect(() => {
        document.myActiveConnection.socket.disconnect();
        if(session != null) {
          session.disconnect();
          session = null;
        }
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
      }, function(err) {
        if(err) {
          console.log("STREAM ERROR");
          handleError(err);
        }
      });
    });

    session.on('connectionDestroyed', function(event) {
      document.clientSocket = null;
      session = null;
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
          }, function(err) {
            if(err) {
              console.log("INIT PUBLISH ERROR");
              handleError(err);
            } else {
              session.publish(publisher, function (error) {
                if(error) {
                  console.log("PUBLISH ERROR");
                  handleError(error);
                }
              });
            }
          });
        })
        // that.onConnect();
      }
    });
  }

  sendFriendMessage(mode) {
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
  console.log(error);
  if (error.name === 'OT_USER_MEDIA_ACCESS_DENIED' || error.name=== 'OT_HARDWARE_UNAVAILABLE') {
    document.myActiveConnection.onDisconnect(()=> {
      document.myActiveConnection.socket.disconnect();
      document.clientSocket = null;
      if(session != null) {
        session.disconnect();
        session = null; 
      }
      document.myActiveConnection.hadStreamError("Oops! It looks like we can't access your microphone/webcam. Please check your permissions settings for your web browser");
    })
  } else {
    document.myActiveConnection.onDisconnect(() => {
      document.myActiveConnection.socket.disconnect();
      document.clientSocket = null;
      if(session != null) {
        session.disconnect();
        session = null; 
      }
      document.myActiveConnection.hadStreamError("Oops! An unexpected error occured. Please try refreshing your browser window, or trying again later");
    });
  }
}
