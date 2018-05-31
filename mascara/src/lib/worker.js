
module.exports = function (self) {
    self.addEventListener('message',function (ev){
    	console.log("======webworkify  worker=========");
        var startNum = parseInt(ev.data); // ev.data=4 from main.js

    });
};


module.exports = {

	"TICHAIN" : 666
}