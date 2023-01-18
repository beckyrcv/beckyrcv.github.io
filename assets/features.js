 // code for slider

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
