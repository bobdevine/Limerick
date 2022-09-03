"use strict";

// Gen Limerick
// The syllabification of a limerickis generally 8,8,5,5,8, with slight variations.
// The first, second, and fifth lines of the poem should have seven to 10 syllables.
// They should rhyme and have the same rhythm.
// The third and fourth lines should have just five to seven syllables.
// They should also rhyme and have the same verbal rhythm.

// grammar of a limerick
const PATTERNS = [
    {
	"line1_sylls": 9,
	"line3_sylls": 6,
	"line1": 'There once was %SUBJECT% named %LINE1_RHYME_NAME%',
	"line2": 'Who %VERBED% %ARTICLE_NOUN% %PREP% %ARTICLE_RHYME_NOUN%',
	"line3": '%PRONOUN% %VERBED% the %LINE3_RHYME_NOUN%',
	"line4": '%CONJ% %PRONOUN% %VERBED% %ARTICLE_RHYME_NOUN%',
	"line5": '%CONJ% the %NOUN% %VERBED% the %RHYME_NOUN%',
    },
    {
	"line1_sylls": 9,
	"line3_sylls": 6,
	"line1": 'There once was %SUBJECT% from %LINE1_RHYME_LOCATION%',
	"line2": 'Who %VERBED% %ARTICLE_NOUN% %PREP% %ARTICLE_RHYME_NOUN%',
	"line3": '%PRONOUN% %VERBED% the %LINE3_RHYME_NOUN%',
	"line4": '%CONJ% %PRONOUN% %VERBED% %ARTICLE_RHYME_NOUN%',
	"line5": '%CONJ% the %NOUN% %VERBED% the %RHYME_NOUN%',
    },
];


function LimerickGenerator() {
    const randGender = Math.random();
    //alert('randomCharName rand=' + rand);
    // gender equality...
    if (randGender <= .5) {
        this.gender = 'm';
    } else {
        this.gender = 'f';
    }
}

LimerickGenerator.prototype.generateLimerick = function() {
    this.patChoice = Math.floor(Math.random() * PATTERNS.length);
    //console.log("generateLimerick() choice = " + this.patChoice);

    this.line1 = this.expandString(PATTERNS[this.patChoice].line1, [], PATTERNS[this.patChoice].line1_sylls);
    //console.log("generateLimerick() line 1 phonemes = " + this.line1_phonemes);
    let words = this.line1.split(" ");
    const syllables1 = sylCount(words);
    const rhymes1 = matchPhonemes(words[words.length - 1], this.line1_phonemes);
    rhymes1.sort(function(a,b) {return a.score - b.score});

    this.line3 = this.expandString(PATTERNS[this.patChoice].line3, [], PATTERNS[this.patChoice].line3_sylls);
    //words = inString.match(/(?:(?:\w-\w)|[\wÀ-ÿ'’])+/g);
    words = this.line3.split(" ");
    const syllables3 = sylCount(words);
    //phonemes = convertToPhonemes(words[words.length - 1]);
    const rhymes3 = matchPhonemes(words[words.length - 1], this.line3_phonemes);
    rhymes3.sort(function(a,b) {return a.score - b.score});

    this.line2 = this.expandString(PATTERNS[this.patChoice].line2, rhymes1, syllables1);
    this.line4 = this.expandString(PATTERNS[this.patChoice].line4, rhymes3, syllables3);
    this.line5 = this.expandString(PATTERNS[this.patChoice].line5, rhymes1, syllables1);
}


function sylCount(words) {
    const syl = new Syllable();
    let count = 0;
    for (let i=0; i<words.length; i++) {
	count += syl.countSyllables(words[i]);
    }
    return count;
}


// Rewrite using the productions until only terminals symbols remain
LimerickGenerator.prototype.expandString = function(inputString, rhymeWords, sylsWanted) {
    let words  = inputString.split(' ');
    let output = [];
    let word;
    let syllables = [];
    for (let i = 0; i < words.length; i++) {
        //console.log('EG WORDS[' + i + ']:' + words[i]);
        switch (words[i]) {
            case '%ADJ%':
                word = pickAdjective();
                output.push(word);
	        syllables.push(sylCount([word]));
                break;
            case '%ADVERB%':
                word = pickAdverb();
                output.push(word);
	        syllables.push(sylCount([word]));
                break;
	    case '%ARTICLE_NOUN%':
                word = pickNoun();
                output.push(pickArticle(word) + ' ' + word);
	        syllables.push(1 + sylCount([word]));
                break;
	    case '%ARTICLE_RHYME_NOUN%':
	        if (rhymeWords.length == 0) {
		    output.push("NO RHYME");
		} else {
		    //let rhymeIndex = Math.floor(Math.random() * rhymeWords.length);
	            //let rhyme = rhymeWords[rhymeIndex];
		    word = rhymeWords.pop().word.toLowerCase();
                    output.push(pickArticle(word) + ' ' + word);
	            syllables.push(1 + sylCount([word]));
		}
                break;
            case '%CONJ%':
                word = pickConjunction();
                output.push(word);
	        syllables.push(sylCount([word]));
                break;
            case '%NOUN%':
                word = pickNoun();
                output.push(word);
	        syllables.push(sylCount([word]));
                break;
            case '%PREP%':
                word = pickPreposition();
                output.push(word);
	        syllables.push(sylCount([word]));
                break;
            case '%PRONOUN%':
                word = pickPronoun(this.gender);
                output.push(word);
	        syllables.push(1);
                break;
	    case '%RHYME_NOUN%':
	        if (rhymeWords.length == 0) {
                    output.push(word);
		    word = "*NO RHYME*";
	            syllables.push(2);
		} else {
		    //let rhymeIndex = Math.floor(Math.random() * rhymeWords.length);
	            //word = rhymeWords[rhymeIndex].word;
		    word = rhymeWords.pop().word.toLowerCase();
                    output.push(word);
	            syllables.push(sylCount([word]));
		}
                break;
            case '%SUBJECT%':
	        let subjectIndex = Math.floor(Math.random() * Subjects.length);
	        if (Subjects[subjectIndex].hasOwnProperty("gender")) {
		    this.gender = Subjects[subjectIndex].gender;
		}
                word = Subjects[subjectIndex].word;
                output.push(pickArticle(word) + ' ' + word);
	        syllables.push(1 + sylCount([word]));
                break;
            case '%LINE1_RHYME_LOCATION%':
	        let locationIndex = Math.floor(Math.random() * Locations.length);
	        word = Locations[locationIndex].word;
	        this.line1_phonemes = Locations[locationIndex].phonemes;
                output.push(Locations[locationIndex].article + word);
                syllables.push(1 + sylCount([word]));
	        //console.log("line 1 LOCATION phonemes = " + this.line1_phonemes);
                break;
            case '%LINE1_RHYME_NAME%':
	        if (this.gender == 'm') {
		    let i = Math.floor(Math.random() * DICT_NAMES_MALE.length);
		    word = DICT_NAMES_MALE[i].text;
		    this.line1_phonemes = DICT_NAMES_MALE[i].phonemes;
		} else {
		    let i = Math.floor(Math.random() * DICT_NAMES_FEMALE.length);
		    word = DICT_NAMES_FEMALE[i].text;
		    this.line1_phonemes = DICT_NAMES_FEMALE[i].phonemes;
		}
	        //console.log("line 1 LOCATION phonemes = " + this.line1_phonemes);
                output.push(word);
                syllables.push(sylCount([word]));
                break;
	    case '%LINE3_RHYME_NOUN%':
	        let idx = Math.floor(Math.random() * DICT_NOUNS.length);
	        word = DICT_NOUNS[idx].text;
	        this.line3_phonemes = DICT_NOUNS[idx].phonemes;
                output.push(word);
	        syllables.push(sylCount([word]));
                break;
            case '%VERBED%':
                word = pastTense(pickVerb());
                output.push(word);
                syllables.push(sylCount([word]));
                break;
            default:
                word = words[i];
                output.push(word);
                syllables.push(sylCount([word]));
        }
    }
    let countSyllables = 0;
    for (var i = 0; i < syllables.length; i++) {
        countSyllables += syllables[i];
    }
    console.log('expandString() syllables = ' +  countSyllables + ' (want: ' + sylsWanted + ') ' + output);

    // attempt to equalize each line's meter
    let tries = 0;
    while (sylsWanted != countSyllables) {
	for (let i = 0; i < words.length; i++) {
	    //console.log('METER WORDS[' + i + ']:' + words[i] + ' word = ' + output[i] + ' syll = ' + syllables[i]);
	    countSyllables = 0;
	    for (var k = 0; k < syllables.length; k++) {
		countSyllables += syllables[k];
	    }
	    const sylDiff = countSyllables - sylsWanted;
	    switch (words[i]) {
		case '%ADJ%':
		    console.log("REWRITE %ADJ% '" + output[i] + "' syls = " + syllables[i]);
		    break;
		case '%ADVERB%':
		    break;
		case '%ARTICLE_NOUN%':
		    break;
		case '%ARTICLE_RHYME_NOUN%':
		    break;
		case '%CONJ%':
		    console.log("REWRITE " + words[i] + " word = '" + output[i] + "' syls = " + syllables[i]);
		    //console.log("REWRITE " + words[i] + " sylDiff = " + sylDiff);
		    if (sylDiff > 0 && syllables[i] > 1) {
			word = pickConjunction();
			let newCount = sylCount([word]);
			if (newCount < syllables[i]) {
			    output[i] = word;
			    syllables[i] = newCount;
			    console.log("REWRITE " + words[i] + " NEW = '" + word + "' syls = " + syllables[i]);
			}
		    }
		    break;
		case '%NOUN%':
		    console.log("REWRITE " + words[i] + " word = '" + output[i] + "' syls = " + syllables[i]);
		    break;
		case '%PREP%':
		    break;
		case '%PRONOUN%':
		    break;
		case '%RHYME_NOUN%':
		    break;
		case '%SUBJECT%':
		    console.log("REWRITE " + words[i] + " word = '" + output[i] + "' syls = " + syllables[i]);
		    break;
		case '%SUBJECT_LOCATION%':
		    break;
		case '%SUBJECT_NAME%':
		    break;
		case '%VERBED%':
		    console.log("REWRITE " + words[i] + " word = '" + output[i] + "' syls = " + syllables[i]);
		    break;
		default:
	    }
	    for (var k = 0; k < syllables.length; k++) {
		countSyllables += syllables[k];
	    }
	}
	if (tries-- < 1) {
	    break;
	}
    }
    
    return capitalizeFirstLetter(output.join(" "));
}


function pickNoun() {
    let i = Math.floor(Math.random() * DICT_NOUNS.length);
    return DICT_NOUNS[i].text;
}

function pickVerb() {
    let i = Math.floor(Math.random() * Verbs.length);
    return Verbs[i];
}

function pickPronoun(gender) {
    // not woke/politically correct...
    if (gender == 'm') {
	return "he";
    } else if (gender == 'f') {
	return "she";
    } else {
	return "it";
    }
}

function pickPreposition() {
    let i = Math.floor(Math.random() * Prepositions.length);
    return Prepositions[i];
}

function pickArticle(word) {
    // “A” is used before a consonant (b, c, d, etc.)
    // “A” is used before a vowel but consonant sound (a universe)
    // “A” is used before a pronounced “h”
    // “An” is used before a vowel (a, e, i, etc.)
    // “An” is used before an unpronounced (mute) “h” (a hotel / an heir)
    // “An” is used before a consonant but vowel sound (an MBA)
    const vowels = ("aeiouAEIOU"); 
    if (vowels.indexOf(word[0]) !== -1) {
	return 'an';
    } else {
	return 'a';
    }
}

function pickConjunction() {
    let i = Math.floor(Math.random() * Conjunctions.length);
    return Conjunctions[i];
}

function pickAdjective() {
    const adjIndex = Math.floor(Math.random() * Adjectives.length);
    return Adjectives[adjIndex];
}


function capitalizeFirstLetter(str) {
    //console.log("capitalizeFirstLetter() IN : '" + str + "'");
    if (typeof str !== 'string') { return ""; }
    //console.log("capitalizeFirstLetter() : " + str[0] + " -> " + str[0].toUpperCase());
    return str[0].toUpperCase() + str.slice(1);
}


//--------------------------------------------------
// hidden functions

function matchPhonemes(word, phonemes) {
    //console.log("matchPhonemes() IN : '" + phonemes + "'");
    if (phonemes === 'undefined') {
	return [];
    }
    //const searchPattern = phonemes.trim().split(' ').reverse();
    const patWord = phonemes.trim().split(' ');
    //console.log("matchPhonemes() REV : '" + searchPattern + "'");
    const wordUpper = word.toUpperCase();
    const matches = [];
    const dictLen = DICT_RHYMES.length;

    for (let i=0; i< dictLen; i++) {
	let entry = DICT_RHYMES[i];
	//let pat = entry.phonemes.split(' ').reverse();
	const patDictWord = entry.phonemes.split(' ');
	//let length = Math.min(searchPattern.length, pat.length);
	let score = 0;

	let idxWord = patWord.length;
	let idxDictWord = patDictWord.length;
	let matchPos = 0;
	while (true) {
	    if (idxWord < 0) break;
	    if (idxDictWord < 0) break;
	    if (patWord[idxWord] == patDictWord[idxDictWord]) {
		score += 1.0 * (1.5 / (0.8 + matchPos));
	    } else if (patWord[idxWord].length >= 2 && patDictWord[idxDictWord].length >= 2) {
		if (patWord[idxWord].charAt(0) == patDictWord[idxDictWord].charAt(0)
		    && patWord[idxWord].charAt(1) == patDictWord[idxDictWord].charAt(1)) {
		    score += .66 * (1.5 / (1.0 + matchPos));
		    //console.log("matchPhonemes(): patWord = '" + patWord + "' patDictWord = '" + patDictWord);
		}
	    } else {
		break;
	    }
	    idxWord--;
	    idxDictWord--;
	    matchPos++;
	}
	
	if ( ((score > 0) || (matches.length < 2 && score > 1))
	     && (wordUpper != entry.text)  ) {
	    //console.log("matchPhonemes() : '" + entry.text + "' pat '" + entry.phonemes + "' score: " + score);
	    const rec = {
		"word" : entry.text,
		"score" : score,
	    };
	    matches.push(rec);
	}
    }
    return matches;
}


function isVowel(c) {
    return ['a', 'e', 'i', 'o', 'u'].indexOf(c) !== -1
}


function pastTense(word) {
    // irregular verb?
    for (let irr in irregularVerbs) {
	if (irr == word)
	{
	    //console.log('pastTense (irregular):' + word + '-->' + irregularVerbs[irr]);
            return irregularVerbs[irr];
	}
    }    

    let last = word.charAt(word.length-1);

    // Verbs that end in 'c' add "ked"
    // "mimicked" "panicked" "picknicked"
    if (last == 'c') {
	return word + 'ked';
    }

    if (last == 'e')
	return word + 'd';

    // if the verb ends with a consonant and y,
    // change the “y” to “i” and add "ed"
    // "pitied" "worried" "copied" but "played"
    if (last == 'y') {
	let c = word.charAt(word.length-2);
	if (!isVowel(c))
	{
	    return word.slice(0, word.length-1) + 'ied';
	} else {
	    return word + 'ed';
	}
    }

    // if verb ends in consonant + vowel + consonant,
    // double the last consonant and then add "ed"
    // "bar" --> "barred", but "bare" --> "bared"
    // BUT, don't double if last consonant is special
    let secondLast = word.charAt(word.length-2);
    let thirdLast = word.charAt(word.length-3);
    if (!isVowel(thirdLast) && isVowel(secondLast) && !isVowel(last))
    {
	const special = ("lrtwxy");
	if (special.indexOf(last) !== -1)
	    return word + 'ed';
	else
	    return word + last + 'ed';
    }

    // if the verb ends with vowel + consonant,
    // the final consonant is doubled if the last syllable is stressed
    // BUT, in British English a final "l" is doubled,
    // even if the last syllable is not stressed.
    // "traveled" vs "travelled" and "canceled" vs "cancelled"

    // else add -ed to the base form
    return word + 'ed';
}


const irregularVerbs = {
    'arise' : 'arose',
    'babysit' : 'babysat',
    'be' : 'was',
    'beat' : 'beat',
    'become' : 'became',
    'bend' : 'bent',
    'begin' : 'began',
    'bet' : 'bet',
    'bind' : 'bound',
    'bite' : 'bit',
    'bleed' : 'bled',
    'blow' : 'blew',
    'break' : 'broke',
    'breed' : 'bred',
    'bring' : 'brought',
    'broadcast' : 'broadcast',
    'build' : 'built',
    'buy' : 'bought',
    'catch' : 'caught',
    'choose' : 'chose',
    'come' : 'came',
    'cost' : 'cost',
    'cut' : 'cut',
    'deal' : 'dealt',
    'dig' : 'dug',
    'do' : 'did',
    'draw' : 'drew',
    'drink' : 'drank',
    'drive' : 'drove',
    'eat' : 'ate',
    'fall' : 'fell',
    'feed' : 'fed',
    'feel' : 'felt',
    'fight' : 'fought',
    'find' : 'found',
    'fly' : 'flew',
    'forbid' : 'forbade',
    'forget' : 'forgot',
    'forgive' : 'forgave',
    'freeze' : 'froze',
    'get' : 'got',
    'give' : 'gave',
    'go' : 'went',
    'grow' : 'grew',
    'hang' : 'hung',
    'have' : 'had',
    'hear' : 'heard',
    'hide' : 'hid',
    'hit' : 'hit',
    'hold' : 'held',
    'hurt' : 'hurt',
    'keep' : 'kept',
    'know' : 'knew',
    'lay' : 'laid',
    'lead' : 'led',
    'leave' : 'left',
    'lend' : 'lent',
    'let' : 'let',
    'lie' : 'lay',
    'light' : 'lit',
    'lose' : 'lost',
    'make' : 'made',
    'mean' : 'meant',
    'meet' : 'met',
    'pay' : 'paid',
    'put' : 'put',
    'quit' : 'quit',
    'read' : 'read',
    'ride' : 'rode',
    'ring' : 'rang',
    'rise' : 'rose',
    'run' : 'ran',
    'say' : 'said',
    'see' : 'saw',
    'sell' : 'sold',
    'send' : 'sent',
    'set' : 'set',
    'shake' : 'shook',
    'shine' : 'shone',
    'shoot' : 'shot',
    'show' : 'showed',
    'shut' : 'shut',
    'sing' : 'sang',
    'sink' : 'sank',
    'sit' : 'sat',
    'sleep' : 'slept',
    'slide' : 'slid',
    'speak' : 'spoke',
    'spend' : 'spent',
    'spin' : 'spun',
    'spread' : 'spread',
    'stand' : 'stood',
    'steal' : 'stole',
    'stick' : 'stuck',
    'sting' : 'stung',
    'strike' : 'struck',
    'swear' : 'swore',
    'sweep' : 'swept',
    'swim' : 'swam',
    'swing' : 'swung',
    'take' : 'took',
    'teach' : 'taught',
    'tear' : 'tore',
    'tell' : 'told',
    'think' : 'thought',
    'throw' : 'threw',
    'understand' : 'understood',
    'wake' : 'woke',
    'wear' : 'wore',
    'win' : 'won',
    'withdraw' : 'withdrew',
    'write' : 'wrote',
};

const Conjunctions = [
    "for", "and", "nor", "but", "or", "yet", "so", "after", "although", "as",
    "as far as", "as if", "as long as", "as soon as", "as though", "because",
    "before", "even if", "even though", "every time", "if", "in order that",
    "since", "so", "so that", "then", "that", "though", "unless", "until",
    "when", "whenever", "where", "whereas", "wherever", "while",
];


const Subjects = [
    {	"word": "aardvark",    },
    {	"word": "actor",    },
    {	"word": "actress",    },
    {	"word": "alligator",    },
    {	"word": "anteater",    },
    {	"word": "antelope",    },
    {	"word": "ant",    },
    {	"word": "archer",    },
    {	"word": "armadillo",    },
    {	"word": "athlete",    },
    {	"word": "aunt",	"gender": "f",    },
    {	"word": "author",    },
    {	"word": "baboon",    },
    {	"word": "baby",    },
    {	"word": "badger",    },
    {	"word": "baker",    },
    {	"word": "banker",    },
    {	"word": "barber",    },
    {	"word": "banana",    },
    {	"word": "bear",    },
    {	"word": "beast",    },
    {	"word": "beetle",    },
    {	"word": "beggar",    },
    {	"word": "beginner",    },
    {	"word": "bird",    },
    {	"word": "beaver",    },
    {	"word": "brother",	"gender": "m",    },
    {	"word": "burglar",    },
    {	"word": "bulldozer",    },
    {	"word": "butcher",    },
    {	"word": "buzzard",    },
    {	"word": "calf",    },
    {	"word": "camel",    },
    {	"word": "captain",    },
    {	"word": "carp",    },
    {	"word": "carpenter",    },
    {	"word": "carrot",    },
    {	"word": "cat",    },
    {	"word": "chair",    },
    {	"word": "chauffeur",    },
    {	"word": "chef",    },
    {	"word": "chicken",    },
    {	"word": "chief",    },
    {	"word": "child",    },
    {	"word": "clam",    },
    {	"word": "clerk",    },
    {	"word": "client",    },
    {	"word": "coach",    },
    {	"word": "cockroach",    },
    {	"word": "colt",    },
    {	"word": "columnist",    },
    {	"word": "comic",    },
    {	"word": "cousin",    },
    {	"word": "cow",    },
    {	"word": "crab",    },
    {	"word": "craftsman",	"gender": "m",    },
    {	"word": "crawdad",    },
    {	"word": "crayfish",    },
    {	"word": "creature",    },
    {	"word": "cricket",    },
    {	"word": "criminal",    },
    {	"word": "crocodile",    },
    {	"word": "crook",    },
    {	"word": "crow",    },
    {	"word": "cucumber",    },
    {	"word": "daughter",	"gender": "f",    },
    {	"word": "deer",    },
    {	"word": "dentist",    },
    {	"word": "dietician",    },
    {	"word": "digger",    },
    {	"word": "dinosaur",    },
    {	"word": "doctor",    },
    {	"word": "dog",    },
    {	"word": "dolphin",    },
    {	"word": "donkey",    },
    {	"word": "dragon",    },
    {	"word": "dragonfly",    },
    {	"word": "driver",    },
    {	"word": "duck",    },
    {	"word": "duckling",    },
    {	"word": "eagle",    },
    {	"word": "editor",    },
    {	"word": "eel",    },
    {	"word": "elephant",    },
    {	"word": "employee",    },
    {	"word": "employer",    },
    {	"word": "enemy",    },
    {	"word": "engineer",    },
    {	"word": "ex-husband",	"gender": "m",    },
    {	"word": "ex-wife",	"gender": "f",    },
    {	"word": "female",	"gender": "f",    },
    {	"word": "fighter",    },
    {	"word": "fireman",	"gender": "m",    },
    {	"word": "fisherman",	"gender": "m",    },
    {	"word": "friend",    },
    {	"word": "frog",    },
    {	"word": "gazelle",    },
    {	"word": "German",    },
    {	"word": "ghost",    },
    {	"word": "giant",    },
    {	"word": "giraffe",    },
    {	"word": "girl",    },
    {	"word": "goose",    },
    {	"word": "gorilla",    },
    {	"word": "governor",    },
    {	"word": "granddaughter",	"gender": "f",    },
    {	"word": "grandfather",	"gender": "m",    },
    {	"word": "grandmother",	"gender": "f",    },
    {	"word": "grandson",	"gender": "m",    },
    {	"word": "grasshopper",    },
    {	"word": "Greek",    },
    {	"word": "grouse",    },
    {	"word": "gymnast",    },
    {	"word": "halibut",    },
    {	"word": "hamster",    },
    {	"word": "hawk",    },
    {	"word": "hen",    },
    {	"word": "horse",    },
    {	"word": "hovercraft",    },
    {	"word": "hurricane",    },
    {	"word": "interviewer",    },
    {	"word": "Italian",    },
    {	"word": "jaguar",    },
    {	"word": "Japanese",    },
    {	"word": "jellyfish",    },
    {	"word": "judge",    },
    {	"word": "kangaroo",    },
    {	"word": "kitten",    },
    {	"word": "kohlrabi",    },
    {	"word": "Korean",    },
    {	"word": "laborer",    },
    {	"word": "lawyer",    },
    {	"word": "lion",    },
    {	"word": "lizard",    },
    {	"word": "llama",    },
    {	"word": "magician",    },
    {	"word": "maid",	"gender": "f",    },
    {	"word": "mailman",	"gender": "m",    },
    {	"word": "male",	"gender": "m",    },
    {	"word": "man",	"gender": "m",    },
    {	"word": "manager",    },
    {	"word": "mechanic",    },
    {	"word": "minister",    },
    {	"word": "monkey",    },
    {	"word": "mosquito",    },
    {	"word": "mother",	"gender": "f",    },
    {	"word": "mouse",    },
    {	"word": "musician",    },
    {	"word": "nephew",	"gender": "m",    },
    {	"word": "niece",	"gender": "f",    },
    {	"word": "nurse",    },
    {	"word": "octopus",    },
    {	"word": "ostrich",    },
    {	"word": "otter",    },
    {	"word": "panther",    },
    {	"word": "pastor",    },
    {	"word": "pelican",    },
    {	"word": "pet",    },
    {	"word": "pig",    },
    {	"word": "pigeon",    },
    {	"word": "pilot",    },
    {	"word": "policeman",	"gender": "m",    },
    {	"word": "priest",	"gender": "m",    },
    {	"word": "printer",    },
    {	"word": "professor",    },
    {	"word": "puma",    },
    {	"word": "queen",    },
    {	"word": "rabbi",    },
    {	"word": "rabbit",    },
    {	"word": "rat",    },
    {	"word": "raven",    },
    {	"word": "robin",    },
    {	"word": "rooster",    },
    {	"word": "sailor",    },
    {	"word": "scarecrow",    },
    {	"word": "seagull",    },
    {	"word": "secretary",    },
    {	"word": "servant",    },
    {	"word": "shark",    },
    {	"word": "sheep",    },
    {	"word": "shoemaker",    },
    {	"word": "Siberian",    },
    {	"word": "singer",    },
    {	"word": "slave",    },	
    {	"word": "snake",    },
    {	"word": "snowman",    },
    {	"word": "soldier",    },
    {	"word": "son",    },
    {	"word": "sparrow",    },
    {	"word": "spider",    },
    {	"word": "spy",    },
    {	"word": "squirrel",    },
    {	"word": "surgeon",    },
    {	"word": "swordfish",    },
    {	"word": "teacher",    },
    {	"word": "tiger",    },
    {	"word": "tortoise",    },
    {	"word": "tramp",    },
    {	"word": "turkey",    },
    {	"word": "turtle",    },
    {	"word": "uncle",  "gender": "m",    },
    {	"word": "visitor",    },
    {	"word": "vulture",    },
    {	"word": "waiter",    },
    {	"word": "waitress", "gender": "f",    },
    {	"word": "walrus",    },
    {	"word": "watchmaker",    },
    {	"word": "weasel",    },
    {	"word": "witness",    },
    {	"word": "wolf",    },
    {	"word": "woman", "gender": "f",    },
    {	"word": "writer",    },
    {	"word": "zebra",    },
];

const Locations =  [
    {
	"word": "alley",
	"phonemes": "AE L IY",
	"article": "an ",
    },    
    {
	"word": "anemone",
	"phonemes": "AE N IH M OW N IY",
	"article": "an ",
    },    
    {
	"word": "Abbeville",
	"phonemes": "AE1 B - V IH0 L",
	"article": "",
    },
    {
	"word": "Nantucket",
	"phonemes": "N AE N T AH K IH T",
	"article": "",
    },
    {
	"word": "Detroit",
	"phonemes": "D IH T R OY T",
	"article": "",
    },
];


const Verbs = [
    'accept', 'account', "accuse", 'achieve', 'act', 'add',
    'admit', 'affect', 'afford', 'agree', 'aim', 'allow', 'answer',
    'apply', 'argue', 'arrange', 'arrive', 'ask', 'attack', 'avoid',
    'base', 'beat', 'become', 'begin', 'believe', 'belong', "borrow",
    'break', "build", 'build', "burn", 'burn', 'buy', 'call',
    'can', 'care', 'carry', 'catch', 'cause', "chain", "change",
    'change', 'charge', "chase", 'check', 'choose', 'claim', 'clean',
    'clear', 'climb', "close", 'close', 'collect', "come", 'come',
    'commit', 'compare', 'complain', 'complete', 'confirm', 'connect',
    "conquer", 'consider', 'contact', 'contain', 'continue', 'contribute',
    'control', 'cook', 'copy', 'correct', 'cost', 'count',
    'cover', 'create', 'cross', 'cry', 'cut', 'damage', 'dance',
    'deal', 'decide', 'deliver', 'demand', 'deny', 'depend', 'describe',
    'design', 'destroy', 'develop', "die", 'die', 'disappear', 'discover',
    'discuss', 'divide', "drag", 'draw', "dream", 'dress', 'drink',
    'drive', 'drop', 'eat', "embrace", 'enable', 'encourage', 'enjoy',
    'examine', 'expect', 'experience', 'explain', 'express', 'extend',
    'face', 'fail', "fall", 'fall', 'fasten', 'feed', 'feel',
    "fight", 'fight', 'fill', 'find', 'finish', 'fit', 'fly', 'fold',
    'follow', 'force', "forget", 'forget', 'forgive', 'form', 'gain',
    'get', 'give', 'go', 'grow', 'handle', "hang", 'hate', "have",
    'have', 'head', 'hear', 'help', 'hide', 'hit', 'hold', 'hope',
    'hurt', 'identify', 'imagine', 'improve', 'include', 'increase',
    'indicate', 'inform', 'intend', 'introduce', 'invite',
    'involve', 'join', 'jump', 'keep', 'kick', "kill", 'kill', 'knock',
    'know', "laugh", 'laugh', 'lead', 'learn', 'leave', 'lend', "lie",
    'lie', 'like', 'limit', 'link', 'listen', "live", 'live', 'look',
    'lose', 'love', 'make', 'manage', 'mark', 'matter', 'mean',
    'measure', 'meet', 'mention', 'might', 'mind', 'miss', 'move',
    "murder", 'need', 'notice', 'obtain', 'offer', 'open', 'order',
    'ought', "own", 'own', 'pass', 'pay', 'perform', 'pick', 'place',
    'plan', 'play', 'point', 'prefer', 'prepare', 'present', 'press',
    'prevent', 'produce', 'promise', 'protect', 'prove', 'provide',
    'publish', 'pull', 'push', 'put', 'raise', 'reach', 'read',
    'realize', 'receive', 'recognize', 'record', 'reduce', 'reflect',
    'refuse', 'regard', 'relate', 'release', 'remain', 'remember',
    'remove', 'repeat', 'replace', 'reply', 'report', 'represent',
    'require', 'rest', 'return', "reveal", 'reveal', "ride",
    'ring', "rise", 'rise', 'roll', "run", 'run', "save", 'save',
    'say', "scream", "seduce", "see", 'see', 'sell', 'send', 'separate',
    'serve', 'set', 'settle', 'shake', 'share', 'shoot',
    'shout', 'show', 'shut', 'sing', 'sit', 'sleep', 'smile', 'sniff',
    'sort', 'sound', "speak", 'speak', 'stand', 'start', 'state', 'stay',
    "steal", 'stick', "stop", 'stop', 'study', 'succeed', 'suffer',
    'suggest', 'suit', 'supply', 'support', 'suppose', 'survive', 'take',
    'talk', 'teach', 'tell', 'tend', 'test', 'thank', 'think', 'throw',
    'touch', 'train', 'travel', 'treat', "trick", 'try', 'turn',
    'understand', 'use', 'visit', 'vote', 'wait', 'walk', 'want', 'warn',
    'wash', 'watch', 'wear', "weave", "weep", "whisper", 'will', 'win',
    'wish', 'wonder', 'work', 'worry', 'would', 'write',
];

const Prepositions = [
    "about", "above", "across", "after", "against", "along", "amid",
    "among", "around", "at", "before", "behind", "below", "beneath",
    "beside",  "beyond", "by", "down", "for", "from", "in", "inside", "into",
    "near", "of", "on", "opposite", "outside", "out of", "over", "towards",
    "under", "underneath", "upon", "with", "without",
];

const Adjectives = [
    "abject", "able", "abridged", "abrupt", "abscessed", "absolved",
    "absorbed", "abstruse", "absurd", "abused",
    "accrued", "aching", "acorned", "acrid", "acting", "added",
    "adept", "adjunct", "admired", "adored", "adrift", "adroit", "adult",
    "advised", "aery", "afloat", "afoot", "afoul", "afraid",
    "after", "aftmost", "agape", "aged",
    "ageless", "aggrieved", "agile", "agleam", "agnate", "ailing", "aimless",
    "airborne", "airless", "airsick", "airtight", "alert",
    "alien", "alight", "allowed", "alloyed", "alone", "aloof", "altered",
    "altern", "amazed", "ample", "amused", "android", "angled",
    "anguished", "antic", "antique", "antlered", "anxious",
    "apart", "apish", "appalled", "arcane", "arching",
    "armored", "aroused", "arranged", "arrant",
    "arrhythmic", "artful", "artless", "arty", "ashamed", "ashen",
    "aslant", "asleep", "assumed", "assured", "astral", "astute",
    "attired", "attuned", "austere",
    "averse", "avid", "avowed", "awake", "aware",
    "away", "awesome", "awestruck", "awful", "awheel",
    "awing", "awkward", "awnless", "awry",
    "babbling", "backhand", "backless", "backstage", "backward", "backwoods",
    "baddish", "baffling", "baggy", "balanced", "balding",
    "baleful", "balky", "balmy", "banal",
    "bandaged", "banded", "baneful", "bankrupt", "banner", "bannered",
    "baroque", "barrelled", "baseless", "basest", "bashful", "basic",
    "bassy", "bastioned", "bated", "battered",
    "bawdy", "beaded", "beady", "beaky", "beaming",
    "bearlike", "beastlike", "beastly", "beefy", "beery", "beguiled",
    "belted", "bemused", "bended", "bending", "benign", "berserk", "besieged",
    "bestial", "betrothed", "beveled", "biased",
    "biggest", "biggish", "bijou", "bilious", "billion", "billionth",
    "birdlike", "bitchy", "bitten", "bitty", "bizarre",
    "blameless", "blaring", "blasted", "blatant",
    "blurry", "boastful", "bogus", "boring", "bravest", "brutal",
    "campy", "candied", "cheesy",
    "childish", "classy", "clownish", "clumsy", "comfy",
    "disguised", "dozing", "dreamy", "dreary", "drunken",
    "edgy", "elite", "extinct", "famous", "faultless", "faulty", "favored",
    "fearless", "fearsome", "feeble", "fierce", "finest", "fishy",
    "flabby", "flaccid", "flashy", "flawless", "flimsy", "foolish",
    "fragile", "freaky", "frisky", "funky", "fussy",
    "ghostly", "ghoulish", "gifted", "giggly", "girly", "gleeful", "gnarly",
    "godlike", "goofy", "gorgeous", "greenish", "greyish", "groovy", "gruesome",
    "grumpy", "guilty", "hackneyed", "hallowed", "handsome", "harmful", "harmless",
    "hasty", "hated", "haughty", "haunted", "hazy", "healthy", "hearty", "heated",
    "highbrow", "highest", "hippest", "honest", "horny", "hottest",
    "hugest", "hulking", "hungry", "ignored", "immense", "improved", "impure",
    "insane", "insured", "intense", "irate", "itchy",
    "jerky", "jeweled", "jiggly", "joyful", "joyless", "kinky", "knavish",
    "kosher", "lanky", "leaping", "lonesome", "loyal",
    "maroon", "massive", "modest", "monstrous", "muddy",
    "mustached", "musty", "mutant", "naughty",
    "oblate", "oblique", "oblong", "obscene", "obscure", "painful", "peppy",
    "perplexed", "perverse", "pesky", "phony", "piquant", "placid", "plucky",
    "polished", "polite", "pretty", "profane", "rakish", "rancid",
    "ratty", "raucous", "raunchy", "raving", "regal", "rhythmic", "robust",
    "sagging", "sallow", "sanest", "sappy", "sassy", "scary", "screwy",
    "seedy", "senile", "shabby", "sickly", "sincere", "sinful", "singing",
    "sleazy", "sleepy", "sober", "speechless", "springy", "spunky", "squeaky",
    "squishy", "stalwart", "stealthy", "stodgy", "strangest",
    "stretchy", "stubborn", "stupid", "stylish", "subtle", "sugared", "suited",
    "sultry", "supple", "surplus", "swanky", "sweaty",
    "taboo", "tacky", "tasteful", "tasteless", "eenage", "thankful", "thankless",
    "thinking", "thoughtful", "thoughtless", "throbbing", "tireless", "toxic",
    "tricky","umpteenth", "ncooked", "nspoiled", "nwise", "useful", "useless",
    "vengeful", "wacky", "warlike", "wasteful", "zesty",
]; 
