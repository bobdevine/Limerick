"use strict";


function Syllable() {
    this. count = 0;
}

Syllable.prototype.countSyllables_OLD = function(word) {
    word = word.toLowerCase();
    if (word.length <= 3) { return 1; }
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    return word.match(/[aeiouy]{1,2}/g).length;
}


Syllable.prototype.countSyllables = function(word) {
    if (word.length < 1) {return 0;}
    //if (word === "") {return 0;}
    if (word.length < 3) {return 1;}
    if (Object.hasOwn(WEIRD_WORD_SYLLABLES, word)) {return WEIRD_WORD_SYLLABLES[word]; }

    let syllables = 0;
    if (word.endsWith("s'")||word.endsWith("s’")) {word.slice(-1);} //ending with s'
    if (word.endsWith("s's")||word.endsWith("s’s")) {word.slice(-1,-3);} //ending with s's
    const cEndings = word.match(/(?<=\w{3})(side|\wess|(?<!ed)ly|ment|ship|board|ground|(?<![^u]de)ville|port|ful(ly)?|berry|box|nesse?|such|m[ae]n|wom[ae]n|horse|anne)s?$/mi);
    if (cEndings) {word = word.replace(cEndings[0],"\n" + cEndings[0]);} //Splits into two words and evaluates them as such
    const cBeginnings = word.match(/^(ware|side(?![sd]$)|p?re(?!ach|agan|al|au)|[rf]ace(?!([sd]|tte)$)|place[^nsd])/mi);
    if (cBeginnings) {word = word.replace(cBeginnings[0],""); syllables++;}
    const esylp = word.match(/ie($|l|t|rg)|([cb]|tt|pp)le$|phe$|kle(s|$)|[^n]scien|sue|aybe$|[^aeiou]shed|[^lsoai]les$|([^e]r|g)ge$|(gg|ck|yw|etch)ed$|(sc|o)he$|seer|^re[eiuy]/gmi);
    if (esylp) {syllables += esylp.length;} //E clustered positive
    const esylm = word.match(/every|some([^aeiouyr]|$)|[^trb]ere(?!d|$|o|r|t|a[^v]|n|s|x)|[^g]eous|niet/gmi);
    if (esylm) {syllables -= esylm.length;} //E clustered negative
    const isylp = word.match(/rie[^sndfvtl]|(?<=^|[^tcs]|st)ia|siai|[^ct]ious|quie|[lk]ier|settli|[^cn]ien[^d]|[aeio]ing$|dei[tf]|isms?$/gmi);
    if (isylp) {syllables += isylp.length;} //I clustered positive
    const osylp = word.match(/nyo|osm(s$|$)|oinc|ored(?!$)|(^|[^ts])io|oale|[aeiou]yoe|^m[ia]cro([aiouy]|e)|roe(v|$)|ouel|^proa|oolog/gmi);
    if (osylp) {syllables += osylp.length;} //O clustered positive
    const osylm = word.match(/[^f]ore(?!$|[vcaot]|d$|tte)|fore|llio/gmi);
    if (osylm) {syllables -= osylm.length;} //O clustered negative
    const asylp = word.match(/asm(s$|$)|ausea|oa$|anti[aeiou]|raor|intra[ou]|iae|ahe$|dais|(?<!p)ea(l(?!m)|$)|(?<!j)ean|(?<!il)eage/gmi);
    if (asylp) {syllables += asylp.length;} //A clustered positive
    const asylm = word.match(/aste(?!$|ful|s$|r)|[^r]ared$/gmi);
    if (asylm) {syllables -= asylm.length;} //A clustered negative
    const usylp = word.match(/uo[^y]|[^gq]ua(?!r)|uen|[^g]iu|uis(?![aeiou]|se)|ou(et|ille)|eu(ing|er)|uye[dh]|nuine|ucle[aeiuy]/gmi);
    if (usylp) {syllables += usylp.length;} //U clustered positive
    const usylm = word.match(/geous|busi|logu(?!e|i)/gmi);
    if (usylm) {syllables -= usylm.length;} //U clustered negative
    const ysylp = word.match(/[ibcmrluhp]ya|nyac|[^e]yo|[aiou]y[aiou]|[aoruhm]ye(tt|l|n|v|z)|dy[ae]|oye[exu]|lye[nlrs]|(ol|i|p)ye|aye(k|r|$|u[xr]|da)|saye\w|wy[ae]|[^aiou]ying/gmi);
    if (ysylp) {syllables += ysylp.length;} //Y clustered positive
    const ysylm = word.match(/arley|key|ney$/gmi);
    if (ysylm) {syllables -= ysylm.length;}
    const essuffix = word.match(/((?<!c[hrl]|sh|[iszxgej]|[niauery]c|do)es$)/gmi);
    if (essuffix) {syllables--;}//es suffix
    const edsuffix = word.match(/([aeiouy][^aeiouyrdt]|[^aeiouy][^laeiouyrdtbm]|ll|bb|ield|[ou]rb)ed$|[^cbda]red$/gmi);
    if (edsuffix) {syllables--}
    const csylp = word.match(/chn[^eai]|mc|thm/gmi);
    if (csylp) {syllables += csylp.length;} //Consonant clustered negative
    const eVowels = word.match(/[aiouy](?![aeiouy])|ee|e(?!$|-|[iua])/gmi);
    if (eVowels) {syllables += eVowels.length;} //Applicable vowel count (all but e at end of word)
    if (word.match(/[^aeiou]n['’]t$/i)) {syllables ++;} //ending in n't, but not en't
    if (word.match(/en['’]t$/i)) {syllables --;} //ending in en't
    if (syllables <= 0) {syllables = 1;} //catch-all
    
    return syllables;
}


const WEIRD_WORD_SYLLABLES = {
  abalone: 4,
  abare: 3,
  abbruzzese: 4,
  abed: 2,
  aborigine: 5,
  abruzzese: 4,
  acreage: 3,
  adame: 3,
  adieu: 2,
  adobe: 3,
  anemone: 4,
  anyone: 3,
  apache: 3,
  aphrodite: 4,
  apostrophe: 4,
  ariadne: 4,
  cafe: 2,
  calliope: 4,
  catastrophe: 4,
  chile: 2,
  chloe: 2,
  circe: 2,
  coyote: 3,
  daphne: 2,
  epitome: 4,
  eurydice: 4,
  euterpe: 3,
  every: 2,
  everywhere: 3,
  forever: 3,
  gethsemane: 4,
  guacamole: 4,
  hermione: 4,
  hyperbole: 4,
  jesse: 2,
  jukebox: 2,
  karate: 3,
  machete: 3,
  maybe: 2,
  naive: 2,
  newlywed: 3,
  penelope: 4,
  people: 2,
  persephone: 4,
  phoebe: 2,
  pulse: 1,
  queue: 1,
  recipe: 3,
  riverbed: 3,
  sesame: 3,
  shoreline: 2,
  simile: 3,
  snuffleupagus: 5,
  sometimes: 2,
  syncope: 3,
  tamale: 3,
  waterbed: 3,
  wednesday: 2,
  yosemite: 4,
  zoe: 2
}
