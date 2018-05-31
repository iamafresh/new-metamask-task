var mywebworkify = require('./webworkify');

const EventEmitter = require('events')
/*
说明：原本是ui端 ServiceWorker的封装实现，改为Worker的封装实现
目的：手机平台不能使用ServiceWorker
 */
module.exports = class ClientSideServiceWorker extends EventEmitter {
  constructor (opts) {
    super()
    // opts
    this.fileName = opts.fileName
    this.scope = opts.scope
    this.keepAlive = opts.keepAlive === undefined ? true : opts.keepAlive

    // service worker refs
    this.workerApi = null

    // ready status
    this.ready = false
    this.once('ready', () => this.ready = true)

    // keep alive
    this.keepAliveActive = false
    this.keepAliveInterval = opts.keepAliveInterval || 60000
    this.keepAliveIntervalRef = null
    this.keepAliveDelay = opts.keepAliveDelay || 0
    if (this.keepAlive) {
      this.once('ready', () => this.startKeepAlive())
    }

    // start
    if (opts.autoStart) this.startWorker()
  }

  getWorker () {
    return this.workerApi
  }

  async startWorker () {
    const registeredWorker = await this.registerWorker()
    this.workerApi = registeredWorker
    // forward messages and errors
    this.workerApi.addEventListener('message', (messageEvent) => this.emit('message', messageEvent))
    this.workerApi.addEventListener('error', (err) => this.emit('error', err))
    this.workerApi.onerror = (err) => this.emit('error', err)
    this.emit('ready', this.workerApi)
  }

  async registerWorker () {
    //"worker?name=/[hash].js!./workers/AddressIndexWorker"
    //// mywebworkify(require(this.fileName));
    const worker = new Worker(this.fileName);
    console.log('=======ui send search_updatefound')
    worker.postMessage('search_updatefound')
    await this.waitUpdatefoundMsg(worker)
    return worker
  }

  waitUpdatefoundMsg (worker) {
    return new Promise((resolve, reject) => {
      worker.onmessage = (event) => {
        if (event.data.err) {
          reject(event.data.error)
        } else {
          // background to postMessage("updatefound")
          console.log('========waitUpdatefoundMsg=======')
          console.log(event.data)
          if (event.data == 'updatefound') {
            worker.onmessage = null
            // this.emit('updatefound');
            resolve(event.data)
          } else {
            // TODO
            reject('event.data.error')
          }
        }
      }
    })
  }

  sendMessage (message) {
    return new Promise((resolve, reject) => {
      this.workerApi.onmessage = (event) => {
        if (event.data.err) {
          reject(event.data.error)
        } else {
          resolve(event.data.data)
        }
      }
      this.workerApi.postMessage(message)
    })
  }

  startKeepAlive () {
    // if (this.keepAliveActive) return
    // this.keepAliveActive = true
    // setTimeout(() => {
    //   this.keepAliveIntervalRef = setInterval(() => {
    //     this.emit('sendingWakeUp')
    //     this.sendMessage('wakeup')
    //   }, this.keepAliveInterval)
    // }, this.keepAliveDelay)
  }

  stopKeepAlive () {
    // if (!this.keepAliveActive) return
    // clearInterval(this.keepAliveIntervalRef)
    // this.keepAliveIntervalRef = null
    // this.keepAliveActive = false
  }
}
