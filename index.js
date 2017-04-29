const logger = require('./dist/logger')

logger("Please call 'const aware = require('electron-aware/server')' outside of the main Electron process.", true)
logger("Please call 'const aware = require('electron-aware/main')' inside of the main Electron process.", true)
