const fs = require('fs')
const {exec} = require('child_process')
const SocketIO = require('socket.io')
const electronPath = require.resolve('.bin/electron')
const logger = require('./logger')
const Emitter = require('./emitter')

if (!fs.existsSync(electronPath)) {
  throw new Error(`Unable to find Electron in '${electronPath}'`)
}

/**
 * Starts the electron application.
 * @param {String} electronMain - The path of the electron main application script.
 * @returns {Void}
 */
const startElectron = (electronMain) => {
  logger(`running ${electronMain}`)
  exec(`${electronPath} ${electronMain}`, (error) => {
    if (error) {
      logger(error, true)
    }
  })
}

/**
 * Used to send and receive data from the electron application.
 * @extends {Emitter}
 */
class Server extends Emitter {
  /**
   * Creates a new instance of the Server class.
   */
  constructor () {
    super()
    /**
     * @type {SocketIO} - SocketIO server.
     * @private
     */
    this.io = null
  }

  /**
   * Enables or disables logging console messages.
   * @param {Boolean} allow - Determines if messages can be logged to the console.
   * @returns {Void}
   */
  allowLogging (allow) {
    logger.enabled = allow
  }

  /**
   * Raised when an error occurs.
   * @param {Function} listener - Called when an error occurred.
   * @return {Void}
   */
  onError (listener) {
    this.on('error', listener)
  }

  /**
   * Closes the electron application.
   * @returns {Void}
   */
  close () {
    logger('closing electron...')
    this._ioEmit('close-app')
  }

  /**
   * Refreshes the page on the electron application.
   * @returns {Void}
   */
  refresh () {
    logger('refreshing page...')
    this._ioEmit('refresh-page')
  }

  /**
   * Reloads the electron application.
   * @returns {Void}
   */
  reload () {
    logger('reloading electron...')
    this._ioEmit('reload-app')
  }

  /**
   * Initializes the event listeners for the client sockets.
   * @param {String} electronMain - The path of the electron main application script.
   * @param {Socket} socket - Client socket.
   * @returns {Void}
   * @private
   */
  _initializeConnection (electronMain, socket) {
    const self = this

    socket.on('restart-app', (fn) => {
      self._run(() => {
        fn()
        startElectron(electronMain)
        logger('electron reloaded')
        self.emit('electron-reloaded')
      })
    })

    socket.on('page-refreshed', () => {
      self._run(() => {
        logger('page refreshed')
        self.emit('page-refreshed')
      })
    })

    socket.on('online', () => {
      self._run(() => {
        logger('electron started')
        self.emit('electron-started')
      })
    })

    socket.on('offline', () => {
      self._run(() => {
        logger('electron closed')
        self.emit('electron-closed')
        self.io.close()
      })
    })
  }

  /**
   * Runs the supplied worker function and handles any errors that may occur.
   * @param {Function} worker - Calls the function and handles any errors that may occur.
   * @returns {Void}
   * @private
   */
  _run (worker) {
    try {
      if (worker) worker.call(this)
    } catch (e) {
      this.emit('error', e)
    }
  }

  /**
   * Raises a specific event on all client sockets.
   * @param {String} event - The event to raise on all client sockets.
   * @param {Object} [args] - Arguments to send to the event. (Optional)
   * @returns {Void}
   * @private
   */
  _ioEmit (event, args) {
    this.io.emit('message', { event, args })
  }

  /**
   * Starts the electron application and WebSocket Server.
   * @param {String} [electronMain='.'] - The path of the electron main application script.
   * @returns {Void}
   */
  start (electronMain = '.') {
    const self = this
    self.io = SocketIO()
    self.io.on('connection', (socket) => {
      self._run(() => {
        self._initializeConnection(electronMain, socket)
      })
    })
    self.io.listen(8087)
    startElectron(electronMain)
  }
}

module.exports = new Server()
