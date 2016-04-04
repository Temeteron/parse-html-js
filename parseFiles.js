// Parse Files , see if law of Heap is right, count size of the vocabulary
// Count size of all terms, Get increase Frequency of the size of vocabulary

var fs = require('fs');
var path = require('path');

//Regex for the files, tokenizing , get words
function countTextWords (text) {
	var result = /<body[^>]*>(.+?)<\/body>/img.exec(text.replace(/\s/g, ' '))[1]
		.replace(/(<([^>]+)>)/ig, " ")
		.replace(/[\t\n]+/g, "")
		.replace(/ +/g, " ")
		.replace(/[•:\^"·.\-|,[\]()]/g,"")
		.split(/\s/)
		.filter(function (x) {
			return x.length; // remove empty spaces
		})
		.reduce(function (res, crnt) {
			// crnt = crnt.toLowerCase();
			res[crnt] = (res[crnt] | 0) + 1;
			return res;
		}, {});
	return result;
}


// Get all directories/files
function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}


var directory = "en1";//folder/directory given
var directoryStats = {};
var numTerms = 0;//total words found

//Call the regex countTextWords for all files
walkSync(directory, function(filePath, stat) {
    directoryStats[filePath] = countTextWords(fs.readFileSync(filePath, 'utf8'));
});

//Combine each array from all files to one overall array
var overallResults = Object.keys(directoryStats).reduce(function (res, crntPath) {
	var crntFileStats = directoryStats[crntPath];
	
	var i = 0;
	var test = 1;

	Object.keys(crntFileStats).reduce(function (res, crntWord) {
		i++;
		res[crntWord] = (res[crntWord] | 0) + crntFileStats[crntWord];
		numTerms += 1;
		if((i / 100 != 0) && (i % 100 == 0) ) {
			sizeOfVoc = Object.keys(res).length;
			freqIncr = ((sizeOfVoc - test)/test)*100;
			console.log("Size of vocabulary: " + sizeOfVoc + " || Number of tokens: " + numTerms + " || Increase Freq of Voc: " + freqIncr + "%");
			console.log("Log10 of vocabulary: " + Math.log10(sizeOfVoc) + " || Log10 of the number of tokens: " + Math.log10(numTerms));
			test = sizeOfVoc;
		}
		return res;
	}, res);
	

	return res;
}, {});


//FINAL PRINTS
console.log("Total number of terms is: " + numTerms);
indTerms = Object.keys(overallResults).length;//total terms
console.log("Individualy: " + indTerms);

table = Object.keys(overallResults).map(function(key) {
	return {
		key: key,
		count: overallResults[key],
		freq: overallResults[key]/indTerms,
	};
}).sort(function (row1, row2) {
	return row2.count - row1.count;
});

var overallconstant=0;
for (var i=0; i<table.length; i++) {
	table[i].const = table[i].freq * (i+1);
	overallconstant += table[i].const;
}


//FINAL PRINTS
//M=k*T^b , b=0,49
b = 0.49;
k = indTerms/(Math.pow(numTerms, b));
console.log("Size of Voc: " + indTerms + " Number of tokens: " + numTerms + " Parameter b: " + b + " Parameter k: " + k);
overallconstant = overallconstant / indTerms;
console.log("Overall constant is: " + overallconstant);
console.log(table);