/*
    Wrapper class to configure various server side routes for mobile application interaction
*/

import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import {Users} from '../models/users';
import {Matches} from '../models/matches';
import {Logins} from '../models/logins';
import {Universities} from '../models/universities';
import {Reports} from '../models/reports';

const DIST_DIR = path.join(__dirname, '../../dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW

export class Routes {

    private app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
        this.setStaticDir();
        this.setupBodyParser();
    }

    private setupBodyParser(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    
    private setStaticDir(): void {
        this.app.use(express.static(DIST_DIR));
    }

    public getRoutes(): void {

        /*
            Serve the index page
        */
        this.app.get('/', (request, response) => {
            response.sendFile(HTML_FILE);
        });

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
            Route to create an entry in the user_matches table, for two users who've decided to share their details

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
        this.app.post('/createusermatch', (request, response) => {
            let {user_1, user_2} = request.body;
            new Matches().makeMatch(user_1, user_2)
            response.json({"status":0});
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
            [
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
            ]

        */
        this.app.post('/getusermatches', async (request, response) => {
            let {user, pageNumber, pageLength} = request.body;
            let matches = await new Matches().getMatches(user);
            let ans = [];
            for (let i = 0; i < matches["length"]; i++){
                ans.push(await new Users().getUser(matches["data"][i]["user_2"]));
            }
            let start = pageNumber * pageLength;
            response.json(ans.splice(start, pageLength));
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
            console.log("deleted user match for users " + user_1 + " and " + user_2);
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
            console.log("banned user " + user);
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
            console.log("User " + reported_by + " reported user " + user + " for " + report_description);
            response.json({'status':0});
        });
    }
}