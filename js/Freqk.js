/**
 * Freqk Javascript Web Audio Synth
 *
 * @author Lionel Bijaoui
 *
 * TODOS
 * enveloppe
 * effect
 * modularité of effect = dynamic nodes link
 * ???
 *
 */

var octave = 4;

function Freqk() {
	//tableau des notes : garde en mémoire les touches enfoncés
	'use strict';
	this.activeNote = [];
	// création de l'audio context
	this.audioContext = new webkitAudioContext();
	// ajout d'un oscillateur et d'un controleur de volume
	this.oscillator = this.audioContext.createOscillator();
	this.gainNode = this.audioContext.createGain();
	this.filter = this.audioContext.createBiquadFilter();
	this.masterVolume = this.audioContext.createGain();
	this.masterVolume.gain.value = Freqk.volume;
	this.masterVolume.connect(this.audioContext.destination);
	// démarre l'osc
	this.oscillator.start(0);
	//this.delay.delayTime.value = 2;
	// connection
	//this.oscillator.connect(this.delay);
	this.oscillator.connect(this.gainNode);
	//this.oscillator.connect(this.filter);
	this.filter.type = 0;
	//this.filter.frequency.value = 200;

	//this.filter.connect(this.gainNode);
	this.gainNode.connect(this.masterVolume);
	//this.gainNode.connect(this.audioContext.destination);
	this.gainNode.gain.value = 0;
	console.log("I'm a Freqk !");
}

// STATIC PROPERTIES

Freqk.note = {
	"A" : 0,
	"A#" : 1,
	"B" : 2,
	"C+" : 3,
	"C" : -9,
	"C#" : -8,
	"D" : -7,
	"D#" : -6,
	"E" : -5,
	"F" : -4,
	"F#" : -3,
	"G" : -2,
	"G#" : -1
};
Freqk.a = Math.pow(2, 1 / 12);
Freqk.volume = 0.1;

// STATIC METHOD

Freqk.frequencyOfNoteName = function(noteName) {
	return 440 * Math.pow(Freqk.a, Freqk.note[noteName] + (octave - 4) * 11);
}
Freqk.frequencyOfMidiNote = function(midiNote) {
	return 440 * Math.pow(2, (midiNote - 69) / 12);
};
Freqk.setMasterVolume = function(volume) {
	Freqk.volume = volume;
};
// PROTOTYPE METHOD

Freqk.prototype = {

	debug : function(x) {
		console.log(x);
	},
	getFreq : function() {
		return this.oscillator.frequency.value
	},
	setFreq : function(freq) {
		this.oscillator.frequency.value = freq;
	},
	setFilter : function(frequency) {
		this.filter.frequency.value = frequency;
		this.filter.Q.value = frequency;
	},
	pitchControl : function(delta, multiplier) {
		this.oscillator.frequency.value += delta * multiplier || delta;
	},
	setOsc : function(oscType) {
		this.oscillator.type = oscType;
	},
	setVolume : function(vol) {
		this.gainNode.gain.value = vol;
	},
	connectNode : function(nodename) {
		//this.delay =

	},

	noteOn : function(MIDI) {
		var exist = false;
		//verifie si la note existe déjà
		for (var i = 0, j = this.activeNote.length; i < j; i++) {
			if (this.activeNote[i] == MIDI) {
				exist = true;
			}
		};
		// si la note n'existe pas, rajoute la dans le tableau des notes
		if (!exist) {
			this.activeNote.push(MIDI);
			if ($.isNumeric(MIDI)) {
				this.setFreq(Freqk.frequencyOfMidiNote(MIDI));
			} else {
				this.setFreq(Freqk.frequencyOfNoteName(MIDI));
			}
			this.setVolume(1);
		}
		console.log(this.activeNote);
	},
	noteOff : function(MIDI) {
		//retire la note du tableau des notes
		for (var i = 0, j = this.activeNote.length; i < j; i++) {
			if (this.activeNote[i] == MIDI) {
				//console.log("removed " + this.activeNote[i]);
				this.activeNote.splice(i, 1);

			};
		};

		//this.activeNote.splice(this.activeNote.indexOf(MIDI), 1);
		if (this.activeNote.length == 0) {
			this.setVolume(0);
		} else {
			var lastNote = this.activeNote[this.activeNote.length - 1];
			if ($.isNumeric(lastNote)) {
				this.setFreq(Freqk.frequencyOfMidiNote(lastNote));
			} else {
				this.setFreq(Freqk.frequencyOfNoteName(lastNote));
			}

		}

	}
};
