(() => {
    "use strict";

    const fs = require("fs");
    const electron_path = require("path").resolve(__dirname, "../../.bin/electron");

    if(!fs.existsSync(electron_path)) throw `Unable to find Electron in '${electron_path}'`;
    
    const {EventEmitter} = require("events");
    const Ultron = require("ultron");
    const WebSocket = require("ws");
    const {exec} = require("child_process");

    const events = new EventEmitter();
    const ultron = new Ultron(events);

    function Server() {
        this.wss = null;
    };

    let proto = Server.prototype;

    proto.isStarted = function() {
        let result = true;
        if(this.wss === null) {
            this.log("Call the start method first!", true);
            result = false;
        }
        return result;
    };

    proto.log = function(message, isError) {
        console.log(`[electron-aware] - ${(isError ? '(ERROR) ' : '')}${message}`);
    };

    proto.on = function(event, handler) {
        if(typeof event === "object" && handler === undefined) {
            Object.keys(event).forEach((name) => {
                ultron.on(name, event[name]);
            });
        }
        else if(typeof event === "string" && typeof handler === "function") {
            ultron.on(event, handler);
        }
    };

    proto.send = function(data) {
        if(!this.isStarted()) return;
        this.wss.clients.forEach((client) => client.send(data));
    };

    proto.start = function() {
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
    };

    proto.startElectron = function() {
        const thiz = this;
        exec(`${electron_path} .`, (error) => {
            if(error){
                thiz.log(error, true);
                return;
            }
        });
    };

    module.exports = Server;

})();
