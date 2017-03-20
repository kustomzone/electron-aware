const Server = require("./server");

const server = new Server();

module.exports = {
    closed(callback) {
        server.on("electron-closed", callback);
    },

    on(event, handler) {
        server.on(event, handler);
    },

    refresh() {
        server.log("refreshing page...");
        server.send("refresh-page");
    },

    reload() {
        server.log("reloading electron...");
        server.send("reload-app");
    },
    
    start() {
        server.start();
    }
};