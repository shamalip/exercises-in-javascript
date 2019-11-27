const fs = require('fs');

var characters = function *(fileName) {
    var array = fs.readFileSync(fileName).toString().split("\n");
    for (var item of array) {
        for (var i = 0; i < item.length; i++) {
            yield item.charAt(i);            
        }
    }
}

var allWords = function*(fileName) {
    var startChar = true;
    for(c of characters(fileName)) {
        if (startChar == true) {
            word = "";
            if (/^[a-z0-9]+$/i.test(c)) {
                word = c.toLowerCase();
                startChar = false;
            } else {
                continue;
            }
        } else {
            if (/^[a-z0-9]+$/i.test(c)) {
                word += c.toLowerCase();
            } else {
                startChar = true;
                yield word;
            }
        }
    }
}


var nonStopWords = function* (fileName) {
    var stopWords = new Set(fs.readFileSync("../stop_words.txt").toString().toLowerCase().split(","));
    for (w of allWords(fileName)) {
        if (!stopWords.has(w) && w.length >= 2) {
            yield w;
        }
    }
}

var countAndSort = function* (fileName) {
    var freqs = {};
    var i = 1;
    for (w of nonStopWords(fileName)) {
        if (w in freqs) {
            freqs[w] = freqs[w] + 1;
        } else {
            freqs[w] = 1;
        }
        if (i % 5000 == 0) {
            var listOfWordFreqs = Object.keys(freqs).map(function(key) {
                return [key, freqs[key]];
            });
    
            listOfWordFreqs.sort(function(word1, word2) {
                return word2[1] - word1[1];
            });
            yield listOfWordFreqs;            
        }
        i++;
    }
    
    var listOfWordFreqs = Object.keys(freqs).map(function(key) {
        return [key, freqs[key]];
    });

    listOfWordFreqs.sort(function(word1, word2) {
        return word2[1] - word1[1];
    });
    yield listOfWordFreqs; 
}

for (wordFreqs of countAndSort(process.argv[2])) {
    console.log("----------------------------------");
    var i = 0;
    for (w of wordFreqs) {
        if (i < 25) {
            console.log(w[0] + "  -  " + w[1]);
        }
        i++;
    }
}