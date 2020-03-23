/*
    Server configuration file to handle online video chat functionality
*/
import * as express from 'express';
import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';

import { Pairs } from "./models/Pairs"

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
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connection', async (socket) => {
            /*
                Here, I'm emitting a list of users back to the socket that made the connection - this is what is being used to click a socket.
                When the socket connects, we send this back before anything else
                Instead of this, track the list of connected users using a DB, and return only one user -> the one that must be connected to.
                We can treat this as a queue - those that have been waiting the longest, get a connection first.
                It's worth noting that this returns only one user too - but it just returns every user that the client adds - which we don't want

                When two users connect, the client will send a request asking for user information - this will be unconnected from the backend process used to pair devices based on socket

                NOTE: socket.broadcast.emit sends to ALL connections EXCEPT the sender. This makes sense - the sender shouldn't be able to connect with themselves.

                It's worth noting that IDs are unique (https://stackoverflow.com/questions/20962970/how-unique-is-socket-id)
            */

            console.log("Recieving connection from: "+socket.id)

            const matchable = await this.pairClient.findMatch(socket.id);
            
            if (Object.keys(matchable).length != 0) {
                console.log("Found match for "+socket.id + " with: "+matchable["socket_id_1"]);
                const target_socket = matchable["socket_id_1"];
                this.pairClient.makeMatch(target_socket, socket.id);
                // Send a create-chat message to the second socket with the data about the first socket
                socket.broadcast.emit('add-users', {
                    users: [{"to": socket.id, "from": target_socket}]
                });
            } else {
                console.log("No match found, adding as a lone socket");
                this.pairClient.addLoneSocket(socket.id);
            }

            // Instead of sending out a socket broadcast, add the socket to a record of availible sockets

            socket.on('disconnect', () => {

                //Here, remove the socket ID from the table/whatever we're using to track those users that are waiting for a connection.
                this.socketsArray.splice(this.socketsArray.indexOf(socket.id), 1);
                this.pairClient.removeEntry(socket.id);

                // NOTE: this.io.emit sends to ALL connections, INCLUDING the sender
                // This is important because if SOMEONE is connected to this socket, we need to disconnect them
                this.io.emit('remove-user', socket.id);
            });
            
            /*
                If I understand sockets right, we can leave the below two functions untouched. However, I could be very, very wrong. We'll find out.
            */

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