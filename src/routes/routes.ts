/*
    Wrapper class to configure various server side routes for mobile application interaction
*/

import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import {Users} from '../models/users';
import {Matches} from '../models/matches';
import {Logins} from '../models/logins';

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
        this.app.use(express.static(path.join(__dirname, '../views')));
    }

    public getRoutes(): void {

        /*
            Serve the index page
        */
        this.app.get('/', (request, response) => {
            response.sendFile('index.html');
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
                "status":0
            }
            where:
            0: success
            1: wrong email
            2: wrong password
        */

        this.app.post('/loginuser', async (request, response) => {
            let {email, password} = request.body;
            let ans = await new Users().loginUser(email, password);
            if (ans['status'] == 0){
                new Users().updateLoginTime(ans['auto_id']);
                new Logins().addLogin(ans['auto_id']);
            }
            response.json({"status":ans});
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
                "response":0
            }
            0: success
            anything else: failure
        */
        this.app.post('/signupuser', (request, response) => {
            let {name, email, password, university, photo_url, instagram_id, snapchat_id} = request.body;
            new Users().makeUser(name, email, password, university, photo_url, instagram_id, snapchat_id);
            response.json({"status":0});
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
                "response":0
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

            request is a json object of the format:
            {
                "user":1
            }

            response is a json object of the format:
            {
                "status":0,
                "matches":
                    [
                        {
                            "auto_id",
                            "user_1",
                            "user_2"
                        },
                        ...
                    ]
            }

        */
        this.app.post('/getusermatches', async (request, response) => {
            let {user} = request.body;
            let matches = await new Matches().getMatches(user);
            response.json({'status':0, 'matches':matches});
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
                "response":0
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
    }

}