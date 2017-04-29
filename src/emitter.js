const {EventEmitter} = require('events')

/**
 * A simplified version of the EventEmitter object.
 */
class Emitter {
  /**
   * Creates a new instance of the Emitter object.
   */
  constructor () {
    /**
     * @private
     */
    this.events = new EventEmitter()
  }

  /**
   * Listens to a specific event.
   * @param {String} event - The event to listen for.
   * @param {Function} listener - Called once the event is raised.
   */
  on (event, listener) {
    this.events.on(event, listener)
  }

  /**
   * Raises a specific event.
   * @param {String} event - The event to emit.
   * @param {Object} [args] - Arguments to send to the event.
   */
  emit (event, args) {
    this.events.emit(event, args)
  }
}

module.exports = Emitter
