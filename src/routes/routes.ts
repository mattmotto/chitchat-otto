/*
    Wrapper class to configure various server side routes for mobile application interaction
*/

import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';

import {Users} from '../models/users';
import {Matches} from '../models/matches';
import {Logins} from '../models/logins';
import {Universities} from '../models/universities';
import {Reports} from '../models/reports';
import {Pairs} from '../models/pairs';
import {Email} from '../handlers/SendGridHandler';

const DIST_DIR = path.join(__dirname, '../../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const PASS = "GULATI6969";

const ID = 'REDACTED';
const SECRET = 'REDACTED';
const BUCKET = "chitchat-us-bucket";

let s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region: "us-east-2"
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()+file.originalname)
    }
  })
})


export class Routes {

    private app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
        this.setStaticDir();
        this.setupConfig();
    }

    private setupConfig(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    
    private setStaticDir(): void {
        this.app.use(express.static(DIST_DIR));
    }

    public getRoutes(): void {

        /*
            Route to login existing user

            request is a json object of format:
            {
                "email":"email",
                "password":"password"
            }

            response is a json object of format:
            {
                "status":0,
                'auto_id':1,
                first_login: true/false
            }
            where:
            0: success
            1: wrong email
            2: wrong password
            3: banned
        */

        this.app.post('/loginuser', async (request, response) => {
            let {email, password} = request.body;
            let ans = await new Users().loginUser(email, password);
            let first_login = false;
            if (ans['status'] == 0){
                new Users().updateLoginTime(ans['auto_id']);
                new Logins().addLogin(ans['auto_id']);
                if(ans['last_login'] == null){
                    first_login = true;
                }
                response.json({"status":ans['status'], "auto_id": ans['auto_id'], 'first_login':first_login});
            } else {
                response.json({"status":ans['status']});
            }
        });

        /*
            Route to sign up existing user

            request is a json object of format:
            {
                "name":"name",
                "email":"email",
                "password":"password",
                "university":"university",
                "photo_url":"photo_url",
                "instagram_id":"instagram_id",
                "snapchat_id":"snapchat_id"
            }

            response is a json object of format:
            {
                "status":0
            }
            0: success
            1: user already exists
        */
        this.app.post('/signupuser', async (request, response) => {
            let {name, email, password, university, photo_url, instagram_id, snapchat_id} = request.body;
            let ans = await new Users().makeUser(name, email, password, university, photo_url, instagram_id, snapchat_id);
            if (ans['status'] == 0){
                new Email().welcomeEmail(email);
            }

            response.json(ans);
        });

        /*
            Route to get information for an existing user, just as they're being matched to someone else for a video call

            request is a json object of the format:
            {
                "auto_id":1
            }

            Response is a json object of the format:
            {
                "status":0,
                "data":
                    {
                        "name":"name",
                        "email":"email",
                        "university":"university",
                        "photo_url":"photo_url",
                        "instagram_id":"instagram_id",
                        "snapchat_id":"snapchat_id"
                    }
            }
        */
        this.app.post('/getuserinfo', async (request, response) => {
            let {auto_id} = request.body;
            let user = await new Users().getUser(auto_id);
            response.json({"status":0, 'data':user});
        });

        /*
            Route to get all matched entries from the user_matches table, for a particular user

            request is a json object of the format: (Pages start counting from 0)
            {
                "user":1,
                "pageNumber":0,
                "pageLength":10
            }

            response is a json object of the format:
            {
                matches: [
                    {
                        "auto_id": 1,
                        "name": "name",
                        "email": "me@me.com",
                        "university": "Columbia University",
                        "photo_url": "photo_url",
                        "instagram_id": "instagram_id",
                        "snapchat_id": "snapchat_id",
                        "is_banned": {
                            "type": "Buffer",
                            "data": [
                                1
                            ]
                        }
                    },
                    ...
                ],
                hasNextPage: true/false
            }

        */
        this.app.post('/getusermatches', async (request, response) => {
            let {user, pageNumber, pageLength} = request.body;
            let matches = await new Matches().getMatches(user);
            let ans = [];
            let next_page = false;
            for (let i = 0; i < matches["length"]; i++){
                ans.push(await new Users().getUser(matches["data"][i]["user_2"]));
            }
            let start = pageNumber * pageLength;
            if (ans[start+pageLength+1]){
                next_page = true;
            }
            response.json({"matches":ans.splice(start, pageLength), "hasNextPage":next_page});
        });

        /*
            Route to delete a match from a user's list (doesn't delete it for the other user they've matched with) - the match still exists, is just hidden for a user

            request is a json object of the format:
            {
                "user_1":1,
                "user_2":2
            }

            response is a json object of format:
            {
                "status":0
            }
            0: success
            anything else: failure
        */
        this.app.post('/deleteusermatch', (request, response) => {
            let {user_1, user_2} = request.body;
            new Matches().deleteMatch(user_1, user_2);
            response.json({"status":0});
        });

        /*
        Route to get a list of university names.

        Request is nothing

        Response is json object of format:
        [
            {
                "name": "Abilene Christian University"
            },
            {
                "name": "Academy Of Art University"
            },
            {
                "name": "Acadia University"
            },
            ...
        ]
        */
        this.app.post('/getuniversities', async (request, response) => {
            let data = await new Universities().getUniversityNames();
            response.json(data);
        });

        /*
            Route to ban a user

            Request is json object of format:
            {
                "user":1
            }

            response is json object of format:
            {
                "status":0
            }
        */
        this.app.post('/banuser', (request, response) => {
            let {user} = request.body
            new Users().banUser(user);
            response.json({'status':0});
        });

        /*
            Route to report a user

            Request is json object of format:
            {
                "user":1,
                "reported_by":2,
                'report_description':"text"
            }

            response is json object of format:
            {
                "status":0
            }
        */
        this.app.post('/reportuser', (request, response) => {
            let {user, reported_by, report_description} = request.body;
            new Reports().reportUser(user, reported_by, report_description);
            response.json({'status':0});
        });

        /*
            Route to handle a lost password

            Request is json object of format:
            {
                "user":1
            }

            response is json object of format:
            {
                "status":0
            }
            0: success
            1: user not found
        */
       this.app.post('/lostpassword', async (request, response) => {
           let {email} = request.body;
           let exists = await new Users().getUserByEmail(email);
           if (exists != {}) {
               new Users().updateLostPassword(exists['auto_id']);
               response.json({'status':0});
           } else {
               response.json({'status':1});
           }
       });

       /*
            Route to change a user's password

            request is a json object of format:
            {
                "user":1,
                "password":"password",
                "newPass":"newPassword"
            }

            response is a json object of format:
            {
                "status":0
            }
            
            0:success
            1:wrong password
            2:user not found. Big not good.
        */
       this.app.post('/changepassword', async (request, response) => {
           let {user, password, newPass} = request.body;
           let ans = await new Users().changePassword(user, password, newPass);
           response.json({'status':ans['status']});
       });

       /*
            Route to change a user's password

            request is a json object of format:
            {
                "user":1,
                "snapchat_id":"password",
                "instagram_id":"newPassword"
            }

            response is a json object of format:
            {
                "status":0
            }
            
            0:success
            anything else: failure
        */
       this.app.post('/updatesocialmedia', (request, response) => {
           let{user, snapchat_id, instagram_id} = request.body;
           new Users().updateSocial(user, snapchat_id, instagram_id);
           response.json({"status":0});
       });

       /*
            Route to change a user's password

            request is a json object of format:
            {
                "user":1,
                "pic":idk
            }

            response is a json object of format:
            {
                "status":0
            }
            
            0:success
        */
       this.app.post('/uploadprofpic', upload.single('profilePicture'), (req, res) => {
           let { user } = req.body;
           let aws_url = req["file"]["location"];
           new Users().updateProfPic(user, aws_url);
           res.json({
               status: 0,
               url: aws_url
           })
       });
        
        /*
            Route to get usage stats

            request:
            {
                "password":"GULATI6969"
            }

            Response:
            {
                "status":0,
                ...
            }
       */
       this.app.post('/getuserstats', async (request, response) => {
           let {password} = request.body;
           if (password == PASS){
               let ans = await new Users().getStats();
               response.json({'status':0, 'numUsers':ans['numUsers'], 'numLogins':ans['numLogins'], 'avgLogins':ans['avgLogins']});
           } else {
               response.json({'status': 1});
           }
       });

       /*
            Route to get number of active users

            request:
            {
            }

            Response:
            {
                "status":0,
                "num":1
            }
       */
       this.app.post('/countactiveusers', async (request, response) => {
           let { auto_id } = request.body;
           let { university, all } = await new Pairs().getAllActive(auto_id);
           response.json({
               status: 0,
               university,
               all
           });
       });

        /*
            THIS MUST ALWAYS BE AT THE BOTTOM
            Serve the index page - anything that isn't one of these - leave it to the React Router
        */
       this.app.get('*', (request, response) => {
           response.sendFile(HTML_FILE);
       });
    }
}
