const fs = require('fs');
const ini = require('ini');

var tfwords, tffreqs;

function loadPlugins() {
    var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
    wordPlugins = config.Plugins.words;
    frequencyPlugins = config.Plugins.frequencies;
    tfwords = require(wordPlugins);
    tffreqs = require(frequencyPlugins);
}

loadPlugins();
wordFreqs = tffreqs.top25(tfwords.extractWords(process.argv[2]));

wordFreqs.forEach((word) => {
    console.log(word[0] + "  -  " + word[1]);
});