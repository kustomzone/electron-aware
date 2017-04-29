const aware = require('../server')

require('mocha')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
chai.should()

const {describeIt, itAsPromise} = require('./test-utils')

aware.allowLogging(false)

describe('electron-aware', () => {
  const expectation = 'should be a function'

  it('should be an object', (done) => {
    aware.should.be.an('object')
    done()
  })

  describeIt('#allowLogging', expectation, () => {
    aware.allowLogging.should.be.a('function')
  })

  describeIt('#close', expectation, () => {
    aware.close.should.be.a('function')
  })

  describeIt('#on', expectation, () => {
    aware.on.should.be.a('function')
  })

  describeIt('#onError', expectation, () => {
    aware.onError.should.be.a('function')
  })

  describeIt('#refresh', expectation, () => {
    aware.refresh.should.be.a('function')
  })

  describeIt('#reload', expectation, () => {
    aware.reload.should.be.a('function')
  })

  describeIt('#start', expectation, () => {
    aware.start.should.be.a('function')
  })
})

describe('electron-aware library', () => {

  itAsPromise("should raise the 'electron-started' event, when #start is called", (done) => {
    aware.on('electron-started', done)
    aware.start('./test/electron-app.js')
  })

  itAsPromise("should raise the 'page-refreshed' event, when #refresh is called", (done) => {
    aware.on('page-refreshed', done)
    aware.refresh()
  })

  itAsPromise("should raise the 'electron-reloaded' event, when #reload is called", (done) => {
    aware.on('electron-reloaded', done)
    aware.reload()
  })

  itAsPromise("should raise the 'electron-closed' event, when #close is called", (done) => {
    aware.on('electron-closed', done)
    setTimeout(() => {
      aware.close()
    }, 2500)
  })
})
