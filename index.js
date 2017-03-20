const extend = require("extend");
const main = require("./dest/electron-main");
const external = require("./dest/external");

module.exports = extend({ 
    main:  main
}, external);