document.addEventListener("DOMContentLoaded", function () {
    console.log("Ready!");

    fetch("https://recipe-puppy.p.rapidapi.com/?p=1&i=onions%2Cgarlic&q=omelet", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "67881b9808mshbbabb71972d9dcfp18bd52jsn43e0460819ba",
            "x-rapidapi-host": "recipe-puppy.p.rapidapi.com"
        }
    })
        .then(response => response.json())
        .then(response => {
            response = response.results
            console.log(response);
            appendData(response);
        })
        .catch(err => {
            console.error(err);
        })

    function appendData(data) {
        var mainContainer = document.getElementById("myData");
        for (var i = 0; i < data.length; i++) {
            var div = document.createElement("div");
            div.innerHTML = `
                <div class = "receipe">
                    <img src = "../img/Greek Omelet.png" alt = "food" class="food">
                    <h3>${data[i].title}</h3>
                    <p class="ingredients">Ingredients: ${data[i].ingredients}</p>
                    <a href = "${data[i].href}" class = "recipe-btn">Get Recipe</a>
                </div>
        `;
            mainContainer.appendChild(div);
        }
    }
});