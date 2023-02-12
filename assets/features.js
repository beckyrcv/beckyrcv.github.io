function loadBars(page_type = "child") {
    if (page_type === "root") {
        $("#nav_div").load("./assets/nav.html");
        $("#sidenav_div").load("./assets/sidebar.html");
    } else {
        $("#nav_div").load("../assets/branch_nav.html");
        $("#sidenav_div").load("../assets/branch_sidebar.html");
    }
}

function addOverlay() {
    var sources = document.getElementsByClassName("overlay_source");
    for (var i = 0; i < sources.length; i++) {
        if (!(sources[i].classList.contains("no_button"))) {

        }
        sources[i].addEventListener("click", function (e) {
            var nav_hr = document.getElementsByClassName("nav_hr");
            var top_offset = nav_hr.item(0).getBoundingClientRect().bottom;
            var side_nav = document.getElementById("sidenav_div");
            var left_offset = side_nav.getBoundingClientRect().right;
            var current_div = document.getElementById("overlay_div");
            if (current_div) {
                if (current_div.dataset.ele === e.target.innerHTML) {
                    current_div.remove();
                    return;
                } else {
                    current_div.remove();
                }
            }
            var new_div = document.createElement("div");
            new_div.id = "overlay_div";
            new_div.dataset.ele = e.target.innerHTML;
            new_div.classList.add('overlay');
            new_div.style.position = "fixed";
            new_div.style.top = top_offset + "px";
            new_div.style.left = left_offset + "px";
            new_div.style.margin = "50px";
            new_div.style.padding = "2em";
            new_div.style.backgroundColor = "white";
            new_div.style.border = "1px solid darkblue";
            var div_string = e.target.dataset.info;
            var init = div_string.indexOf('{');
            var fin = div_string.indexOf('}');
            var count = 0;

            while (init > -1) {
                if (div_string.substring(init + 1, fin) === "content") {
                    div_string = div_string.replace(div_string.substring(init, fin + 1), e.target.innerHTML);
                } else {
                    var match_text = div_string.substring(init + 1, fin);
                    if (e.target.dataset[match_text]) {
                        div_string = div_string.replace(div_string.substring(init, fin + 1), e.target.dataset[match_text]);
                    } else {
                        div_string = div_string.replace(div_string.substring(init, fin + 1), "");
                    }
                }
                init = div_string.indexOf('{');
                fin = div_string.indexOf('}');
                count += 1;
                if (count == 5) {
                    init = -1;
                }
            }
            new_div.innerHTML = div_string;
            addCollapseButton(new_div, "overlay_div");
            document.body.appendChild(new_div);

        });
    }
}

function toggleParentBoxes(element) {
    if (element.parentElement.classList.contains("box") ||
        element.parentElement.classList.contains("box_holder")) {
        element.parentElement.classList.toggle('hide');
    }
    if (element.parentElement.classList.contains("slider-wrapper")) {
        toggleSilderWrapper(element.parentElement);
    }
    if (!element.parentElement.classList.contains("main_index_main")) {
        toggleParentBoxes(element.parentElement);
    }
}

function toggleSilderWrapper(wrap_sect) {
    wrap_sect.classList.toggle('hide');
    var children = wrap_sect.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].classList.contains("slide-arrow")) {
            children[i].classList.toggle('hide');
        }
        if (children[i].classList.contains("slides-container")) {
            var slides = children[i].children;
            for (var i = 0; i < slides.length; i++) {
                if ((slides[i].firstElementChild.classList.contains("box")) && (slides[i].firstElementChild.classList.contains("hide"))) {
                    slides[i].classList.add('hide');
                } else if (slides[i].firstElementChild.classList.contains("box")) {
                    slides[i].classList.remove('hide');
                }
            }
        }
    }
}

function addCollapseButton(ele, ele_id, page_type = "child") {
    var folder_path;
    if (page_type === "root") {
        folder_path = "./assets/";
    } else {
        folder_path = "../assets/";
    }
    var new_div = document.createElement("button");
    new_div.classList.add('button');
    new_div.classList.add('expand_button');
    new_div.classList.add('expanded');
    new_div.innerHTML = "<div class='expand_text'>click to expand </div>" + "<div class='collapse_text'>click to collapse </div>";
    var new_img = document.createElement("img");
    new_img.classList.add('expand_img');
    new_img.src = folder_path + "expand-arrows-icon.svg";
    new_img.style.width = "10px";
    new_div.append(new_img);
    var new_img = document.createElement("img");
    new_img.classList.add('contract_img');
    new_img.src = folder_path + "arrows-center-icon.svg";
    new_img.style.width = "10px";
    new_div.append(new_img);
    new_div.addEventListener("click", removeParent.bind(null, event, ele_id));
    ele.prepend(new_div);
}

function removeParent(a, par_id) {
    if (event.target.classList.contains("expanded")) {
        var current_div = document.getElementById(par_id);
        current_div.remove();
    }
}

function addExpandButton(page_type = "child") {
    var folder_path;
    if (page_type === "root") {
        folder_path = "./assets/";
    } else {
        folder_path = "../assets/";
    }
    var boxes = document.getElementsByClassName("box");
    for (var i = 0; i < boxes.length; i++) {
        if (!boxes[i].firstElementChild.classList.contains("slider-wrapper")) {
            var new_div = document.createElement("button");
            new_div.classList.add('button');
            new_div.classList.add('expand_button');
            new_div.innerHTML = "<div class='expand_text'>click to expand </div>" + "<div class='collapse_text'>click to collapse </div>";
            var new_img = document.createElement("img");
            new_img.classList.add('expand_img');
            new_img.src = folder_path + "expand-arrows-icon.svg";
            new_img.style.width = "10px";
            new_div.append(new_img);
            var new_img = document.createElement("img");
            new_img.classList.add('contract_img');
            new_img.src = folder_path + "arrows-center-icon.svg";
            new_img.style.width = "10px";
            new_div.append(new_img);
            new_div.addEventListener("click", function (e) {
                var hide_boxes = document.getElementsByClassName("box");
                var other_holders = document.getElementsByClassName("box_holder");
                for (var ii = 0; ii < hide_boxes.length; ii++) {
                    hide_boxes[ii].classList.toggle('hide');
                }
                for (var jj = 0; jj < other_holders.length; jj++) {
                    other_holders[jj].classList.toggle('hide');
                }
                toggleParentBoxes(e.target);
                e.target.classList.toggle("expanded");

            });
            boxes[i].prepend(new_div);
        }
    }
}

//timeoutId = setTimeout(showSlides, 5000); 
// code for slider
function constructSilder() {
    var slidesContainer = document.getElementById("slides-container");
    var slide = document.querySelector(".slide");
    var prevButton = document.getElementById("slide-arrow-prev");
    var nextButton = document.getElementById("slide-arrow-next");

    nextButton.addEventListener("click", () => {
        var slideWidth = slide.clientWidth;
        slidesContainer.scrollLeft += slideWidth;
    });

    prevButton.addEventListener("click", () => {
        var slideWidth = slide.clientWidth;
        slidesContainer.scrollLeft -= slideWidth;
    });
}
var slidesContainers = document.getElementsByClassName("slides-container");
for (var s = 0; s < slidesContainers.length; s++) {
    constructSilder();
}
