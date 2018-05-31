const Duplex = require('readable-stream').Duplex
const inherits = require('util').inherits

module.exports = MessageChannelPortDuplexStream


inherits(MessageChannelPortDuplexStream, Duplex)

/*
说明：原本是 ServiceWorker的封装实现，改为Worker的封装实现
目的：手机平台不能使用ServiceWorker
 */

function MessageChannelPortDuplexStream (worker) {
  Duplex.call(this, {
    objectMode: true,
  })
  this._worker = worker
  worker.onmessage = this._onMessage.bind(this)
}

// private

MessageChannelPortDuplexStream.prototype._onMessage = function (event) {
  const msg = event.data
  if (Buffer.isBuffer(msg)) {
    delete msg._isBuffer
    var data = new Buffer(msg)
    this.push(data)
  } else {
    this.push(msg)
  }
}

// stream plumbing

MessageChannelPortDuplexStream.prototype._read = noop

MessageChannelPortDuplexStream.prototype._write = function (msg, encoding, cb) {
  try {
    if (Buffer.isBuffer(msg)) {
      var data = msg.toJSON()
      data._isBuffer = true
      this._worker.postMessage(data)
    } else {
      this._worker.postMessage(msg)
    }
  } catch (err) {
    return cb(new Error('MessageChannelPortDuplexStream - disconnected'))
  }
  cb()
}

// util

function noop () {}
