const EventEmitter = require('events')
const PortStream = require('./message-channel-port-stream')

/*
说明：原本是background端 ServiceWorker的封装实现，改为Worker的封装实现
目的：手机平台不能使用ServiceWorker
 */
class SwGlobalListener extends EventEmitter {

  constructor (swGlobal) {
    super()
    
    var _this = this;
    // 处理 search_updatefound消息
    swGlobal.addEventListener("message", function (msg) {
        console.log(' %c =======sw-global-listener.js**msg========', 'color: red')
        console.log(msg)
        
        if (!msg.data) 
          return
        if (msg.data !== 'search_updatefound') 
          return

        console.log("=======background send updatefound 22========")
        swGlobal.postMessage("updatefound");
    });
    // 处理 handshake消息
    swGlobal.addEventListener("message", function (msg) {
        // console.log("===background send remote 11=====");
        // validate port
        if (!msg.data) 
          return
        if (msg.data.action !== 'handshake') 
          return
        console.log("===get handshake=====");
        // create new portStream
        const portStream = new PortStream(swGlobal)
        // announce new connection
        _this.emit('remote', portStream, msg)
    });
  }

}



module.exports = SwGlobalListener