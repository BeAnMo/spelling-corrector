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
    const results = new Set();

    const add = madeWord => {
        results.add(madeWord);
    };

    for (let i = 0; i <= L; i++) {
        const left = word.slice(0, i);
        const right = word.slice(i);

        if (i < L) {
            // delete
            add(left + right.slice(1));

            if (i < L - 1) {
                // transpose
                add(left + right[1] + right[0] + right.slice(2));
            }
        }

        for (let j = 0; j < AL; j++) {
            const ch = this.alphabet[j];
            // insert
            add(left + ch + right);

            if (i < L) {
                // replace
                add(left + ch + right.slice(1));
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
    const candidates = Object.create(null);
    let count = 0;

    for (const curWord of suggestions) {
        const maybe = this.nWords[curWord];

        if (maybe) {
            candidates[maybe] = curWord;
            count += 1;
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