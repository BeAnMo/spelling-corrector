const assert = require('assert');
const { performance } = require('perf_hooks');
const fs = require('fs');

const SpellCorrector = require('../src/spell.js').spellCorrector;

const toFixed2 = n => parseFloat(n.toFixed(2));
const toPercent = n => parseFloat(toFixed2(n * 100));

const readLines = async function* (stream) {
    let prev = '';

    for await (const chunk of stream) {
        prev += chunk;

        while (true) {
            const eolIndex = prev.indexOf('\n');

            if (eolIndex < 0) {
                break;
            } else {
                const line = prev.slice(0, eolIndex + 1);

                yield line;

                prev = prev.slice(eolIndex + 1);
            }
        }
    }

    if (prev.length > 0) {
        yield prev;
    }
};

const loadAccuracyTestData = async version => {
    const stream = fs.createReadStream(__dirname + `/accuracy${version}.txt`, { encoding: 'utf-8' });
    let results = [];

    for await (const line of readLines(stream)) {
        const [correct, right] = line.split(':');
        const mispellings = right
            .split(' ')
            .filter(s => s)
            .map(s => s.trim())
            .map(mispelling => ({ correct, mispelling }));

        if (correct) {
            results.push(...mispellings);
        }
    }

    return results;
};

const runtime = (proc, name = 'PROCESS') => {
    let count = 0;
    let total = 0;
    let max = 0;
    let min = 0;

    return (...args) => {
        const start = performance.now();
        const results = proc(...args);
        const end = performance.now();
        const diff = end - start;

        count += 1;
        total += diff;

        if (diff > max) {
            max = diff;
        }

        if (diff < min) {
            min = diff;
        }

        console.log({
            runtime: name,
            current_ms: Math.round(diff),
            avg_ms: Math.round(total / count),
            min_ms: Math.round(min),
            max_ms: Math.round(max),
        });

        return results;
    };
};

const runTest = async function (version) {
    const tests = await loadAccuracyTestData(version);
    const start = performance.now();

    let good = 0;
    let unknown = 0;
    let count = 0;

    for (let { correct, mispelling } of tests) {
        const maybeCorrect = this.correct(mispelling);

        if (correct === maybeCorrect) {
            good += 1;
        } else if (!this.nWords[correct]) {
            unknown += 1;
        }

        count += 1;
    }

    const end = performance.now();

    return {
        version,
        percentCorrect: toPercent(good / count),
        wordsPerSecond: toFixed2(count / ((end - start) / 1000))
    };
};

async function main() {
    const Corrector = new SpellCorrector();

    Corrector.loadDictionary();

    for (let i = 0; i < 2; i++) {
        console.log(await runTest.call(Corrector, i));
    }
}

main().catch(console.error);
