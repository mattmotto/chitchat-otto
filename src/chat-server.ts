/*
    Server configuration file to handle online video chat functionality
*/
import * as express from 'express';
import * as morgan from 'morgan';
import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';

import { Pairs } from "./models/pairs"
import generateSession from "./handlers/VonageHandler"

export class ChatServer {

    public static readonly PORT:number = 5000;
    private app: express.Application;
    private port: string | number;
    private server: Server;
    private io: SocketIO.Server;
    private socketsArray = [];
    private pairClient: any = new Pairs();

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
        this.app.use(express.static('public'));
        if(!process.env.PRODUCTION) {
            this.app.use(morgan('dev'));
        }
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connection', async (socket) => {

            const matchable = await this.pairClient.findMatch(socket.id);
            console.log("Email sent: "+socket.handshake.query.email);
            // Mode can be either "C" or "G"
            console.log("Mode sent: "+socket.handshake.query.mode);

            if (Object.keys(matchable).length != 0) {
                console.log("Found match for "+socket.id + " with: "+matchable["socket_id_1"]);
                const target_socket = matchable["socket_id_1"];
                this.pairClient.makeMatch(target_socket, socket.id);
                
                const sessionData = await generateSession();
                console.log("Session Data: "+JSON.stringify(sessionData));
                // Send a create message to both sockets

                this.io.to(`${socket.id}`).emit('start-session', {"to": socket.id, "from": target_socket, "sessionData": sessionData});
                this.io.to(`${target_socket}`).emit('start-session', {"to": socket.id, "from": target_socket, "sessionData": sessionData});

            } else {
                this.pairClient.addLoneSocket(socket.id);
            }

            // Instead of sending out a socket broadcast, add the socket to a record of availible sockets

            socket.on('disconnect', async () => {

                //Here, remove the socket ID from the table/whatever we're using to track those users that are waiting for a connection.
                this.socketsArray.splice(this.socketsArray.indexOf(socket.id), 1);
                const target = await this.pairClient.removeEntry(socket.id);
                const payload = {
                    removed: socket.id,
                    client: target
                }
                // NOTE: this.io.emit sends to ALL connections, INCLUDING the sender
                // This is important because if SOMEONE is connected to this socket, we need to disconnect them
                this.io.emit('abrupt-remove', payload);
            });
            
            /*
                If I understand sockets right, we can leave the below two functions untouched. However, I could be very, very wrong. We'll find out.
            */

            // @Otto
            socket.on('wants-friend', (data) => {
                // We know who wants to friend the person they're talking to
                // Pull the person they're talking to, and assign that value to friend_socket
                //this.io.to(`${talking_to}`).emit('friend-requested', {});
            })

            /*
            socket.on('make-offer', (data) => {
                socket.to(data.to).emit('offer-made', {
                    offer: data.offer,
                    socket: socket.id
                });
            });

            socket.on('make-answer', (data) => {
                socket.to(data.to).emit('answer-made', {
                    socket: socket.id,
                    answer: data.answer
                });
            });
            */
        });
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

     
    private sockets(): void {
        this.io = socketIo(this.server);
    }

    public getApp(): express.Application {
        return this.app;
    }
}
