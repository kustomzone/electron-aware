(() => {
    "use strict";
    
    module.exports = require("extend")(
        { 
            main: require("./lib/electron-main") 
        }, 
        require("./lib/external")
    );
})();
