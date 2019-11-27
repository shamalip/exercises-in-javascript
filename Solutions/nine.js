const fs = require('fs');
class TFTheOne {
    
    constructor(v) {
        this.value = v;
    }
    
    bind(func) {
        this.value = func(this.value);
        return this;
    }
    
    printMe() {
        if(this.value.trim() != "") {
            console.log(this.value.trim());            
        }

    }
}
function readFile(filePath) {
    return fs.readFileSync(filePath).toString();
}

function filterChars(str) {
    return str.replace(/[\W_]+/g," ");
}

function normalize(data) {
    return data.toLowerCase();
}

function scan(str) {
    return str.split(" ");
}

function removeStopWords(wordList) {
    var stopWords = new Set(fs.readFileSync("../stop_words.txt")
                      .toString()
                      .split(",")
                      .map(v => v.toLowerCase()));
                      
    return wordList.filter(c => !(stopWords.has(c)) && c.length >= 2);
}

function frequencies(wordList) {
    var wordFreqs = {};
    wordList.forEach(function(word){
		if (word in wordFreqs) {
			wordFreqs[word] += 1;
		} else {
			wordFreqs[word] = 1;
		}	
	});
	
    return wordFreqs;
}


function sort(wordFreqs) {
    var listOfWordFreqs = Object.keys(wordFreqs).map(function(key) {
        return [key, wordFreqs[key]];
    });

    listOfWordFreqs.sort(function(word1, word2) {
        return word2[1] - word1[1];
    });
    
    return listOfWordFreqs;
    
}

function top25Freqs(wordFreqs) {
    var top25 = "";
    wordFreqs.slice(0,25).forEach( t => {
        top25 += t[0] + "  -  " + t[1] + "\n";
    });
    
    return top25;
    
    
}
new TFTheOne(process.argv[2])
.bind(readFile)
.bind(filterChars)
.bind(normalize)
.bind(scan)
.bind(removeStopWords)
.bind(frequencies)
.bind(sort)
.bind(top25Freqs)
.printMe();

