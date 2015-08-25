var nlp = require('nlp_compromise');

function Line(line){
	this.words = line.split(' ');
	this.originalWords = line.split(' ');
	this.wordCount = function(){
		return this.words.length;
	}
	this.syllableCount = function(){
		var count = 0;
		this.words.forEach(function(word){
			count += nlp.syllables(word).length;
		});
		return count;
	};
	this.nouns = function(){
		return nlp.pos(this.makeLine()).nouns();
	};
	this.verbs = function(){
		return nlp.pos(this.makeLine()).verbs();
	};
	this.adjectives = function(){
		return nlp.pos(this.makeLine()).adjectives();
	};
	this.adverbs = function(){
		return nlp.pos(this.makeLine()).adverbs();
	};
	this.tags = function(){
		return nlp.pos(this.makeLine()).tags()[0];
	}
	this.taggedWords = function(tagArray){
		var arr = [];
		for (var i = 0; i < this.tags().length; i++) {
			if(tagArray.indexOf(this.tags()[i]) !== -1) {
				arr.push(this.words[i]);
			}
		};
		return arr;
	};
	this.makeLine = function(){ 
		return this.words.join(' ');
	};
	this.removeWord = function(word){
		var wordIndex = this.words.indexOf(word);
		this.words.splice(wordIndex,1);
	};
	this.replaceWord = function(oldWord, newWord){
		var wordIndex = this.words.indexOf(oldWord);
		this.words.splice(wordIndex,1, newWord);
		this.updateWords();
	};
	this.updateWords = function(){
		this.words = this.makeLine().split(' ');
	}
}

module.exports = Line;