document.addEventListener("DOMContentLoaded", function () {
    console.log("Loaded");

    // Global Variables

    const db = firebase.firestore();

    const uploadBtn = document.getElementById("uploadBtn");
    const submit = document.getElementById("submit");
    const imageName = document.getElementById("imageName");
    const progress = document.getElementById("progress");
    const receipeName = document.getElementById("receipeName");
    const ingredients = document.getElementById("ingredients");
    const receipes = document.getElementById("receipes");

    let file = "";
    let fileName = "";
    let fileExt = "";

    // Upload Button event listener

    if (uploadBtn) {
        uploadBtn.addEventListener("change", function (e) {
            file = e.target.files[0];
            fileName = file.name.split(".").shift();
            fileExt = file.name.split(".").pop();
            imageName.value = fileName;
            console.log({ file, fileName, fileExt });
        });
    }


    // Submit the receipe's image to storage name images 
    // Add new receipes info to Receipes collection
    if (submit) {
        submit.addEventListener("click", function () {
            if (imageName.value) {

                const id = db.collection("Images").doc().id;
                const storageRef = firebase.storage().ref(`images/${id}.${fileExt}`);

                const uploadTask = storageRef.put(file);

                uploadTask.on(
                    "state_changed",
                    function (snapshot) {
                        progress.value =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    },
                    function (error) {
                        console.log(error);
                    },
                    function () {
                        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                            db.collection("Receipes")
                                .doc(id)
                                .set({
                                    name: imageName.value,
                                    id: id,
                                    receipe: receipeName.value,
                                    ingredient: ingredients.value,
                                    image: downloadURL,
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                })
                                .then(function () {
                                    file = "";
                                    fileName = "";
                                    fileExt = "";
                                    imageName.value = "";
                                    receipeName.value = "";
                                    ingredients.value = "";
                                    progress.value = 0;

                                    receipesGallery();
                                });
                        });
                    }
                );
            }
        });
    }

    //Delete receipe
    function deleteReceipe(id) {
        db.collection("Receipes")
            .doc(id)
            .delete()
            .then(function () {
                console.log("Document successfully deleted!");
            })
            .catch(function () {
                console.log("Error deleting document");
            });
    }

    // Show receipes from database in a div (gallery)

    function receipesGallery() {
        db.collection("Receipes")
            .orderBy("timestamp", "asc")
            .onSnapshot(function (querySnapshot) {

                if (receipes) {
                    receipes.innerHTML = "";

                    querySnapshot.forEach((doc) => {
                        //add a div to show each receipe in a seperate div
                        const div = document.createElement("div");
                        div.innerHTML = `
                            <div class = "receipe">
                                <img src = "${doc.data().image}"/>
                                <h3>${doc.data().receipe}</h3>
                                <p class="ingredients">Ingredients: ${doc.data().ingredient}</p>
                                <a href = "#" class = "recipe-btn">View Recipe</a>
                            </div>`;

                        //add a link to create a delete button below each receipe
                        let a = document.createElement("a");
                        a.innerHTML = `<i class="far fa-trash-alt"></i> Delete Receipe`;
                        a.className = "delete";

                        a.addEventListener("click", () => deleteReceipe(doc.id));
                        div.appendChild(a);
                        receipes.appendChild(div);
                    });
                }

            });
    }

    receipesGallery();

});