/*globals allColumns counts*/
const fs = require('fs');

var allWords = [[], undefined];
var stopWords = [new Set([]), undefined];
var nonStopWords = [[], () => {
    nonStopWords[0] = allWords[0].map((w) => {
       if (w != "" && w.length >=2 && !stopWords[0].has(w)) 
            return w;
return "";
    });
}];

var uniqueWords = [[], () => {
    var set = new Set();
    nonStopWords[0].forEach((w) => {
        if (w != "") {
            set.add(w);
        }
            
    });
    uniqueWords[0] = Array.from(set);
}];


counts = [[], () => {
    uniqueWords[0].forEach((w) => {
        counts[0].push(nonStopWords[0].filter(n => n == w).length);
    });    
}];


var sortedData = [[], () => {
    var merged = uniqueWords[0].map((e, i) => {
        return [e, counts[0][i]];
    });
     merged.sort(function(word1, word2) {
        return word2[1] - word1[1];
    });  

    sortedData[0] = merged;
}];

allColumns = [allWords, stopWords, nonStopWords, uniqueWords, counts, sortedData];

function update() {
    allColumns.forEach((col) => {
        if (col[1] != undefined) {
            Reflect.apply(col[1], undefined,[]);
        }
    });
}



allWords[0] = fs.readFileSync(process.argv[2]).toString().toLowerCase().replace(/[\W_]+/g," ").split(" ");

stopWords[0] = new Set(fs.readFileSync("../stop_words.txt").toString().toLowerCase().split(","));
update();

var i = 0;
sortedData[0].forEach(a => {
    if (i < 25)
        console.log(a[0] + '  -  ' + a[1]);
    i++;
});

