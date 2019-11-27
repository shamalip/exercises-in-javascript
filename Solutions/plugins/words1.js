const fs = require('fs');

function extractWords(filePath) {
    var data = fs.readFileSync(filePath).toString();
    var wordList = data.replace(/[\W_]+/g," ").toLowerCase().split(" ");
    
    var stopWords = new Set(fs.readFileSync("../stop_words.txt")
                      .toString()
                      .toLowerCase()
                      .split(","));
    return wordList.filter((w) => {
        return !stopWords.has(w) && w.length >= 2 ;
    });
}

module.exports = {
    extractWords : extractWords
};