/*eslint-disable no-unused-params */
const fs = require('fs');

/* Takes a path to a file and returns the entire
contents of the file as a string */
function readFile(pathToFile) {
   var data = fs.readFileSync(pathToFile);
   return data.toString();
}
 
/* Takes a string and returns a copy with all nonalphanumeric
chars replaced by white space */
function filterCharsAndNormalize(str) {
    return str.replace(/[\W_]+/g," ");
}

/* Takes a string and scans for words, returning a list of words */
function scan(str) {
    return str.split(" ");
}

/* Takes a list of words and returns function that accepts stopwords string, and returns
 a copy with all stop words removed */
function removeStopWords(wordArr) {
    return function(stopWordsString) {
        var stopWords = new Set(stopWordsString.split(","));
        var filteredList = [];
        for (var word in wordArr) {
            wordArr[word] = wordArr[word].toLowerCase();
            if (!(stopWords.has(wordArr[word])) && wordArr[word].length >= 2) {
                filteredList.push(wordArr[word]);
            }
        }
        return filteredList;
    }
   
}

/* Takes a list of words and returns a dictionary associating words with frequencies of occurrence */
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

/* Takes a dictionary of words and their frequencies and returns a list of pairs where the 
entries are sorted by frequency */
function sort(wordFreqs) {
    var listOfWordFreqs = Object.keys(wordFreqs).map(function(key) {
        return [key, wordFreqs[key]];
    });

    listOfWordFreqs.sort(function(word1, word2) {
        return word2[1] - word1[1];
    });

    
    return listOfWordFreqs;
}

function printAll(listOfWordFreqs) {
    listOfWordFreqs.forEach(function(wordFreq) {
          console.log(wordFreq[0] + "  -  " + wordFreq[1]);
    });  
}

printAll(sort(frequencies(removeStopWords(scan(filterCharsAndNormalize(readFile(process.argv[2]))))(readFile(process.argv[3])))).slice(0,25));
