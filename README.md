[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/KhaledSami/spelling-corrector)

![alt tag](https://travis-ci.org/KhaledSami/spelling-corrector.svg?branch=master)
# spelling-corrector
nodeJs Spelling Corrector version for Norvig's spelling corrector

# How to install

npm i spelling-corrector

# How to use 
```javascript

const SpellCorrector = require('spelling-corrector');

const spellCorrector = new SpellCorrector();
// With options. 
// The largest words in the  loaded dictionary are 17 letters long.
const spellCorrector = new SpellCorrector({ wordLengthLimit: 30 });

// you need to do this step only one time to load the Dictionary
spellCorrector.loadDictionary();

console.log(spellCorrector.correct('sucess'));

console.log(spellCorrector.correct('spel'));
```
