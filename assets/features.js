function loadBars(page_type = "child") {
    if (page_type === "root") {
        $("#nav_div").load("./assets/nav.html");
        $("#sidenav_div").load("./assets/sidebar.html");
    } else {
        $("#nav_div").load("../assets/branch_nav.html");
        $("#sidenav_div").load("../assets/branch_sidebar.html");
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
