document.addEventListener("DOMContentLoaded", function () {
    console.log("Loaded");

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

    if(uploadBtn){
        uploadBtn.addEventListener("change", function (e) {
            file = e.target.files[0];
            fileName = file.name.split(".").shift();
            fileExt = file.name.split(".").pop();
            imageName.value = fileName;
            console.log({ file, fileName, fileExt });
        });
    }


    if(submit) {
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
                              .then(function() {
                                  file = "";
                                  fileName = "";
                                  fileExt = "";
                                  imageName.value = "";
                                  receipeName.value = "";
                                  ingredients.value = "";
                                  progress.value = 0;
    
                                  init();
                              });
                        });
                    }
                );
            }
        });
    }

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

    function init() {
        db.collection("Receipes")
        // .where("nickname", "==", "Negar")
        // .limit(2)
        .orderBy("timestamp", "asc")
        .onSnapshot( function (querySnapshot) {

            if(receipes) {
                receipes.innerHTML = "";

            querySnapshot.forEach((doc) => {
                const li = document.createElement("li");
                li.innerHTML = `<img src="${doc.data().image}"/> <h2>${doc.data().receipe}</h2> <p>${doc.data().ingredient}</p>`;


                let span = document.createElement("span");
                span.innerHTML = "&#10005";

                span.addEventListener("click", () => deleteReceipe(doc.id));
                li.appendChild(span);
                receipes.appendChild(li);
            });
            }

        });
    }

    init();

});