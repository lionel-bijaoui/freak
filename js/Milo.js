/**
 * @author Lionel
 */

function Milo() {
	'use strict';
	self = this;
	this.time = null;
	this.curNote = null;
	this.lastNote = null;
	console.log("Hello, I'm Milo, and I like to sing. I like fluffy clouds too.");
	this.sing = function(interval) {
		this.time = window.setInterval(function() {self.bleep();}, interval);
		console.log("LA, LA, LA !");
	};
	this.bleep = function() {
		freqk.setOsc(Math.floor(Math.random() * 4));
		self.curNote = Math.round(Math.random() * 70 + 20);
		if (self.lastNote != null) {
			freqk.noteOff(self.lastNote);
		};
		freqk.noteOn(self.curNote);
		self.lastNote = self.curNote;
	};

	this.shutUp = function() {
		clearInterval(this.time);
		Milo.bleepOut();
		console.log("cough !");
	};
}

Milo.bleep = function() {
	freqk.setOsc(Math.floor(Math.random() * 4));
	curNote = Math.round(Math.random() * 70 + 20);
	if (lastNote != null) {
		freqk.noteOff(lastNote);
	};
	freqk.noteOn(curNote);
	lastNote = curNote;
};
Milo.bleepOut = function() {
	freqk.noteOff(curNote);
};
Milo.melodyMaker = function (bars) {
  
};
Milo.prototype = {

}