var session = null;

export default class VonageWrapper {
  
  constructor(onConnect, onDisconnect) {
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.session = null;
  }

  startSession() {
    const SERVER = 'https://vontagetokbox-test.herokuapp.com';
    const that = this;

    fetch(SERVER + '/session').then(function(res) {
       return res.json()
    }).then(function(res) {
        that.apiKey = res.apiKey;
        that.sessionId = res.sessionId;
        that.token = res.token;
        that.initializeSession();
      }).catch(handleError);
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
      that.onDisconnect();
    })

    // Create a publisher
    var publisher = OT.initPublisher('myVideo', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);

    // Connect to the session
    session.connect(this.token, function(error) {
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
        that.onConnect();
      }
    });
  }

  // Called when the session needs to be ended
  endSession() {
    session.disconnect();
    session = null;
    this.onDisconnect();
  }
}

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}
