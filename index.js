var nlp = require('nlp_compromise');
var moby = require('moby');
var Line = require('./src/line.js');
var u = require('./src/util.js');


var testPara2 = "Taylor Alison Swift (born December 13, 1989) is an American singer-songwriter and actress. Raised in Wyomissing, Pennsylvania, she moved to Nashville, Tennessee, at the age of 14 to pursue a career in country music. She signed with the independent label Big Machine Records and became the youngest songwriter ever hired by the Sony/ATV Music publishing house.";
var testPara ="Americans, like human beings everywhere, believe many things that are obviously untrue. Their most destructive untruth is that it is very easy for any American to make money. They will not acknowledge how in fact hard money is to come by, and, therefore, those who have no money blame and blame and blame themselves.";
var sentences = nlp.sentences(testPara);
var lines = sentences.map(function(sentence){
	return new Line(sentence);
});


for (var i = 0; i < lines.length; i++) {
	var line = lines[i];
	removeGlue(line);
	if(i !== 1){
		reduceSyllables(5,line, u.tags.allTags);
	} else {
		reduceSyllables(7,line, u.tags.allTags);
	}
}
for (var i = 0; i < lines.length; i++) {
	var line = lines[i];
	console.log(line.makeLine())
}

//reduceSyllables(5,tArr[0], u.tags.allTags);
//reduceSyllables(7,tArr[1], u.tags.allTags);
//reduceSyllables(5,tArr[2], u.tags.allTags);

function removeGlue(line){
	line.taggedWords(u.tags.glue.concat(u.tags.value)).map(function(word){
		line.removeWord(word);
	});
}

function reduceSyllables(desiredSyllables, line, tags){
	console.log(line.makeLine());
	var tagArray = line.taggedWords(tags);
	//// console.log(tagArray)
	if(line.syllableCount() > desiredSyllables) {

		var toReplace = getRandomElement(tagArray);
		
		var synonyms = filterSyllables(getSynonyms(toReplace), 1, nlp.syllables(toReplace).length - 1)
		if(synonyms.length === 0){
			 console.log("to many syllables, no match, removing word ---", toReplace)
			line.removeWord(toReplace);
			reduceSyllables(desiredSyllables, line, tags);
		} else {
			var synonym = getRandomElement(synonyms)
			line.replaceWord(toReplace, synonym);
			 console.log('to many syllables, matching, replacing ---', toReplace, '---', synonym);
			reduceSyllables(desiredSyllables, line, tags);
		}
	} else if(line.syllableCount() < desiredSyllables) {
		var toReplace = getRandomElement(tagArray);
		var synonyms = filterSyllables(getSynonyms(toReplace), nlp.syllables(toReplace).length + 1,(desiredSyllables-line.syllableCount()))
		if(synonyms.length === 0){
			var randomOriginal = getRandomElement(line.originalWords);
			 console.log("not enough syllables, no match, replacing with original word ---", toReplace, '---', randomOriginal)
			line.replaceWord(toReplace, randomOriginal)
			reduceSyllables(desiredSyllables, line, tags);
		} else {
			var synonym = getRandomElement(synonyms)
			line.replaceWord(toReplace, synonym);
			 console.log('not enough syllables, match, replacing ---', toReplace, '---', synonym);
			reduceSyllables(desiredSyllables, line, tags);
		}
	} else {
		//console.log('no further syllable reduction');
		console.log(line.makeLine());
	}
}

function reduceLine(maxWords, line, tags){
	var tagArray = line.taggedWords(tags);
	// console.log(line.makeLine(),line.tags(),tagArray, tagArray.length);
	if(line.wordCount() > maxWords && tagArray.length !== 0) {
		line.removeWord(getRandomElement(tagArray));
		reduceLine(maxWords, line, tags)
	} else {
		// console.log("no further reduction")
	}
}

function getRandomElement(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}

function getSynonyms(word){
	return moby.search(word);
}

function filterSyllables(words, min, max){
	var matchingWords = [];
	words.forEach(function(word){
		if(nlp.syllables(word).length >= min && nlp.syllables(word).length <= max){
			matchingWords.push(word);
		}
	});
	return matchingWords;
}

function randSyn(word, max, min){
	var synonyms = moby.search(word);
	var trimmedSynonyms = [];
	if(typeof max !== "undefined"){
		if (typeof min !== "undefined"){
			synonyms.forEach(function(synonym){
				if (nlp.syllables(synonym).length >= min && nlp.syllables(synonym).length <= max) {
					trimmedSynonyms.push(synonym)
				}
			})
		} else {
			synonyms.forEach(function(synonym){
				if (nlp.syllables(synonym).length <= max) {
					trimmedSynonyms.push(synonym)
				}
			})
		}
	} else {
		trimmedSynonyms = synonyms
	}
	return getRandomElement(trimmedSynonyms);
}


//sentences.forEach(function(test){
	// var ln = new Line(test);
	// // //// console.log(ln.words);
	// // // console.log(ln.makeLine());
	// // //// console.log(ln.adjectives());
	// // //ln.removeWord('new');
	// // //// console.log(ln.makeLine());
	// // //// console.log(ln.adjectives());
	// // ln.removeWord(getRandomAdjective(ln).text);
	// // // console.log(ln.makeLine());
	// // // console.log(ln.tags());
	// // // console.log(getWordsAndTags(ln));
	// //// console.log(getRandomElement(ln.taggedWords(["RB","IN","JJ"])));
	// // console.log(ln.makeLine())
	// reduceLine(4, ln, u.tags.adverbs);
	// // console.log(ln.wordCount(), ln.syllableCount());
	//reduceSyllables(7, ln, u.tags.allTags);

	// // if (ln.taggedWords(u.tags.verbs).length !== 0){
	// // 	var randVerb = getRandomElement(ln.taggedWords(u.tags.verbs));
	// // 	ln.replaceWord(randVerb, randSyn(randVerb));
	// // }

	// //// console.log(ln.syllableCount());
	// // console.log(ln.makeLine(), ln.tags())
	// // console.log(ln.wordCount(), ln.syllableCount());
	//tArr.push(ln)
//})

/*var tests = ['Mad Max is a movie set in an apocalyptic desert', 'It follows a main character who is deranged', 'In the end Max finds water'];
var tests2 = ['After a market correction like this one, the S.&P. doesn’t typically continue to decline.', 'A drop of 5 percent or more in a week has happened 18 times since 2000.','During the 30 days following, the S.&P. gained ground in 13 out of those 18 cases.'];
var tArr = []
var t3 = ['Max, being Max, tries to escape, only to be grabbed once more and strapped to the front of a vehicle, like a fender of flesh, with his sturdy features barred by a metal grille.', 'Tom Hardy fans, who struggled so intently to understand him when he played Bane, in “The Dark Knight Rises,” may be less than thrilled to learn that their hero’s speech is yet again impeded.', 'Just as you’re wondering if the poor guy will ever express himself freely, however, Imperator Furiosa (Charlize Theron), a new acquaintance of Max’s, asks, “You want that thing off your face?”'];
var t4 = ['Furiosa is a driver, employed by Joe’s henchmen to transport precious fuel, who suddenly goes rogue, steering the War Rig, her vast and snarling truck, off course.', 'A posse is dispatched to hunt her down.', 'We soon discover her concealed cargo—the Wives, five young women who were imprisoned by Immortan Joe and doomed to bear his children.'];

var t5 = ['Years after the collapse of civilization, the tyrannical Immortan Joe enslaves apocalypse survivors inside the desert fortress the Citadel.',
'When the warrior Imperator Furiosa (Charlize Theron) leads the despot\'s five wives in a daring escape, she forges an alliance with Max Rockatansky (Tom Hardy), a loner and former captive.',
'Fortified in the massive, armored truck the War Rig, they try to outrun the ruthless warlord and his henchmen in a deadly high-speed chase through the Wasteland.'];
*/