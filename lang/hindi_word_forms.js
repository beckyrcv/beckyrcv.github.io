function parseMee() {
    var verb = document.getElementById("verb_choice").value;
    var tense = document.getElementById("tense_choice").value;
    var verb_out = document.getElementById("verb_choice_out");
    var pronoun_holders = document.getElementsByClassName("pronoun_holder");
    var person, number;
    var distance = "";
    var formality = "";
    var gender = "";
    var negative = "false";
    for (j = 0; j < pronoun_holders.length; j++) {
        var text_holders = pronoun_holders[j].getElementsByTagName("div");
        var parse_holders = pronoun_holders[j].getElementsByClassName("parseme");
        var gender_holders = pronoun_holders[j].getElementsByClassName("gender_marker");
        gender_holders[0].style.display = "inline-block";
        gender_holders[1].style.display = "inline-block";
        parse_holders[1].style.display = "inline-block";

        for (i = 0; i < text_holders.length; i++) {
            if (text_holders[i].classList.contains("parseme")) {
                person = text_holders[i].dataset.person;
                number = text_holders[i].dataset.number;
                distance = text_holders[i].dataset.distance;
                formality = text_holders[i].dataset.formality;
                gender = text_holders[i].dataset.gender;
                text_holders[i].textContent = returnForm({
                    word: verb,
                    type: "verb",
                    tense: tense,
                    person: person,
                    number: number,
                    distance: distance,
                    formality: formality,
                    gender: gender,
                    negative: negative
                });
                text_holders[i].classList.add("text_updated");
                setTimeout(function () {
                    var text_holders = document.getElementById("verb_choice_out").getElementsByTagName("div");
                    for (i = 0; i < text_holders.length; i++) {
                        text_holders[i].classList.remove("text_updated");
                    }
                }, 600);
            }
        }
        if (parse_holders[0].innerHTML === parse_holders[1].innerHTML) {
            gender_holders[0].style.display = "none";
            gender_holders[1].style.display = "none";
            parse_holders[1].style.display = "none";
        }
    }
    return false;
}
//
//function linkSelectors() {
//    var verb = document.getElementById("verb_choice").value;
//    var tense = document.getElementById("tense_choice");
//    var tense_options = tense.getElementsByTagName("option");
//    tense.innerHTML = "";
//    
//    for (var i = 0; i < tense_options.length; i++) {
//        if (verb === "होना") {
//            tense.appendChild(tense_options[i]);
//        }
//    }
//}
//linkSelectors();

//function parse_me(word_div) {
//    word_div.style.fontSize = "40px";
//    word_div.style.padding = "40px";
//    var input = JSON.parse(word_div.innerHTML);
//    var word = input.word;
//    var type = input.type;
//    var text = "<p>parsing!!!" + word + type + "<p>";
//    var output;
//    if (type === "verb") {
//        output = returnAllVerbForms({
//            "word": word,
//            "tense": "present habitual"
//        });
//    } else {
//        output = returnForm(input);
//    }
//
//    word_div.innerHTML = output;
//}

var vowels_matras = new Map();
var matras_vowels = new Map();
vowels_matras.set("अ", "");

vowels_matras.set("आ", "ा");
matras_vowels.set("ा", "आ");

vowels_matras.set("इ", "ि");
matras_vowels.set("ि", "इ");

vowels_matras.set("ई", "ी");
matras_vowels.set("ी", "ई");

vowels_matras.set("उ", "ु");
matras_vowels.set("ु", "उ");

vowels_matras.set("ऊ", "ू");
matras_vowels.set("ू", "ऊ");

vowels_matras.set("ऋ", "ृ");
matras_vowels.set("ृ", "ऋ");

vowels_matras.set("ए", "े");
matras_vowels.set("े", "ए");

vowels_matras.set("ऐ", "ै");
matras_vowels.set("ै", "ऐ");

vowels_matras.set("ओ", "ो");
matras_vowels.set("ो", "ओ");

vowels_matras.set("औ", "ौ");
matras_vowels.set("ौ", "औ");

function addVowelSuffix(word, suffix) {
    var last_letter = word.charAt(word.length - 1);
    var suffix_vowel = suffix.charAt(0);
    var suffix_end = suffix.slice(1);

    if (matras_vowels.has(last_letter)) {
        return word + suffix;
    } else if (vowels_matras.has(last_letter)) {
        return word + suffix;
    } else {
        return word + vowels_matras.get(suffix_vowel) + suffix_end;
    }
}

function lastLetter(word) {
    return word.charAt(word.length - 1);
}

function addYah(word) {
    return word + "य";
}

function shortenStemVowel(word) {
    var last_letter = lastLetter(word);
    if (last_letter === "ू") {
        return word.slice(0, -1) + "ु";
    } else if (last_letter === "ी") {
        return word.slice(0, -1) + "ि";
    }
}

function returnForm({
    word = "N/A",
    type,
    person = "1st",
    number = "singular",
    gender = "masculine",
    form = "normal",
    tense = "present habitual",
    formality = "formal",
    distance = "near",
    negative = "false"
}) {
    //    console.log("args!!", word, type, person, number, gender, form, tense, formality, distance, negative);

    if (type === "verb") {
        if (word === "होना") {
            if (tense === "present habitual") {
                tense = "simple present";
            }

            return conjugateHona(person, number, gender, tense, formality, distance, negative);

        } else {

            return conjugateVerb(word, person, number, gender, tense, formality, distance, negative);
        }

    } else if (type === "pronoun") {
        return declinePronoun(person, number, gender, form, formality, distance);

    } else if (type === "noun") {
        return "noun form!!";

    } else if (type === "adjective") {
        return "adjective form!!";
    }
}

function conjugateHona(person, number, gender, tense, formality, distance, negative) {
    //    console.log("hona args!!", person, number, gender, tense, formality, distance, negative);
    if (tense === "simple present") {
        // chapter 4 page 38
        if (number === "singular") {
            if (person === "1st") {
                return "हूँ";
            } else {
                return "है";
            }
        } else if (number === "plural") {
            if (formality === "familiar") {
                return "हो";
            } else {
                return "हैं";
            }
        }
    } else if (tense === "simple past") {
        // chapter 16 page 134
        if (number === "singular") {
            if (gender === "masculine") {
                return "था";
            } else {
                return "थी";
            }
        } else if (number === "plural") {
            if (gender === "masculine") {
                return "थे";
            } else {
                return "थीं";
            }
        }
    }
}

function conjugateVerb(word, person, number, gender, tense, formality, distance, negative) {
    console.log("verb args!!", word, person, number, gender, tense, formality, distance, negative);
    var verb_stem = word.replace("ना", "");
    var negative_addition = "";
    var hona_form = " ";

    if (tense === "present habitual") {
        // chapter 9 page 82
        hona_form += conjugateHona(person, number, gender, "simple present", formality, distance);
        if (negative === "true") {
            negative_addition = "नहीं ";
            hona_form = "";
        }
        if (gender === "masculine") {
            if (number === "singular") {
                return negative_addition + verb_stem + "ता " + hona_form;
            } else {
                return negative_addition + verb_stem + "ते " + hona_form;
            }
        } else {
            return negative_addition + verb_stem + "ती " + hona_form;
        }

    } else if (tense === "imperative") {
        // chapter 5 page 52
        //        console.log("imperative verb! args!!", word, person, number, gender, tense, formality, distance, negative);

        if (person === "2nd") {
            var irregular_formal = new Map();
            irregular_formal.set("लेना", "लीजिये");
            irregular_formal.set("देना", "दीजिये");
            irregular_formal.set("करना", "कीजिये");
            irregular_formal.set("पीना", "पीजिये");

            var irregular_familiar = new Map();
            irregular_familiar.set("लेना", "लो");
            irregular_familiar.set("देना", "दो");

            var formal_addition = "";
            if (formality === "very formal") {
                formal_addition = "गा";
            }
            if (negative === "true") {
                if ((formality === "familiar") || (formality === "intimate")) {
                    negative_addition = "मत ";
                } else {
                    negative_addition = "न ";
                }
            }
            if (formality === "neutral") {
                return negative_addition + word;
            } else if (formality === "intimate") {
                return negative_addition + verb_stem;
            } else if (formality === "formal") {
                if (irregular_formal.has(word)) {
                    return negative_addition + irregular_formal.get(word) + formal_addition;
                } else if (lastLetter(verb_stem) === "ू") {
                    return negative_addition + addVowelSuffix(shortenStemVowel(verb_stem), "इये") + formal_addition;
                } else {
                    return negative_addition + addVowelSuffix(verb_stem, "इये") + formal_addition;
                }
            } else if (formality === "familiar") {
                if (irregular_familiar.has(word)) {
                    return negative_addition + irregular_familiar.get(word);
                } else if ((lastLetter(verb_stem) === "ू") || (lastLetter(verb_stem) === "ी")) {
                    return negative_addition + addVowelSuffix(shortenStemVowel(verb_stem), "ओ");
                } else {
                    return negative_addition + addVowelSuffix(verb_stem, "ओ");
                }
            }
        }

    } else if (tense === "present progressive") {
        // chapter 12 page 105
        hona_form += conjugateHona(person, number, gender, "simple present", formality, distance);
        if (negative === "true") {
            negative_addition = "नहीं ";
        }
        if (gender === "masculine") {
            if (number === "singular") {
                return negative_addition + verb_stem + " रहा" + hona_form;
            } else {
                return negative_addition + verb_stem + " रहे" + hona_form;
            }
        } else {
            return negative_addition + verb_stem + " रही" + hona_form;
        }
    } else if (tense === "past habitual") {
        // chapter 17 page 138
        hona_form += conjugateHona(person, number, gender, "simple past", formality, distance);
        if (negative === "true") {
            negative_addition = "नहीं ";
        }
        if (gender === "masculine") {
            if (number === "singular") {
                return negative_addition + verb_stem + "ता " + hona_form;
            } else {
                return negative_addition + verb_stem + "ते " + hona_form;
            }
        } else {
            return negative_addition + verb_stem + "ती " + hona_form;
        }
    } else if (tense === "past progressive") {
        // chapter 18 page 142
        hona_form += conjugateHona(person, number, gender, "simple past", formality, distance);
        if (negative === "true") {
            negative_addition = "नहीं ";
        }
        if (gender === "masculine") {
            if (number === "singular") {
                return negative_addition + verb_stem + " रहा" + hona_form;
            } else {
                return negative_addition + verb_stem + " रहे" + hona_form;
            }
        } else {
            return negative_addition + verb_stem + " रही" + hona_form;
        }
    } else if (tense === "future") {
        // chapter 21 page 157
        // TODO finish this

        var irregular_future_stem = new Map();
        irregular_future_stem.set("लेना", "ल");
        irregular_future_stem.set("देना", "द");
        irregular_future_stem.set("होना", "ह");
        if (irregular_future_stem.has(word)) {
            verb_stem = irregular_future_stem.get(word);
        }
        if (negative === "true") {
            negative_addition = "नहीं ";
        }
        var future_suffixes = "";

        if (number === "singular") {
            if (person === "1st") {
                future_suffixes += "ऊँ";
            } else {
                future_suffixes += "ए";
            }
        } else {
            if ((person === "2nd") && (formality === "familiar")) {
                future_suffixes += "ओ";
            } else {
                future_suffixes += "एँ";
            }
        }
        if (gender === "masculine") {
            if (number === "singular") {
                future_suffixes += "गा";
            } else {
                future_suffixes += "गे";
            }
        } else {
            future_suffixes += "गी";
        }
        if ((lastLetter(verb_stem) === "ू") || (lastLetter(verb_stem) === "ी")) {
            return negative_addition + addVowelSuffix(shortenStemVowel(verb_stem), future_suffixes);
        } else {
            return negative_addition + addVowelSuffix(verb_stem, future_suffixes);
        }

    } else if (tense === "perfect") {
        // chapter 23 page 170
        var irregular_perfect_stem = new Map();
        irregular_future_stem.set("जाना", "ग");
        irregular_future_stem.set("होना", "हु");
        irregular_future_stem.set("लेना", "लि");
        irregular_future_stem.set("देना", "दि");
        irregular_future_stem.set("करना", "कि");
        if (irregular_future_stem.has(word)) {
            verb_stem = irregular_future_stem.get(word);
        }

        if (number === "singular") {
            if (gender === "masculine") {
                if (irregular_future_stem.has(word)) {
                    if (!(word === "होना")) {
                        return addVowelSuffix(addYah(verb_stem), "आ");
                    } else {
                        return addVowelSuffix(verb_stem, "आ");
                    }
                } else if (lastLetter(verb_stem) === "ू") {
                    return addVowelSuffix(shortenStemVowel(verb_stem), "आ");
                } else if (lastLetter(verb_stem) === "ी") {
                    return addVowelSuffix(addYah(shortenStemVowel(verb_stem)), "आ");
                } else if ((lastLetter(verb_stem) === "ा") || (lastLetter(verb_stem) === "े") || (lastLetter(verb_stem) === "ो") || (lastLetter(verb_stem) === "̇आ") || (lastLetter(verb_stem) === "ए") || (lastLetter(verb_stem) === "ओ")) {
                    return addVowelSuffix(addYah(verb_stem), "आ");
                } else {
                    return addVowelSuffix(verb_stem, "आ");
                }
            } else {
                if (lastLetter(verb_stem) === "ू") {
                    return addVowelSuffix(shortenStemVowel(verb_stem), "ई");
                } else if (lastLetter(verb_stem) === "ी") {
                    return verb_stem;
                } else {
                    return addVowelSuffix(verb_stem, "ई");
                }
            }
        } else {
            if (gender === "masculine") {
                if (irregular_future_stem.has(word)) {
                    if (!(word === "होना")) {
                        return addVowelSuffix(addYah(verb_stem), "ए");
                    } else {
                        return addVowelSuffix(verb_stem, "ए");
                    }
                } else if (lastLetter(verb_stem) === "ू") {
                    return addVowelSuffix(shortenStemVowel(verb_stem), "ए");
                } else if (lastLetter(verb_stem) === "ी") {
                    return addVowelSuffix(addYah(shortenStemVowel(verb_stem)), "ए");
                } else if ((lastLetter(verb_stem) === "ा") || (lastLetter(verb_stem) === "े") || (lastLetter(verb_stem) === "ो") || (lastLetter(verb_stem) === "̇आ") || (lastLetter(verb_stem) === "ए") || (lastLetter(verb_stem) === "ओ")) {
                    return addVowelSuffix(addYah(verb_stem), "ए");
                } else {
                    return addVowelSuffix(verb_stem, "ए");
                }
            } else {
                if (lastLetter(verb_stem) === "ू") {
                    return addVowelSuffix(shortenStemVowel(verb_stem), "ईं");
                } else if (lastLetter(verb_stem) === "ी") {
                    return verb_stem + "ं";
                } else {
                    return addVowelSuffix(verb_stem, "ईं");
                }
            }
        }
    }
}

function declinePronoun(person, number, gender, form, formality, distance) {
    console.log("pronoun args!!", person, number, gender, form, formality, distance);
    if (form === "normal") {
        // page 38
        if (number === "singular") {
            if (person === "1st") {
                return "मैं";
            } else if (person === "2nd") {
                return "तू";
            } else if (person === "3rd") {
                if (distance === "near") {
                    return "यह";
                } else if (distance === "far") {
                    return "वह";
                }
            }

        } else if (number === "plural") {
            if (person === "1st") {
                return "हम";
            } else if (person === "2nd") {
                if (formality === "formal") {
                    return "आप";
                } else if (formality === "familiar") {
                    return "तुम";
                }
            } else if (person === "3rd") {
                if (distance === "near") {
                    return "ये";
                } else if (distance === "far") {
                    return "वे";
                }
            }
        }
    } else if (form === "oblique") {
        // page 92 and 123
    }
}

function declineNoun(word, person, number, gender, form) {
    console.log("noun args!!", word, person, number, gender, form);

}

function declineAdjective(word, person, number, gender, form) {
    console.log("adjective args!!", word, person, number, gender, form);

}
