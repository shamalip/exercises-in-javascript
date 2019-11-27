const fs = require('fs');

function extractWords(filePath) {
    var data = fs.readFileSync(filePath).toString();
    var wordList = data.toLowerCase().match(/[a-z]{2,}/g);   
    var stopWords = new Set(fs.readFileSync("../stop_words.txt")
                      .toString()
                      .toLowerCase()
                      .split(","));
    return wordList.filter((w) => {
        return !stopWords.has(w);
    });
}

module.exports = {
    extractWords : extractWords
};