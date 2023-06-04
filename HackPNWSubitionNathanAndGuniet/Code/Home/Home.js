firebase.initializeApp({
    apiKey: "AIzaSyBlL_vBOKkmzKaP1gyidy2o35EeZ1SC_qA",
    authDomain: "neon-research-365601.firebaseapp.com",
    databaseURL: "https://neon-research-365601-default-rtdb.firebaseio.com",
    projectId: "neon-research-365601",
    storageBucket: "neon-research-365601.appspot.com",
    messagingSenderId: "376695677013",
    appId: "1:376695677013:web:26abfcb0cc53e5cef374dc",
    measurementId: "G-1JTX2F79VG"
});

const email = document.getElementById("email");
const password = document.getElementById("password");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("send-message-btn");
const imageFileInput = document.getElementById("image-file");
const uploadLabel = document.getElementById('upload-label');


function sendMessage(event) {
    event.preventDefault();
    let message = messageInput.value;
    let sender = firebase.auth().currentUser.uid;

    var ref = firebase.database().ref('users/');
    ref.once("value", function(snapshot) {
        var userExists = snapshot.hasChild(sender);
        if (userExists) {
            // Obtain the current location
            navigator.geolocation.getCurrentPosition(position => {
                let currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };

                if (imageFileInput.files.length > 0) {
                    var imageFile = imageFileInput.files[0];
                    var storageRef = firebase.storage().ref();
                    var imageRef = storageRef.child('images/' + imageFile.name);
                    var uploadTask = imageRef.put(imageFile);
                    document.getElementById("image-file").value = "";
                    uploadLabel.style.backgroundColor = '#f4f4f4';
                    uploadLabel.style.color = '#333';
                    uploadTask.on('state_changed', function(snapshot) {
                    }, function(error) {
                    }, function() {
                        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                            firebase.database().ref('messages/').push({
                                sender: sender,
                                message: message,
                                imageUrl: downloadURL,
                                location: currentLocation // Send the current location
                            });
                            console.log(message + ", " + sender);
                            messageInput.value = "";
                        });
                    });

                } else {
                    firebase.database().ref('messages/').push({
                        sender: sender,
                        message: message,
                        location: currentLocation, // Send the current location
                    });
                    console.log(message + ", " + sender);
                    messageInput.value = "";
                }
            }, error => {
                console.log("Error obtaining location: ", error);
            });
        } else {
            console.log("User does not exist in the database");
        }
    });
}

sendBtn.addEventListener("click", sendMessage);


document.getElementById('profile-icon').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar.style.display === "none") {
        sidebar.style.display = "";
    } else {
        sidebar.style.display = "none";
    }
});


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var email = user.email;
        var recipientID = user.uid;
        const messagesRef = firebase.database().ref("messages");
        const allMessagesRef = messagesRef.orderByChild("timestamp");

        allMessagesRef.on("child_added", function(snapshot) {
            console.log(snapshot.val());
            var message = snapshot.val();
            var sender = message.sender;
            var messageContent = message.message;

            var messageDiv = document.createElement("div");
            messageDiv.className = "SingleMessage";
            

            var messageMap = document.createElement("div");
            messageMap.id = "map-" + snapshot.key;
            messageMap.style.width = "200px"
            messageMap.style.height = "200px"
            messageMap.style.border = "1px solid black"
            messageDiv.innerHTML = "Message: " + messageContent + "<br> - " +sender;
            messageDiv.appendChild(messageMap);
            if (message.imageUrl) {
                var messageImage = document.createElement("img");
                messageImage.src = message.imageUrl;
                messageImage.className = "PostedImage";
                messageDiv.appendChild(messageImage);
            }

            var messagesContainer = document.getElementById("messages-container");
            messagesContainer.prepend(messageDiv);
            console.log(message.location);
            if(message.location != "")
            {
                var locationData = message.location;
                var location = new google.maps.LatLng(locationData.lat, locationData.lng)
                var map = new google.maps.Map(document.getElementById(messageMap.id), {
                    center: location,
                    zoom: 13,
                });
    
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                });
            }
        });

        firebase.database().ref('users/' + recipientID).set({
            email: email,
        });

        if (email) {
            document.getElementById("user-email").innerHTML = "Welcome, " + email;
        } else {
            console.log("User is not logged in, redirecting to login page...");
            window.location.href = "../Login/LoginMessage.html";
        }
    } else {
        console.log("User is signed out, redirecting to login page...");
        window.location.href = "../Login/LoginMessage.html";
    }
});




var signOutBtn = document.getElementById("sign-out-btn");

signOutBtn.addEventListener("click", function() {
    firebase.auth().signOut()
        .then(function() {
            console.log("User signed out");
            window.location.href = "../Login/LoginMessage.html";
        })
        .catch(function(error) {
            console.error("Error signing out:", error);
        });
});


imageFileInput.addEventListener('change', () => {
    if(imageFileInput.value) {
        uploadLabel.style.backgroundColor = 'green';
        uploadLabel.style.color = 'white';
    } else {
        uploadLabel.style.backgroundColor = '#f4f4f4';
        uploadLabel.style.color = '#333';
    }
});



let currentLocation = null;

function initMap() {
    // HTML5 geolocation.
    console.log("1");
    if (navigator.geolocation) {
      console.log("2");
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
  
        var map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 13
        });
  
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'My location'
        });
  
      }, function() {
        handleLocationError(true, null, null); // Pass null for infoWindow and map.getCenter()
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, null, null); // Pass null for infoWindow and map.getCenter()
    }
  }
  
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }
  