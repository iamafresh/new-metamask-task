module.exports = function () {

self.addEventListener('message', function (event) {
  self.postMessage(event.data)
}, false)

var a = 5
module.exports = a
}