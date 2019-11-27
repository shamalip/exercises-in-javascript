const fs = require('fs');

function readFile(filePath, func) {
     var data = fs.readFileSync(filePath).toString();
     func(data, normalize);
}

function filterChars(str, func) {
    func(str.replace(/[\W_]+/g," "), scan);
}

function normalize(data, func) {
    func(data.toLowerCase(), removeStopWords);
}

function scan(str, func) {
    func(str.split(" "), frequencies);
}

function removeStopWords(wordList, func) {
    var stopWords = new Set(fs.readFileSync("../stop_words.txt")
                      .toString()
                      .split(",")
                      .map(v => v.toLowerCase()));
                      
    func(wordList.filter(c => !(stopWords.has(c)) && c.length >= 2), sort);
}

function frequencies(wordList, func) {
    var wordFreqs = {};
    wordList.forEach(function(word){
		if (word in wordFreqs) {
			wordFreqs[word] += 1;
		} else {
			wordFreqs[word] = 1;
		}	
	});
	
	func(wordFreqs, printText);
}


function sort(wordFreqs, func) {
    var listOfWordFreqs = Object.keys(wordFreqs).map(function(key) {
        return [key, wordFreqs[key]];
    });

    listOfWordFreqs.sort(function(word1, word2) {
        return word2[1] - word1[1];
    });
    
    func(listOfWordFreqs, noOp);
    
}

function printText(listOfWordFreqs, func) {
    
     listOfWordFreqs.slice(0,25).forEach(function(wordFreq) {
          console.log(wordFreq[0] + "  -  " + wordFreq[1]);
    }); 
    func(undefined);
}

function noOp() {
    return;
}

readFile(process.argv[2], filterChars);
