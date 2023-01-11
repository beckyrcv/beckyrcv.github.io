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
function toggleMatchSelect() {
    var cn = this.className,
        thc = " match_selected",
        start_idx = cn.indexOf(thc);
    if (start_idx == -1) cn += thc;
    else cn = cn.replace(thc, "");
    this.className = cn;
}

//find nearest square
const nearest_sq = n => Math.pow(Math.round(Math.sqrt(n)), 2);

function addMatchingListeners(index_size, matching_pairs_side1, matching_pairs_side2, game_holder, game_setup_record) {

    var table = document.querySelector("table.matching_game");

    var tds = table.querySelectorAll("td");
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].innerHTML != "") {
            tds[i].addEventListener("click", toggleMatchSelect);
        }
    }

    table.addEventListener("click", function () {
        var sel_tds = table.querySelectorAll("td.match_selected");
        if ((sel_tds.length) == 2) {
            if (matching_pairs_side1.get(sel_tds[0].innerHTML) == sel_tds[1].innerHTML) {
                sel_tds[0].innerHTML = "";
                sel_tds[1].innerHTML = "";
                sel_tds[0].classList.remove("match_selected");
                sel_tds[1].classList.remove("match_selected");
                sel_tds[0].removeEventListener("click", toggleMatchSelect);
                sel_tds[1].removeEventListener("click", toggleMatchSelect);
            } else if (matching_pairs_side2.get(sel_tds[0].innerHTML) == sel_tds[1].innerHTML) {
                sel_tds[0].innerHTML = "";
                sel_tds[1].innerHTML = "";
                sel_tds[0].classList.remove("match_selected");
                sel_tds[1].classList.remove("match_selected");
                sel_tds[0].removeEventListener("click", toggleMatchSelect);
                sel_tds[1].removeEventListener("click", toggleMatchSelect);
            } else {
                sel_tds[0].classList.remove("match_selected");
                sel_tds[1].classList.remove("match_selected");
            }
        }
        var empty_tds = table.querySelectorAll("td:empty");
        if (empty_tds.length == index_size) {
            game_holder.innerHTML = game_setup_record;
            setupMatchingGame(game_holder);
        }
    });
}

function setupMatchingGame(game_holder) {

    var game_items = game_holder.innerHTML.trim().split("\n         ");

    var matching_pairs_side1 = new Map();
    var matching_pairs_side2 = new Map();
    for (var ii = 0; ii < game_items.length; ii++) {
        matching_pairs_side1.set(game_items[ii].toString().split("/")[0], game_items[ii].toString().split("/")[1]);
        matching_pairs_side2.set(game_items[ii].toString().split("/")[1], game_items[ii].toString().split("/")[0]);
    }

    var terms = matching_pairs_side1.size;
    var index_size = nearest_sq(terms * 2);
    var num_row = Math.sqrt(index_size);
    var card_index = Array.from(Array(index_size).keys());

    shuffleArray(card_index);
    var matching_table = "<table class='matching_game'><tr>";
    for (var j = 0; j < index_size; j++) {
        if (card_index[j] >= (terms * 2)) {
            matching_table += "<td></td>";
        } else if (card_index[j] >= (terms)) {
            matching_table += "<td>" + Array.from(matching_pairs_side2.keys())[card_index[j] - terms] + "</td>";
        } else {
            matching_table += "<td>" + Array.from(matching_pairs_side1.keys())[card_index[j]] + "</td>";
        }

        if (((j + 1) % num_row) == 0) {
            matching_table += "</tr><tr>";
        }
    }
    matching_table += "</tr></table>"

    var game_setup_record = game_holder.innerHTML;
    game_holder.innerHTML = matching_table;
    addMatchingListeners(index_size, matching_pairs_side1, matching_pairs_side2, game_holder, game_setup_record);
}

function buildGame() {
    var game_holders = document.getElementsByClassName("game");

    // check here for what type of game (look at other classes)

    for (var i = 0; i < game_holders.length; i++) {
        setupMatchingGame(game_holders[i]);
    }

}
