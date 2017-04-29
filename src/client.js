const SocketIOClient = require('socket.io-client')
const Emitter = require('./emitter')

/**
 * Represents a client WebSocket.
 */
class Client extends Emitter {
  /**
   * Creates a new instance of the Client class.
   * @param {WebContents} window - Electron browser window object.
   */
  constructor (window) {
    super()
    /**
     * @type {WebContents} - Holds an instance of the electron browser window object.
     */
    this.window = window

    /**
     * @private
     */
    this.io = null

    /**
     * @type {String} - Holds the latest command sent to the Socket server.
     */
    this.currentCommand = null
  }

  /**
   * Logs messages to the console.
   * @param {String} message - Message to be printed to the console.
   * @param {Boolean} [isError=false] - Determines if the message to be printed is an error message.
   * @returns {Void}
   */
  log (message, isError = false) {
    this.window.executeJavaScript(`console.info("[electron-aware] - ${(isError ? '(ERROR) ' : '')}${message}");`)
  }

  /**
   * Sends data to the Socket server.
   * @param {String} event - Data to send to the Socket server.
   * @param {Function} callback - Called when the data has been sent to the Socket server.
   * @returns {Void}
   */
  send (event, callback) {
    this.currentCommand = event
    this.io.emit(event, callback)
  }

  /**
   * Starts the Socket client.
   * @param {Function} callback - Called once the Socket client is connected.
   * @returns {Void}
   */
  start (callback) {
    const self = this
    self.io = SocketIOClient('http://localhost:8087')

    self.io.on('connect', () => {
      self.log('connected!')
      if (callback) callback()
    })

    self.io.on('message', ({event, args}) => {
      self.emit(event, args)
    })
  }
}

module.exports = Client
