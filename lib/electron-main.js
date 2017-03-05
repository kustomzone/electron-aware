(() => {
    "use strict";

    const {app} = require("electron");
    const Client = require("./client");

    module.exports = {
        initialize(BrowserWindow) {
            if(!BrowserWindow) throw "Please supply a BrowserWindow object!";

            let window = null;
            let client = new Client(window = BrowserWindow.webContents);

            client.on({
                "refresh-page": () => {
                    window.reload();
                    client.log("page refreshed!");
                },
                "reload-app": () => {
                    client.send("restart-app", app.quit);
                }
            });

            client.start(() => client.send("online"));

            app.on("quit", () => {
                if(client.currentCommand === "restart-app") return;
                client.send("offline");
            });
        }
    };

})();
