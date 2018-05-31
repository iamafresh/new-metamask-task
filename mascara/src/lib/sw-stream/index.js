const PortStream = require('./message-channel-port-stream')

module.exports = SericeWorkerStream


function SericeWorkerStream({ serviceWorker, context }) {
  // send handshake including port to respond on
  console.log("===========send handshake=================");
  serviceWorker.postMessage({ action: 'handshake', context })
  // construct stream around local message channel port
  const portStream = new PortStream(serviceWorker)
  return portStream
}