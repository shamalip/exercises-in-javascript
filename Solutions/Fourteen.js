const fs = require('fs');
const _ = require('underscore');

class WordFrequencyFramework {
    
    constructor() {
        this.loadEventHandlers = [];
        this.doWorkEventHandlers = [];
        this.endEventHandlers = [];
    }

    registerForLoadEvent(handler) {
        this.loadEventHandlers.push(handler);
    }
    
    registerForDoWorkEvent(handler) {
        this.doWorkEventHandlers.push(handler);
    }
    
     registerForEndEvent(handler) {
        this.endEventHandlers.push(handler);
    }
    
     run(pathToFile) {
        this.loadEventHandlers.forEach((h) => {
            h(pathToFile);
        });
        
        this.doWorkEventHandlers.forEach((h) => {
            h();
        });
        
        this.endEventHandlers.forEach((h) => {
            h();
        });       
    }
}

class DataStorage {
    
    constructor(wfapp, stopWordFilter) {
        this.data = "";
        this.wordEventHandlers = [];
        _.bindAll(this, 'load', 'produceWords', 'registerForEvent');
        this.stopWordFilter = stopWordFilter;
        wfapp.registerForLoadEvent(this.load);
        wfapp.registerForDoWorkEvent(this.produceWords);
    }
    
     load(pathToFile) {
        this.data = fs.readFileSync(pathToFile).toString();   
        this.data = this.data.replace(/[\W_]+/g," ").toLowerCase();
    }
    
     produceWords() {
        this.data.split(" ").forEach( (w) => {
            if (w.length >= 2 && !this.stopWordFilter.isStopWord(w)) {
                this.wordEventHandlers.forEach((h) => h(w));
            }
        });
    }
    
     registerForEvent(handler) {
        this.wordEventHandlers.push(handler);
    }
        
}

class StopWordFilter {
    
    constructor(wfapp) {
        this.stopWords = new Set([]);
        _.bindAll(this, 'load', 'isStopWord');
        wfapp.registerForLoadEvent(this.load);
    }
    
     load(ignore) {
        var self = this;
        fs.readFileSync("../stop_words.txt").toString().toLowerCase().split(",").forEach((w) => {
            self.stopWords.add(w);
        });
    }
    
     isStopWord(word) {
       return this.stopWords.has(word);
    }
}


class WordFrequencyCounter {
        
    constructor(wfapp, dataStorage) {
        _.bindAll(this, 'incrementCount', 'printFreqs');
        this.wordFreqs = {};
        dataStorage.registerForEvent(this.incrementCount);
        wfapp.registerForEndEvent(this.printFreqs);
    }
    
     incrementCount(word) {
        if (word in this.wordFreqs) {
            this.wordFreqs[word] += 1;
        } else {
            this.wordFreqs[word] = 1;
        }
    }
    
     printFreqs() {
        var self = this;
        var listOfWordFreqs = Object.keys(this.wordFreqs).map(function(key) {
            return [key, self.wordFreqs[key]];
        });

        listOfWordFreqs.sort(function(word1, word2) {
            return word2[1] - word1[1];
        });
        
        listOfWordFreqs.slice(0,25).forEach((w) => {
           console.log(w[0] + "  -  " + w[1]);
        });
    
    }
}


class WordsStartingWithCounter {
        
    constructor(wfapp, dataStorage, searchChar) {
        _.bindAll(this, 'incrementCount', 'printCount');
        this.zCounter = 0;
        this.searchChar = searchChar;
        dataStorage.registerForEvent(this.incrementCount);
        wfapp.registerForEndEvent(this.printCount);
    }
    
     incrementCount(word) {
         if(word[0] == this.searchChar) {
             this.zCounter += 1;
         }
    }
    
     printCount() {
        console.log("Number of unique words starting with '" + this.searchChar + "' are: " + this.zCounter);
    }
}

wfapp = new WordFrequencyFramework();
stopWordFilter = new StopWordFilter(wfapp);
dataStorage = new DataStorage(wfapp, stopWordFilter);
wordFrequencyCounter = new WordFrequencyCounter(wfapp, dataStorage);
wordsWithZCounter = new WordsStartingWithCounter(wfapp, dataStorage, 'z');
wfapp.run(process.argv[2]);
