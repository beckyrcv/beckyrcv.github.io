 function fetchJSONData() {
     fetch("./bengali_pronouns.json")
         .then((res) => {
             if (!res.ok) {
                 throw new Error(`HTTP error! Status: ${res.status}`);
             }
             return res.json();
         })
         .then((data) =>
             appendData(data))
         .then((data) =>
             console.log(data))
         .catch((error) =>
             console.error("Unable to fetch data:", error));
 }

 function appendData(data) {
     let mainContainer = document.getElementById("pronoun_game");
     var index = 5;
     let main_div = document.createElement("div");
     main_div.innerHTML = 'Name: ' + data[index].bengali + ' ' + data[index].english;
     mainContainer.appendChild(main_div);

     for (let i = 0; i < data.length; i++) {
         let div = document.createElement("div");
         div.innerHTML = 'Name: ' + data[i].bengali + ' ' + data[i].english;
         mainContainer.appendChild(div);
     }
 }
 fetchJSONData();
