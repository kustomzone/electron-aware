
require('mocha')

const wrapAsPromise = function(callback) {
  return new Promise(function(resolve, reject) {
    try {
      callback(() => resolve(true))
    } catch (e) {
      callback(() => resolve(false))
    }
  })
}

const describeIt = function (description, expectation, callback) {
  describe(description, function () {
    it(expectation, function (done) {
      callback()
      done()
    })
  })
}

const itAsPromise = function(expectation, callback) {
  it(expectation, function (done) {
    this.timeout(0)
    let promise = wrapAsPromise(callback)
    promise.should.eventually.equal(true).notify(done)
  })
}

module.exports = { describeIt, itAsPromise }
