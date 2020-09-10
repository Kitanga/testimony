(function() {
//Initialize Firebse
var config = {
    apiKey: "AIzaSyDOgdvzsl1R05uz8dr-z9u-SUl2Frne7BY",
    authDomain: "sippintheteas.firebaseapp.com",
    databaseURL: "https://sippintheteas.firebaseio.com",
    projectId: "sippintheteas",
    storageBucket: "sippintheteas.appspot.com",
    messagingSenderId: "127696580761",
};
firebase.initializeApp(config);

const Constants = {
    TESTIMONIES: "testimonies",
};

const firestore = firebase.firestore();
const outputHeader = document.querySelector("#Title");
const inputTextField = document.querySelector("#Content");
const submitButton = document.querySelector("#submitButton");

submitButton.addEventListener("click", function () {
    const textToSubmit = inputTextField.value;
    const title =outputHeader.value;
    console.log("I am going to submit" + textToSubmit + " to Firestore");
    firestore.collection(Constants.TESTIMONIES).add({
        content: textToSubmit,
        title:title,
        timestamp: Date.now()
    }).then(function () {
        console.log("Testimony submitted!");
    }).catch(function (error) {
        console.log("Got an error: ", error);
    });
})

getRealtimeUpdates = function () {
    firestore.collection(Constants.TESTIMONIES).get().then(function (querySnapshot) {
         querySnapshot.forEach(function(doc) {
            if (doc && doc.exists) {
                const myData = doc.data();
                console.log("Check out this document I recieved", myData);
            }
         })
    });
}

getRealtimeUpdates();
})()
