const fs = require('fs');
const collections = require('pycollections');
const _ = require('underscore');
const matchAll = require("match-all");

var stops = new Set(fs.readFileSync(process.argv[3]).toString().toLowerCase().split(','));
var words = matchAll(fs.readFileSync(process.argv[2]).toString().toLowerCase(), /([a-z0-9]{2,})/gi).toArray();
var mostCommon = new collections.Counter(words.filter(word => !(stops.has(word)))).mostCommon(25);
for(i in mostCommon)
    console.log(mostCommon[i][0] + "  -  " + mostCommon[i][1]);