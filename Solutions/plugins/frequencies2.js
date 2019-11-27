const collections = require('pycollections');

function top25(wordList) {
    return new collections.Counter(wordList).mostCommon(25);
}

module.exports = {
    top25 : top25
};