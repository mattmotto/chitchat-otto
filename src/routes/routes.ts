/*
    Wrapper class to configure various server side routes for mobile application interaction
*/

import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

export class Routes {

    private app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
        this.setStaticDir();
        this.setupBodyParser();
    }

    private setupBodyParser(): void {
        this.app.use(bodyParser.urlencoded({ extended: false }));
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
        */
        this.app.post('/loginuser', (request, response) => {
            let data = request.body;
            console.log("You've hit a sample POST route, data: "+JSON.stringify(data));
        });

        /*
            Route to sign up existing user
        */
        this.app.post('/signupuser', (request, response) => {
            let data = request.body;
            console.log("You've hit a sample POST route, data: "+JSON.stringify(data));
        });

        /*
            Route to get information for an existing user, just as they're being matched to someone else for a video call
        */
        this.app.post('/getuserinfo', (request, response) => {
            let data = request.body;
            console.log("You've hit a sample POST route, data: "+JSON.stringify(data));
        });

        /*
            Route to create an entry in the user_matches table, for two users who've decided to share their details
        */
        this.app.post('/createusermatch', (request, response) => {
            let data = request.body;
            console.log("You've hit a sample POST route, data: "+JSON.stringify(data));
        });

        /*
            Route to get all matched entires from the user_matches table, for a particular user
        */
        this.app.post('/getusermatches', (request, response) => {
            let data = request.body;
            console.log("You've hit a sample POST route, data: "+JSON.stringify(data));
        });

        /*
            Route to delete a match from a user's list (doesn't delete it for the other user they've matched with) - the match still exists, is just hidden for a user
        */
        this.app.post('/deleteusermatch', (request, response) => {
            let data = request.body;
            console.log("You've hit a sample POST route, data: "+JSON.stringify(data));
        });
    }

}