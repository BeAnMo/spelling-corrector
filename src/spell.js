const fs = require('fs');

const spellCorrector = function () {
    this.nWords = Object.create(null);
    this.alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
};

spellCorrector.prototype.loadDictionary = function (dictPath) {
    dictPath = dictPath || __dirname + '/big.txt';

    let file = fs.readFileSync(dictPath).toString().toLowerCase();
    let regex = /[a-z]+/g;
    let match;
    let word;

    while ((match = regex.exec(file))) {
        word = match[0];

        if (!this.nWords[word]) {
            this.nWords[word] = 0;
        }

        this.nWords[word] += 1;
    }
};

spellCorrector.prototype.getEdits = function (word) {
    const L = word.length;
    const AL = this.alphabet.length;
    const results = [];

    for (var i = 0; i <= L; i++) {
        const front = word.slice(0, i);

        if (i < L) {
            results.push(front + word.slice(i + 1));

            if (i < L - 1) {
                results.push(front + word.slice(i + 1, i + 2) + word.slice(i, i + 1) + word.slice(i + 2));
            }
        }

        for (var j = 0; j < AL; j++) {
            results.push(front + this.alphabet[j] + word.slice(i));

            if (i < L) {
                results.push(front + this.alphabet[j] + word.slice(i + 1));
            }
        }
    }

    return results;
};

spellCorrector.prototype.correct = function (word) {
    if (this.nWords[word]) {
        return word;
    }

    const suggestions = this.getEdits(word);
    //const candidates = new HashMap();
    const candidates = Object.create(null);
    let count = 0;

    for (const curWord of suggestions) {
        const maybe = this.nWords[curWord];

        if (maybe) {
            candidates[maybe] = curWord;
            count += 1;
            //candidates.set(this.nWords[curWord], curWord);
        }
    }


    if (count > 0) {
        return bestCandidate(candidates);
    }

    for (const curWord of suggestions) {
        const newSuggestions = this.getEdits(curWord);

        for (const newWord of newSuggestions) {
            const maybe = this.nWords[newWord];

            if (maybe) {
                candidates[maybe] = newWord;
                count += 1;
                //candidates.set(this.nWords[newWord], newWord);
            }
        }
    }

    return (count > 0) ? bestCandidate(candidates) : word;
};

function bestCandidate(candidates) {
    let maxCount = 0;
    let word;

    for (let count in candidates) {
        const parsed = parseInt(count);

        if (parsed > maxCount) {
            maxCount = parsed;
            word = candidates[count];
        }
    }

    return word;
}


module.exports.spellCorrector = spellCorrector;