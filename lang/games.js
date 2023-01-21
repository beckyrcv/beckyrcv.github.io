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

/* Event listener for table elements to know if they have been selected */
function toggleClass(a, class_name, event) {
    event.target.classList.toggle(class_name);
}

function contains(big, little) {
    return ((little.left >= big.left) &&
        (little.right <= big.right) &&
        (little.top >= big.top) &&
        (little.bottom <= big.bottom));
}

function checkPosition(a, cat_div, event) {
    var categories = document.getElementsByClassName(cat_div);
    for (var j = 0; j < categories.length; j++) {
        var cat_divs = categories[j].querySelectorAll("div");
        for (var i = 0; i < cat_divs.length; i++) {
            if (contains(cat_divs[i].getBoundingClientRect(), event.target.getBoundingClientRect()) === true) {
                if (cat_divs[i].innerHTML === event.target.dataset.target) {
                    event.target.style.display = "none";
                }
            }
        }
    }
}

function drawSVGCircle(cx, cy, r, stroke, stroke_width, fill_color) {
    return "<svg style='pointer-events: none;'><circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' stroke='" + stroke + "' stroke-width='" + stroke_width + "' fill='#" + fill_color + "' /></svg>";
}

//find nearest square
var nearest_sq = n => Math.pow(Math.round(Math.sqrt(n)), 2);

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

function setCardWidthAndHeight(selector, width_property, height_property, width_extra, height_extra) {
    var max_width = 0;
    var max_height = 0;
    var game_divs = $(selector);
    for (var jj = 0; jj < game_divs.length; jj++) {
        var out = getTextDimensions(game_divs[jj]);
        max_width = (out[0] > max_width ? out[0] : max_width);
        max_height = (out[1] > max_height ? out[1] : max_height);
    }
    document.documentElement.style.setProperty(width_property, max_width + width_extra + "px");
    document.documentElement.style.setProperty(height_property, max_height + height_extra + "px");
}

function addMatchingListeners(match_map, rev_match_map, game_holder, game_setup_record) {
    var index_size = nearest_sq(match_map.size * 2);

    var table = document.querySelector("div.matching_game");

    var tds = table.querySelectorAll("div");
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].innerHTML != "") {
            tds[i].addEventListener("click", toggleClass.bind(null, event, "match_selected"));
        }
    }

    table.addEventListener("click", function () {
        var sel_tds = table.querySelectorAll("div.match_selected");
        if ((sel_tds.length) == 2) {
            if (((match_map.get(sel_tds[0].textContent) == undefined ? "" : match_map.get(sel_tds[0].textContent)[0]) ==
                    sel_tds[1].textContent) ||
                ((rev_match_map.get(sel_tds[0].textContent) == undefined ? "" : rev_match_map.get(sel_tds[0].textContent)[0]) ==
                    sel_tds[1].textContent)) {
                sel_tds[0].innerHTML = "";
                sel_tds[1].innerHTML = "";
                sel_tds[0].classList.remove("match_selected");
                sel_tds[1].classList.remove("match_selected");
                sel_tds[0].removeEventListener("click", toggleClass.bind(null, event, "match_selected"));
                sel_tds[1].removeEventListener("click", toggleClass.bind(null, event, "match_selected"));
                sel_tds[0].classList.remove("active");
                sel_tds[1].classList.remove("active");
            } else {
                sel_tds[0].classList.remove("match_selected");
                sel_tds[1].classList.remove("match_selected");
            }
        }
        var empty_tds = table.querySelectorAll("div:empty");
        if (empty_tds.length == index_size) {
            game_holder.innerHTML = game_setup_record;
            output = parseGameString(game_holder, "matching");
            setupMatchingGame(game_holder, output);
        }
    });
}

function setupMatchingGame(game_holder, input) {
    var match_map = input[0];
    var rev_match_map = input[1];

    var terms = match_map.size;
    var index_size = nearest_sq(terms * 2);
    var num_row = Math.sqrt(index_size);
    var card_index = Array.from(Array(index_size).keys());
    shuffleArray(card_index);

    var matching_table = "<div class='matching_game'>";
    var content;

    for (var j = 0; j < index_size; j++) {
        if (card_index[j] >= (terms)) {
            content = Array.from(rev_match_map.values())[card_index[j] - terms];
            if (content != undefined) {
                content = content[1];
            }
        } else {
            content = Array.from(match_map.keys())[card_index[j]];
        }
        if (content != null) {
            matching_table += "<div class='active'>" + content + "</div>";
        } else {
            matching_table += "<div></div>"
        }
    }
    matching_table += "</div>"

    var game_setup_record = game_holder.innerHTML;
    game_holder.innerHTML = matching_table;

    setCardWidthAndHeight(".matching_game div", "--matching_max_width", "--matching_height", 22, 0);
    addMatchingListeners(match_map, rev_match_map, game_holder, game_setup_record);
}

function parseGameString(game_holder, game_type) {

    var game_items = game_holder.innerHTML.trim().split(",");
    var match_map = new Map();

    if (game_type === "matching") {
        var rev_match_map = new Map();
    } else if (game_type === "catagorize") {
        var categories = new Set();
    }

    for (var ii = 0; ii < game_items.length; ii++) {
        var match_content1 = game_items[ii].split("/")[0].split("-")[0];
        var match_content_extra1 = game_items[ii].split("/")[0].split("-")[1];
        var match_content2 = game_items[ii].split("/")[1].split("-")[0];
        var match_content_extra2 = game_items[ii].split("/")[1].split("-")[1];

        if (game_type === "matching") {
            if (game_holder.classList.contains("color")) {
                var match_content_color = match_content2;
                var colors = match_content_extra2.split("#");
                if (colors.length == 2) {
                    match_content_color += drawSVGCircle(15, 10, 8, "gray", 1, colors[1]);
                } else {
                    match_content_color += drawSVGCircle(15, 5, 5, "gray", 0.25, colors[1]);
                    match_content_color += drawSVGCircle(9, 15, 5, "gray", 0.25, colors[2]);
                    match_content_color += drawSVGCircle(21, 15, 5, "gray", 0.25, colors[3]);
                }
            }
            match_map.set(match_content1, [match_content2, match_content_color]);
            rev_match_map.set(match_content2, [match_content1, match_content_color]);

        } else if (game_type === "catagorize") {
            match_map.set(match_content1, [match_content2, match_content_extra2]);
            categories.add(match_content2);

        }
    }

    if (game_type === "matching") {
        return [match_map, rev_match_map];
    } else if (game_type === "catagorize") {
        return [match_map, categories];
    }
}

function setupCatagorizingGame(game_holder, input) {
    var match_map = input[0];
    var categories = input[1];

    var game_html = "<div class='catagorizing_game'>" + "<div class='matching_table'>";

    for (var j = 0; j < match_map.size; j++) {
        game_html += "<div class='active' data-target='" + match_map.get(Array.from(match_map.keys())[j]).toString().split(",")[0] + "'>" +
            Array.from(match_map.keys())[j] + "</div>";
    }
    game_html += "</div>";
    game_html += "<div class='spacer'></div>";
    game_html += "<div class='categories_table' id='mydiv'>";
    for (var i = 0; i < categories.size; i++) {
        game_html += "<div class='active'>" + Array.from(categories.keys())[i] + "</div>";
    }
    game_html += "</div>";

    var game_setup_record = game_holder.innerHTML;
    game_holder.innerHTML = game_html;

    setCardWidthAndHeight(".matching_table div", "--catagorizing_max_width", "--catagorizing_height", 0, 0);
    addCatagorizingListeners(match_map, categories, game_holder, game_setup_record);
}

function addCatagorizingListeners(match_map, categories, game_holder, game_setup_record) {

    var tds = document.querySelector("div.matching_table").querySelectorAll("div");

    for (var i = 0; i < tds.length; i++) {
        dragElement(tds[i]);
        tds[i].addEventListener("click", checkPosition.bind(null, event, "categories_table"));
    }
}
//https://stackoverflow.com/questions/3680429/click-through-div-to-underlying-elements

function buildGame() {
    var game_holders = document.getElementsByClassName("game");
    var output;

    for (var i = 0; i < game_holders.length; i++) {
        if (game_holders[i].classList.contains("matching")) {
            output = parseGameString(game_holders[i], "matching");
            setupMatchingGame(game_holders[i], output);
        } else if (game_holders[i].classList.contains("catagorize")) {
            output = parseGameString(game_holders[i], "catagorize");
            setupCatagorizingGame(game_holders[i], output);
        }
    }

}

//dragElement(document.getElementById("mydiv"));

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
