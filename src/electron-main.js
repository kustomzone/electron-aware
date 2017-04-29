const {app} = require('electron')
const Client = require('./client')

/**
 * Used to connect to the electron-aware server.
 */
module.exports = {
  /**
   * Initializes the electron-aware client.
   * @param {BrowserWindow} BrowserWindow
   * @returns {Void}
   */
  initialize (BrowserWindow) {
    if (!BrowserWindow) throw new Error('Please supply a BrowserWindow object!')

    let window = null
    let client = this.client = new Client(window = BrowserWindow.webContents)

    client.on('close-app', () => app.exit(0))
    client.on('refresh-page', () => {
      window.reload()
      client.send('page-refreshed')
      client.log('page refreshed!')
    })

    client.on('reload-app', () => {
      client.log('restarting app')
      client.send('restart-app', app.quit)
    })

    client.start(() => client.send('online'))

    app.on('quit', () => {
      if (client.currentCommand === 'restart-app') return
      client.send('offline')
    })
  }
}
