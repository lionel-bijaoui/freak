/**
 * @author Lionel
 *
 * Use MIDIBridge.js and jQuery.js
 *
 */
var freqk;
var milo;
$(document).ready(function() {

	init();
	midiInit();
	enableKeyboardControl();
	enableMouseControl();
	milo = new Milo();
	milo.sing(100);
	//milo.shutUp();
});

function init() {
	freqk = new Freqk();

	Freqk.volume = .1;

}

function enableMouseControl() {
	var _freq;
	function normalizePageY(pageY) {
		var Y = $(window).height();
		return pageY * 100 / Y;
	}


	$(document).mousedown(function(e) {
		//save current frequency to retrieve on mouseup
		_freq = freqk.getFreq();

		var pY = normalizePageY(e.pageY);
		var xpos = pY;
		$(document).mousemove(function(e) {
			var pY = normalizePageY(e.pageY);
			freqk.pitchControl(xpos - pY, 4);
			freqk.setFilter(e.pageX);
			xpos = pY;

		});
	});
	$(document).mouseup(function() {
		$(document).unbind('mousemove');
		//reset the pitch
		freqk.setFreq(_freq);
	});
}

function enableKeyboardControl() {
	var keyboardMap = {
		"Q" : "C",
		"Z" : "C#",
		"S" : "D",
		"E" : "D#",
		"D" : "E",
		"F" : "F",
		"T" : "F#",
		"G" : "G",
		"Y" : "G#",
		"H" : "A",
		"U" : "A#",
		"J" : "B",
		"K" : "C+",
	}

	$(document).keydown(function(event) {
		var key = keyboardMap[String.fromCharCode(event.which)]
		if (key)
			freqk.noteOn(key);
	});
	$(document).keyup(function() {
		var key = keyboardMap[String.fromCharCode(event.which)]
		if (key)
			freqk.noteOff(key);
	});
};

function midiInit() {

	//var devices = document.getElementById("devices"), messages = document.getElementById("messages");

	midiBridge.init(function(MIDIAccess) {
		var input = MIDIAccess.getInput(MIDIAccess.enumerateInputs()[0]);
		console.log("The MIDI controler \"" + input.deviceName + "\" is connected and ready to play.");

		if (input) {
			input.addEventListener("midimessage", function(e) {
				console.log(e.data1);
				// si noteOn
				if (e.toArray()[0] == 144) {
					freqk.noteOn(e.toArray()[2]);
				} else {
					freqk.noteOff(e.toArray()[2]);
				}

			});
		}

		/*
		 if (input) {
		 input.addEventListener("midimessage", function(e) {
		 if (output) {
		 output.sendMIDIMessage(e);
		 }
		 if (e.command === midiBridge.NOTE_OFF || e.command === midiBridge.NOTE_ON) {
		 console.log(e.toString() + " NOTENAME:" + midiBridge.getNoteName(e.data1) + "<br/>");
		 } else {
		 console.log(e.toString() + "<br/>");
		 }
		 //midiMessages.scrollTop = midiMessages.scrollHeight;
		 });
		 }*/

	});

};
