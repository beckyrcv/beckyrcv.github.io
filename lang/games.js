// drag element functions 
// from https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    var top = 0,
        left = 0;

    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        top = top - pos2;
        left = left - pos1;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = top + "px";
        elmnt.style.left = left + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function findImgLocations(selector) {
    var locate_img = document.querySelector(selector);
    locate_img.addEventListener("click", function (e) {
        var bb = locate_img.getBoundingClientRect();
        console.log(e.clientX - bb.left, e.clientY - bb.top);
    });
}

// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/* Event listener for table elements to know if they have been selected */
function toggleClass(a, class_name, event) {
    event.target.classList.toggle(class_name);
}

// see if little div is within big div
function contains(big, little, extra) {
    return ((little.left >= (big.left - extra)) &&
        (little.right <= (big.right + extra)) &&
        (little.top >= (big.top - extra)) &&
        (little.bottom <= (big.bottom + extra)));
}

// see if moved div is within the correct category box
function checkPosition(a, game_div_s, pos_div_s, cat_div_s, change_display, event) {
    var game_div = document.querySelector(game_div_s);
    var position_divs = game_div.querySelectorAll(pos_div_s);
    var bb_found = false;
    for (var j = 0; j < position_divs.length; j++) {
        if (contains(position_divs[j].getBoundingClientRect(), event.target.getBoundingClientRect(), 10) === true) {
            console.log("overlap!");
            if (cat_div_s === "NONE!") {
                var cat_divs = [position_divs[j]];
            } else {
                var cat_divs = position_divs[j].querySelectorAll(cat_div_s);
            }
            var found = false;
            for (var i = 0; i < cat_divs.length; i++) {
                var target_content = cat_divs[i].dataset.source;
                var target_matches = Array.from(event.target.dataset.target.split(","));
                if (target_matches.includes(target_content)) {
                    event.target.style.display = change_display;
                    event.target.classList.add("correct");
                    found = true;
                    bb_found = true;
                }
            }
            if (found == false) {
                event.target.classList.remove("correct");
            }
        }
    }
    if (bb_found == false) {
        event.target.classList.remove("correct");
    }

}

// draw a svg circle with specified fill color
function drawSVGCircle(cx, cy, r, stroke, stroke_width, fill_color, imwidth = null, imheight = null, outline_dash = null) {
    return "<svg style='pointer-events: none;" + (imwidth == null ? "" : "width: " + imwidth + ";") + (imheight == null ? "" : "height: " + imheight + ";") + "'><circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' stroke='" + stroke + "' stroke-width='" + stroke_width + "'" + (outline_dash == null ? "" : "stroke-dasharray='" + outline_dash + "") + "' fill='" + fill_color + "' /></svg>";
}

//find nearest square
var nearest_sq = n => Math.pow(Math.round(Math.sqrt(n)), 2);

function setupPronounDivs(game_html, split_gender) {

    var pronouns = new Array(["मैं", "sp", "तू", "full_sp", "sp", "यह", "वह"], ["हम", "sp", "तुम", "आप", "sp", "ये", "वे"]);
    var genders = new Array("m", "f");
    game_html += "<div class='pronoun_holder'>";
    pronouns.forEach(function (col) {
        game_html += "<div class='pronoun_col'>";
        col.forEach(function (obj) {
            if (obj === "sp") {
                game_html += "<div class='small_row_spacer'></div>";
            } else {
                if (split_gender) {
                    genders.forEach(function (gend) {
                        if (obj === "full_sp") {
                            game_html += "<div class='full_row_spacer'></div>";
                        } else {
                            game_html += "<div class='verb_matching_holder'>";
                            game_html += "<div class='pronoun active' data-source='" + obj + "(" + gend + ")'>" + obj + " (" + gend + "):</div>";
                            game_html += "<div class='verb_matching_target active'></div>";
                            game_html += "</div>";
                        }
                    });

                } else {
                    if (obj === "full_sp") {
                        game_html += "<div class='full_row_spacer'></div>";
                    } else {
                        game_html += "<div class='verb_matching_holder'>";
                        game_html += "<div class='pronoun active' data-source='" + obj + "'>" + obj + ":</div>";
                        game_html += "<div class='verb_matching_target active'></div>";
                        game_html += "</div>";
                    }
                }
            }
        });
        game_html += "</div>";
    });
    return game_html;
}

//measure width of text
function getTextDimensions(input_ele) {
    var font = getFontSize(input_ele) + " " + getFont(getLanguage(input_ele));
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(input_ele.textContent);
    var width = metrics.width;
    var height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    return [width, height];
}

function getLanguage(input_ele) {
    var hex = (input_ele.textContent).charCodeAt(0).toString(16);
    var result = "0000".substring(0, 4 - hex.length) + hex;
    var unc_num = parseInt("0x" + result, 16);
    //       hindi unicode raneg U+0900-097F, U+A8E0-A8FB, U+A830-A839;
    if (((unc_num > parseInt("0x" + "0900", 16)) && (unc_num < parseInt("0x" + "097F", 16))) ||
        ((unc_num > parseInt("0x" + "A8E0", 16)) && (unc_num < parseInt("0x" + "A8FB", 16))) ||
        ((unc_num > parseInt("0x" + "A830", 16)) && (unc_num < parseInt("0x" + "A839", 16)))) {
        return "hindi";
    } else {
        return "english";
    }
}

function getFont(language) {
    if (language === "hindi") {
        return "Annapurna";
    } else {
        return "Optima";
    }
}

function getFontSize(input_ele) {
    return window.getComputedStyle(input_ele).getPropertyValue("font-size");
}

function findCardWidthAndHeight(selector, width_extra, height_extra, flip_cat) {
    var max_width = 0;
    var max_height = 0;
    var game_divs = $(selector);
    for (var jj = 0; jj < game_divs.length; jj++) {
        var out = getTextDimensions(game_divs[jj]);
        max_width = (out[0] > max_width ? out[0] : max_width);
        max_height = (out[1] > max_height ? out[1] : max_height);
    }
    return [max_width + width_extra + "px", max_height + height_extra + "px"];
}

function addMatchingListeners(game_holder, num, game_setup_record, matching_divs) {
    var game_id = "game" + num;

    var game_div = document.querySelector("#" + game_id);

    var tds = game_div.querySelectorAll("div.game_row div");
    for (var i = 0; i < tds.length; i++) {
        if (DOMPurify.sanitize(tds[i].innerHTML) != "") {
            tds[i].addEventListener("click", toggleClass.bind(null, event, "match_selected"));
        }
    }

    game_div.addEventListener("click", function () {
        var sel_tds = game_div.querySelectorAll("#" + game_id + " div.match_selected");
        if ((sel_tds.length) == 2) {

            if (sel_tds[0].dataset.source === sel_tds[1].dataset.target) {
                sel_tds[0].innerHTML = "";
                sel_tds[1].innerHTML = "";
                sel_tds[0].classList.remove("match_selected");
                sel_tds[1].classList.remove("match_selected");
                sel_tds[0].removeEventListener("click", toggleClass.bind(null, event, "match_selected"));
                sel_tds[1].removeEventListener("click", toggleClass.bind(null, event, "match_selected"));
                sel_tds[0].classList.remove("active");
                sel_tds[1].classList.remove("active");
                sel_tds[0].classList.add("matching_spacer");
                sel_tds[1].classList.add("matching_spacer");
                sel_tds[0].classList.add("correct");
                sel_tds[1].classList.add("correct");
            } else {
                sel_tds[0].classList.remove("match_selected");
                sel_tds[1].classList.remove("match_selected");
            }
        }
        var empty_tds = game_div.querySelectorAll("#" + game_id + " div.correct");
        if (empty_tds.length == matching_divs) {
            game_holder.innerHTML = game_setup_record;
            setupGame(game_holder, num, parseGameString(game_holder));
        }
    });
}

function addCatagorizingListeners(game_holder, num, game_setup_record) {
    var game_id = "game" + num;
    var game_table = document.querySelector("#" + game_id + " div.matching_table");
    var tds = game_table.querySelectorAll("div");
    var drag = false;
    for (var i = 0; i < tds.length; i++) {
        dragElement(tds[i]);

        tds[i].addEventListener("mouseup", checkPosition.bind(null, event, "#" + game_id, "div.categories_table div", "NONE!", "none"));
        if (game_holder.getAttribute("data-flip")) {
            tds[i].addEventListener("mouseup", function () {
                if (drag == false) {
                    var ele = event.target;
                    var flip_cat = game_holder.getAttribute("data-flip");
                    if (DOMPurify.sanitize(ele.innerHTML) === ele.getAttribute("data-" + flip_cat)) {
                        ele.innerHTML = ele.getAttribute("data-source");
                    } else {
                        ele.innerHTML = ele.getAttribute("data-" + flip_cat);
                    }
                }
            });
        }
        tds[i].addEventListener("mousedown", function () {
            drag = false;
        });
        tds[i].addEventListener("mousemove", function () {
            drag = true;
        });
    }

    game_table.addEventListener("mouseup", function () {
        var tds = game_table.querySelectorAll("div");
        var empty_tds = game_table.querySelectorAll("#" + game_id + " div.correct");
        if (empty_tds.length == tds.length) {
            game_holder.innerHTML = game_setup_record;
            setupGame(game_holder, num, parseGameString(game_holder));
        }
    });
}


function addVerbMatchingListeners(game_holder, num, game_setup_record) {
    var game_id = "game" + num;
    var game_div = document.querySelector("#" + game_id);
    var tds = game_div.querySelectorAll("div.verb_matching.active");

    var drag = false;
    for (var i = 0; i < tds.length; i++) {
        dragElement(tds[i]);
        tds[i].addEventListener("mouseup", checkPosition.bind(null, event, "#" + game_id, "div.pronoun_holder div.verb_matching_holder", "div.pronoun", "block"));
        tds[i].addEventListener("mousedown", function () {
            drag = false;
        });
        tds[i].addEventListener("mousemove", function () {
            drag = true;
        });
    }

    game_div.addEventListener("mouseup", function () {
        var game_div = document.querySelector("#" + game_id);
        var tds = game_div.querySelectorAll("div.verb_matching.active");
        var empty_tds = document.querySelectorAll("#" + game_id + " div.correct");
        if (empty_tds.length == tds.length) {
            game_holder.innerHTML = game_setup_record;
            setupGame(game_holder, num, parseGameString(game_holder));
        }
    });
}

function addLocationMatchingListeners(game_holder, num, game_setup_record) {

    console.log("loc matching listeners called");
    var game_id = "game" + num;
    var game_div = document.querySelector("#" + game_id);
    var tds = game_div.querySelectorAll("div.locate.active");

    var drag = false;
    for (var i = 0; i < tds.length; i++) {
        dragElement(tds[i]);
        tds[i].addEventListener("mouseup", checkPosition.bind(null, event, "#" + game_id, "circle", "div.circle_holder", "block"));

        tds[i].addEventListener("mousedown", function (e) {
            drag = false;
            console.log(e.clientX, e.clientY, e.target.top, e.target.left);
        });
        tds[i].addEventListener("mousemove", function () {
            drag = true;
        });
    }

    //    game_div.addEventListener("mouseup", function () {
    //        var game_div = document.querySelector("#" + game_id);
    //        var tds = game_div.querySelectorAll("div.verb_matching.active");
    //        var empty_tds = document.querySelectorAll("#" + game_id + " div.correct");
    //        if (empty_tds.length == tds.length) {
    //            console.log("location game reset");
    //            game_holder.innerHTML = game_setup_record;
    //            setupGame(game_holder, num, parseGameString(game_holder));
    //        }
    //    });
}

//https://stackoverflow.com/questions/3680429/click-through-div-to-underlying-elements

function setupGame(game_holder, num, input) {
    var game_html;
    var game_id = "game" + num;
    shuffleArray(input);
    var source_cat = game_holder.dataset.source;
    var target_cat = game_holder.dataset.target;

    if (game_holder.classList.contains("catagorize")) {

        var categories = new Set();

        game_html = "<div id='" + game_id + "' class='catagorizing_game game_holder_div'>" + "<div class='matching_table'>";

        input.forEach(function (obj) {
            game_html += "<div class='catagorize active' data-target='" + obj[target_cat] + "'";
            game_html += "data-source='" + obj[source_cat] + "'";
            Object.keys(obj).forEach(function (key) {
                game_html += "data-" + key + "='" + obj[key] + "'";
            });

            game_html += ">" + obj[source_cat] + "</div>";
            categories.add(obj[target_cat]);
        });

        game_html += "</div><div class='spacer'></div>";
        game_html += "<div class='categories_table' id='mydiv'>";

        categories.forEach(function (match_cat) {
            game_html += "<div class='active' data-source='" + match_cat + "'>" + match_cat + "</div>";
        });


    } else if (game_holder.classList.contains("matching")) {

        var side1 = [game_holder.dataset.match.split("-")[0]];
        var side2 = [game_holder.dataset.match.split("-")[1]];
        var sides = [side1, side2];
        if (game_holder.getAttribute("data-display_extra")) {
            if (game_holder.dataset.display_extra.split("-")[0] === side1[0]) {
                side1.push(game_holder.dataset.display_extra.split("-")[1]);
            } else if (game_holder.dataset.display_extra.split("-")[0] === side2[0]) {
                side2.push(game_holder.dataset.display_extra.split("-")[1]);
            }
        }

        var num_matching_divs = input.length * 2;
        var square_size = nearest_sq(num_matching_divs);

        game_html = "<div id='" + game_id + "'  class='matching_game game_holder_div'>";
        var content = Array.from({
            length: square_size - (num_matching_divs)
        }, () => "<div class='matching_spacer'></div>");

        input.forEach(function (obj) {
            var match_div;
            for (var j = 0; j < sides.length; j++) {
                match_div = "data-target='" + obj[sides[j == 0 ? 1 : 0][0]] + "'";
                match_div += " data-source='" + obj[sides[j][0]] + "'>";
                for (var i = 0; i < sides[j].length; i++) {
                    match_div += obj[sides[j][i]];
                }
                content.push("<div class='matching active' " + match_div + "</div>");
            }
        });
        shuffleArray(content);

        var row_index = Math.sqrt(square_size);
        game_html += "<div class='game_row'>";
        for (var j = 0; j < content.length; j++) {
            game_html += content[j];
            if ((j + 1) % row_index == 0) {
                game_html += "</div><div class='game_row'>";
            }
        }
        game_html += "</div></div>";

    } else if (game_holder.classList.contains("verb_matching")) {

        game_html = "<p>Verb: <b>" + game_holder.dataset.verb + "</b>, tense: " + game_holder.dataset.tense + "</p>";
        game_html += "<div id='" + game_id + "'  class='verb_matching_game game_holder_div'>";

        game_html = setupPronounDivs(game_html, game_holder.dataset.gender);

        game_html += "</div>";
        game_html += "<div class='spacer'></div>";

        var target_map = new Map();

        input.forEach(function (obj) {
            if (target_map.has(obj[source_cat])) {
                var temp = target_map.get(obj[source_cat]);
                temp.push(obj[target_cat]);
                target_map.set(obj[source_cat], temp);
            } else {
                target_map.set(obj[source_cat], [obj[target_cat]]);
            }
        });

        input.forEach(function (obj) {
            game_html += "<div class='verb_matching active' data-target='" + target_map.get(obj[source_cat]) + "'";
            game_html += "data-source='" + obj[source_cat] + "'";
            game_html += ">" + obj[source_cat] + "</div>";
        });

        game_html += "</div>";
    } else if (game_holder.classList.contains("location_matching")) {
        game_html = "<div id='" + game_id + "'  class='location_matching_game game_holder_div'>";
        game_html += "<img src='" + game_holder.dataset.backgroundImg + "' alt='a table' style='width:" + game_holder.dataset.imgwidth + ";height:" + game_holder.dataset.imgheight + ";'>";

        var locations = new Set();
        input.forEach(function (obj) {
            locations.add(obj[target_cat]);
        });
        locations.forEach(function (location) {
            game_html += drawSVGCircle(location.split(",")[0], location.split(",")[1], 10, "black", 1, "lightskyblue", game_holder.dataset.imgwidth, game_holder.dataset.imgheight, 1);
        });

        game_html += "<div class='spacer'></div>";
        input.forEach(function (obj) {
            game_html += "<div class='locate active' data-target='" + obj[target_cat] + "'";
            game_html += "data-source='" + obj[source_cat] + "'";
            game_html += ">" + obj[source_cat] + "</div>";
        });
        game_html += "</div>";

    } else if (game_holder.classList.contains("typing")) {
        game_html = "<div id='" + game_id + "'  class='typing_matching_game game_holder_div'>";
        game_html += "</div>";
    }
    var game_setup_record = DOMPurify.sanitize(game_holder.innerHTML);
    game_holder.innerHTML = game_html;
    //    findImgLocations("div.location_matching_game img");
    //
    var width_height = findCardWidthAndHeight("#" + game_id + " div.game_row div", 25, 0);

    document.querySelectorAll("#" + game_id + " div.game_row div").forEach(function (match_div) {
        match_div.style.width = width_height[0];
        match_div.style.height = width_height[1];
    });

    if (game_holder.classList.contains("catagorize")) {
        addCatagorizingListeners(game_holder, num, game_setup_record);
    } else if (game_holder.classList.contains("matching")) {
        addMatchingListeners(game_holder, num, game_setup_record, num_matching_divs);
    } else if (game_holder.classList.contains("verb_matching")) {
        addVerbMatchingListeners(game_holder, num, game_setup_record);
    } else if (game_holder.classList.contains("location_matching")) {
        addLocationMatchingListeners(game_holder, num, game_setup_record);
    } else if (game_holder.classList.contains("typing")) {
        addTypingListeners(game_holder, num, game_setup_record);
    }
}

function addTypingListeners(game_holder, num, game_setup_record) {

    console.log("typing matching listeners called");
    var game_id = "game" + num;
    var game_div = document.querySelector("#" + game_id);
    var source_cat = game_holder.dataset.source;
    var target_cat = game_holder.dataset.target;
    var input = JSON.parse(game_setup_record);
    console.log(input);

    var game_html = "<div class='typing'><b>" + input[0][source_cat] + "</b> " + input[0][target_cat] + ":&nbsp;</div>";
    game_html += "<form id='" + game_id + "_form' ><input type='text' id='" + game_id + "_input' required maxlength='20'><input type='submit' style='display:none;'/></form>";
    game_html += "<div id='" + game_id + "_feedback' class='typing_feedback'></div>";
    game_div.innerHTML = game_html;
    addTypingFormListeners(game_id, input, input[0][source_cat], input[0][target_cat]);
}

function addTypingFormListeners(game_id, input, source_cat, target_cat) {
    const form = document.getElementById(game_id + "_form");
    const text_input = document.getElementById(game_id + "_input");
    const log = document.getElementById(game_id + "_feedback");

    console.log(findForm(source_cat, target_cat));

    function typingFormSubmit(event) {
        var temp_value = DOMPurify.sanitize(text_input.value);
        var text_answer = (temp_value === "ddd" ? "correct" : "incorrect");
        log.textContent = " " + temp_value + " is " + text_answer;
        event.preventDefault();
    }
    form.addEventListener('submit', typingFormSubmit);
}

function findForm(hindi_word, target_form, target_match) {
    hindi_word = "होना"
    target_form = "perfect"
    target_match = "1 sing f"
}

function conjugateHona(target_form, target_match) {
    var forms = '{"present":  {}}'

}

function buildGame() {
    var game_holders = document.getElementsByClassName("game");
    for (var i = 0; i < game_holders.length; i++) {
        setupGame(game_holders[i], i, parseGameString(game_holders[i]));
    }
}

function parse() {
    var verb_div = document.getElementsByClassName("parse");
    parse_me(verb_div[0]);
}


function parseGameString(game_holder) {

    var game_items = JSON.parse(DOMPurify.sanitize(game_holder.innerHTML), function (key, value) {
        if (key === "color") {
            var color_text;
            if (value.length === 3) {
                color_text = drawSVGCircle(15, 5, 5, "gray", 0.25, value[0]);
                color_text += drawSVGCircle(9, 15, 5, "gray", 0.25, value[1]);
                color_text += drawSVGCircle(21, 15, 5, "gray", 0.25, value[2]);
                value = color_text;
            } else {
                color_text = drawSVGCircle(15, 10, 8, "gray", 1, value);
                value = " " + color_text;
            }
        }
        return value;
    });
    return game_items;
}
