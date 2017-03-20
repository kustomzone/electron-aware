/*eslint no-undef: "error"*/
/*eslint-env node*/

const fs = require("fs");
const electron_path = require("path").resolve(__dirname, "../../.bin/electron");

if(!fs.existsSync(electron_path)) throw `Unable to find Electron in '${electron_path}'`;

const {EventEmitter} = require("events");
const Ultron = require("ultron");
const WebSocket = require("ws");
const {exec} = require("child_process");

const events = new EventEmitter();
const ultron = new Ultron(events);

class Server {
    constructor() {
        this.wss = null;
    }

    isStarted() {
        let result = true;
        if(this.wss === null) {
            this.log("Call the start method first!", true);
            result = false;
        }
        return result;
    }

    log(message, isError) {
        console.log(`[electron-aware] - ${(isError ? "(ERROR) " : "")}${message}`);
    }

    on(event, handler) {
        if(typeof event === "object" && handler === undefined) {
            Object.keys(event).forEach((name) => {
                ultron.on(name, event[name]);
            });
        }
        else if(typeof event === "string" && typeof handler === "function") {
            ultron.on(event, handler);
        }
    }

    send(data) {
        if(!this.isStarted()) return;
        this.wss.clients.forEach((client) => client.send(data));
    }

    start() {
        const thiz = this;
        thiz.wss = new WebSocket.Server({ port: 8087 }, thiz.startElectron);
        thiz.wss.on("connection", (ws) => {
            ws.on("message", (data) => {
                switch(data) {
                case "restart-app": {
                    thiz.startElectron();
                } return;
                case "online": {
                    thiz.log("electron started...");
                    events.emit("electron-started");
                } break;
                case "offline": {
                    thiz.log("electron closed...");
                    events.emit("electron-closed");
                } break;
                }
            });
        });
    }

    startElectron() {
        const thiz = this;
        exec(`${electron_path} .`, (error) => {
            if(error){
                thiz.log(error, true);
                return;
            }
        });
    }
}

module.exports = Server;