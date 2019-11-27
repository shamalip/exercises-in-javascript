const fs = require('fs');

function extractWords(obj, filePath) {
    var str = fs.readFileSync(filePath).toString();
    str = str.replace(/[\W_]+/g," ");
    str = str.toLowerCase();
    obj['data'] = str.split(" ");
}

function loadStopWords(obj) {
    obj['stopWords'] = new Set(fs.readFileSync("../stop_words.txt").toString().toLowerCase().split(","));
}

function incrementCount(obj, w) {
    if (w in obj['freqs'])
        obj['freqs'][w] = obj['freqs'][w] + 1;
    else
        obj['freqs'][w] = 1;
}

var dataStorageObj = {
  'data' : [],
  'init' : (me, pathToFile) => extractWords(me, pathToFile),
  'words' : (me) => {
                    return me['data'];
                }
};


var stopWordsObj = {
    'stopWords' : new Set([]),
    'init' : (me) => loadStopWords(me),
    'isStopWord': (me, word) =>  {
        return me['stopWords'].has(word);
    }
};


var wordFreqsObj = {
    'freqs' : {},
    'incrementCount' : (me, w) => incrementCount(me, w),
    'sorted' : (me) =>  {
        var listOfWordFreqs = Object.keys(me['freqs']).map(function(key) {
            return [key, me['freqs'][key]];
        });

        listOfWordFreqs.sort(function(word1, word2) {
            return word2[1] - word1[1];
        });
        
        return listOfWordFreqs;
    }
};


dataStorageObj['init'](dataStorageObj, process.argv[2]);
stopWordsObj['init'](stopWordsObj);
var word;
for(word in dataStorageObj['words'](dataStorageObj)) {
    var w = dataStorageObj['words'](dataStorageObj)[word];

    if (w.length >= 2 && !stopWordsObj['isStopWord'](stopWordsObj, w))
        wordFreqsObj['incrementCount'](wordFreqsObj, w);
}

wordFreqsObj['top25'] = (me) => {
        var wordFreqs = me['sorted'](me);
        wordFreqs.slice(0,25).forEach(function(wordFreq) {
            console.log(wordFreq[0] + "  -  " + wordFreq[1]);
        }); 
    };
    
    
wordFreqsObj['top25'](wordFreqsObj);
