function top25(wordList) {
    var wordFreqs = {};
    wordList.forEach(function(word){
		if (word in wordFreqs) {
			wordFreqs[word] += 1;
		} else {
			wordFreqs[word] = 1;
		}	
	});
	var listOfWordFreqs = Object.keys(wordFreqs).map(function(key) {
        return [key, wordFreqs[key]];
    });

    listOfWordFreqs.sort(function(word1, word2) {
        return word2[1] - word1[1];
    });
    
    return listOfWordFreqs.slice(0, 25);
}

module.exports = {
    top25 : top25
};