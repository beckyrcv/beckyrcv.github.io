 $('document').ready(function () {
     loadBars();
     addExpandButton();
     adjustLocalLinks();
 });

 function getPathStart() {
     var filename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

     if (filename === "index.html") {
         return "./";
     } else {
         return "../";
     }
 }

 function loadBars() {
     var prefix = getPathStart();
     $("#nav_div").load(prefix + "assets/nav.html");
     $("#sidenav_div").load(prefix + "assets/sidebar.html");
 }

 function getLinkPrefix(el) {
     return getPathStart() + el.href.substring(window.location.pathname.lastIndexOf('/') + 8);
 }

 function addLinkPrefix(eles) {
     for (var i = 0; i < eles.length; i++) {
         eles[i].href = getLinkPrefix(eles[i]);
         console.log(eles[i].href);
     }
 }

 function adjustLocalLinks() {
     //     https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
     const config = {
         childList: true
     };
     const nav_callback = (mutationList, observer) => {
         for (const mutation of mutationList) {
             if (mutation.type === 'childList') {
                 var change_links = document.getElementById("nav_div").getElementsByTagName("a");
                 addLinkPrefix(change_links);
             }
         }
     };
     const side_callback = (mutationList, observer) => {
         for (const mutation of mutationList) {
             if (mutation.type === 'childList') {
                 change_links = document.getElementById("sidenav_div").getElementsByClassName("add_image_div");
                 for (var i = 0; i < change_links.length; i++) {
                     var new_img = document.createElement("img");
                     new_img.classList.add('added_image');
                     var img_props = change_links[i].dataset.imgdata.split(";");
                     for (var j = 0; j < img_props.length; j++) {
                         var prop_key = img_props[j].split(":")[0];
                         var prop_val = img_props[j].split(":")[1];
                         if (prop_key === "path") {
                             new_img.src = getPathStart() + prop_val;
                         } else if (prop_key === "width") {
                             new_img.width = prop_val;
                         } else if (prop_key === "height") {
                             new_img.height = prop_val;
                         }
                     }
                     change_links[i].append(new_img);
                 }
                 change_links = document.getElementById("contact_page");
                 addLinkPrefix([change_links]);
             }
         }
     };
     const nav_observer = new MutationObserver(nav_callback);
     nav_observer.observe(document.getElementById('nav_div'), config);
     const side_observer = new MutationObserver(side_callback);
     side_observer.observe(document.getElementById('sidenav_div'), config);
 }



 // $(function () {
 //     var prefix = getPathStart();
 //     console.log(prefix + "assets/nav.html");
 //     $("#nav_div").load(prefix + "assets/nav.html");
 //     $('#nav_div a').each(function () {
 //         var temp = $(this).prop('href');
 //         $(this).prop('href', prefix + temp);
 //     });
 //     $("#sidenav_div").load(prefix + "assets/sidebar.html");
 //     $('#sidenav_div #contact_page').each(function () {
 //         var temp = $(this).prop('href');
 //         $(this).prop('href', prefix + temp);
 //     });
 //     $('#sidenav_div img').each(function () {
 //         var temp = $(this).prop('href');
 //         $(this).prop('href', prefix + temp);
 //     });
 // });

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

 function addExpandButton() {
     var folder_path = getPathStart() + "assets/";
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
