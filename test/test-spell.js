const assert = require('assert');
const SpellCorrector = require('../src/spell.js').spellCorrector;

suite("Spell Corrector", function () {

    let spellCorrector;

    setup(function () {
        spellCorrector = new SpellCorrector();
    });

    test("the spellCorrector dictionary should be empty", function () {
        const keys = Object.keys(spellCorrector.nWords);

        assert.equal(keys.length, 0);
    });

    test("loadDictionary function should construct a hashmap from the passed dictionary", function () {
        this.timeout(40000);
        spellCorrector.loadDictionary();
        let nWords = spellCorrector.nWords;

        assert.equal(nWords["the"], 80030);
    });

    // The original version of getEdits included duplicates.
    test("getEdits function should generate all possible correction strings from a passed word", function () {
        let expectedNumberOfCombination = function (n) {
            return 54 * n + 25;
        };
        let editWords = spellCorrector.getEdits("xy");
        let actual = editWords.size;
        let expected = expectedNumberOfCombination(2);
        assert.equal(actual, expected, `Expected ${expected} and got ${actual}.`);

        editWords = spellCorrector.getEdits("aaa");
        actual = editWords.size;
        expected = expectedNumberOfCombination(3);
        assert.equal(actual, expected, `Expected ${expected} and got ${actual}.`);

    });

    test("getEdits function should not generate invalid correction strings from a passed word", function () {
        let editWords = spellCorrector.getEdits("xy");
        assert.equal(editWords.has("xyz"), true, 'Does not have xyz');
        assert.equal(editWords.has("axyz"), false, 'Has axyz');
        assert.equal(editWords.has("xy1"), false, 'Has xy1');
    });

    test("correct function should return the correction for the passed word", function () {
        spellCorrector.loadDictionary();
        this.timeout(40000);
        let set1 = {
            'access': 'acess',
            'accommodation': 'accomodation',
            'forbidden': 'forbiden',
            'decisions': 'deciscions',
            'decisions': 'descisions',
            'supposedly': 'supposidly',
            'cart': 'catt',
            'address': 'addres',
            'member': 'rember'
        };
        for (let key in set1) {
            if (set1.hasOwnProperty(key)) {
                const expected = key;
                const bad = set1[key];
                const correctedWord = spellCorrector.correct(bad);
                assert.equal(correctedWord, expected);
            }
        }
    });

    test("should return no edits if the word length is greater than the wordLengthLimit", function () {
        spellCorrector.wordLengthLimit = 10;

        let edits0 = spellCorrector.getEdits('mushrooming');

        assert.equal(edits0.size, 0, 'Should not have edits');

        let edits1 = spellCorrector.getEdits('mushroom');

        assert.equal(edits1.size > 0, true, 'Should have edits');
    });
});