(() => {
    "use strict";

    const WebSocket = require("ws");
    const {EventEmitter} = require("events");
    const Ultron = require("ultron");

    const events = new EventEmitter();
    let window = null;
    const ultron = new Ultron(events);

    function Client(window) {
        this.window = window;
        this.currentCommand = "";
    };

    let proto = Client.prototype;

    proto.log = function(message, isError) {
        this.window.executeJavaScript(`console.info("[electron-live] - ${(isError ? "(ERROR) " : "")}${message}");`);
    };

    proto.on = function(event, handler) {
        if(typeof event === "object" && handler === undefined) {
            Object.keys(event).forEach((name) => {
                ultron.on(name, event[name]);
            }, this);
        }
        else if(typeof event === "string" && typeof handler === "function") {
            ultron.on(event, handler);
        }
    };

    proto.send = function(event, callback) {
        if(!this.ws) throw "Call the start method first!";
        this.currentCommand = event;
        this.ws.send(event, callback);
    };

    proto.start = function(callback) {
        const thiz = this;
        thiz.ws = new WebSocket("ws://localhost:8087");

        thiz.ws.on("open", () => {
            thiz.log("connected!");
            if(callback) callback();
        });

        thiz.ws.on("message", (event) => {
            events.emit(event);
        });
    };

    module.exports = Client;

})();