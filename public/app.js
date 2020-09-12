//Initialize Firebse
var config = {
    apiKey: "AIzaSyDOgdvzsl1R05uz8dr-z9u-SUl2Frne7BY",
    authDomain: "sippintheteas.firebaseapp.com",
    databaseURL: "https://sippintheteas.firebaseio.com",
    projectId: "sippintheteas",
    storageBucket: "sippintheteas.appspot.com",
    messagingSenderId: "127696580761",
    appId: "1:127696580761:web:b1c7f41096e19bddad4808",
    measurementId: "G-58QM2F5YBW"
};
firebase.initializeApp(config);

firebase.analytics();

var Constants = {
    TESTIMONIES: "testimonies",
    POSTS_LIMIT: 7,
};

var firestore = firebase.firestore();

// We'll need this ref for paging
var docRef;

var postList = document.querySelector("#post-list");
var loadMoreBtn = document.querySelector("#load-more");
var outputHeader = document.querySelector("#Title");
var inputTextField = document.querySelector("#Content");
var submitButton = document.querySelector("#submitButton");

if (submitButton) {
    submitButton.addEventListener("click", function () {
        // Disable the submit button
        submitButton.disabled = true;
        var textToSubmit = inputTextField.value;
        var title = outputHeader.value;
        console.log("I am going to submit" + textToSubmit + " to Firestore");
        firestore.collection(Constants.TESTIMONIES).add({
                content: textToSubmit,
                title: title,
                timestamp: Date.now()
            })
            .then(function () {
                console.log("Testimony submitted!");
                window.location.pathname = '/';
            })
            .catch(function (error) {
                alert('Something went wrong please retry');
                submitButton.disabled = false;
            });
    })
}

loadMoreBtn.addEventListener('click', function() {
    getPosts(docRef);
    loadMoreBtn.disabled = true;
});

function getPosts() {
    console.log('Doc Ref:', docRef);
    var query = firestore.collection(Constants.TESTIMONIES).orderBy('timestamp', 'desc');

    if (docRef) {
        // Setting cursor
        query = query.startAfter(docRef);
    }

    query = query.limit(Constants.POSTS_LIMIT);

    query.get().then(function (querySnapshot) {
        if (querySnapshot.size > 0) {
            loadMoreBtn.style = "display: inherit;";

            querySnapshot.docs.forEach(function (doc, ix, arr) {
                console.log('args:', doc, ix, arr);

                if (doc && doc.exists) {

                    console.log("Document:", doc);

                    // Get the post data
                    var data = doc.data();

                    console.log('data:', data);

                    // We create a div to add to our post list
                    var post = document.createElement('div');
                    post.setAttribute('class', 'content-post');
                    post.setAttribute('id', doc.id);

                    post.innerHTML = `
                        <div class="post-content">
                            <span class="post-title">${data.title}</span>
                            <p class="post-body">${data.content}</p>
                            <p class="post-date"><span>${(new Date(data.timestamp)).toLocaleDateString()}</span></p>
                        </div>
                    `;

                    postList.appendChild(post);

                    if (ix === arr.length - 1) {
                        docRef = doc;
                    }
                }
            })
        }

        loadMoreBtn.disabled = false;
    })
}

try {
    getPosts();
} catch (err) {
    console.error(err);
}