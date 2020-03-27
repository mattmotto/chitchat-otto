import * as OpenTok from 'opentok';

const APIKEY="46617272"
const SECRET="e06ab8a3c425f2c11d79cb7e77f38b22cad3780d"
const opentok = new OpenTok(APIKEY, SECRET);

const generateSession = () : Promise<Object> => {
    return new Promise((resolve, reject) => {
        var payload = {}
        payload["apiKey"] = APIKEY;
        opentok.createSession({ mediaMode: 'routed' }, (err, session) => {
            if (err) throw err;
            const token = opentok.generateToken(session.sessionId);
            payload["sessionId"] = session.sessionId;
            payload["token"] = token;
            resolve(payload);
        })
    })
}

export default generateSession;