function parse_me(verb_div) {
    verb_div.style.fontSize = "40px";
    verb_div.style.padding = "40px";
    word = 'होना';
    type = "verb";
    var text = "<p>parsing!!!" + word + type + "<p>";
    verb_div.innerHTML = text;
}

function parseVerbWrapper(word, type, person = "1st", number = "singular", gender = "masculine", form = "normal", tense = "present habitual") {

}

function parseOtherWrapper(word, type, person = "1st", number = "singular", gender = "masculine", form = "normal", tense = "N/A") {

}

function returnForm(word, type, person, number, gender, form, tense) {
    console.log("returning form!!");
    if (type === "verb") {
        console.log("verb form!!", word, type, tense);
        //        return conjugateVerb(word, word_out_format);

    } else if (type === "pronoun") {
        console.log("pronoun form!!", word, type, person, number, gender);
        //        return declinePronoun(word, word_out_format);

    } else if (type === "noun") {
        console.log("noun form!!");
        //        return declineNoun(word, word_out_format);

    } else if (type === "adjective") {
        console.log("adjective form!!");
        //        return declineAdjective(word, word_out_format)
    }
}

function conjugateVerb(word, word_out_format) {

}

function declinePronoun(word, word_out_format) {

}

function declineNoun(word, word_out_format) {

}

function declineAdjective(word, word_out_format) {

}
