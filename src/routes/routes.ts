/*
    Wrapper class to configure various server side routes for mobile application interaction
*/

import * as express from 'express';
import * as path from 'path';

export class Routes {

    private app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
        this.setStaticDir();
    }

    private home(): void {
        this.app.get('/', (request, response) => {
            response.sendFile('index.html');
        });

        this.app.get('/myrouteget', (request, response) => {
            console.log("You've hit a sample GET route");
        });

        this.app.get('/myroutepost', (request, response) => {
            console.log("You've hit a sample POST route");
        });
    }
    
    private setStaticDir(): void {
        this.app.use(express.static(path.join(__dirname, '../views')));
    }

    public getRoutes(): void {
        this.home();
    }

}