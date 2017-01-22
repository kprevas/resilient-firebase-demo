/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Initializes FriendlyChat.
function FriendlyChat() {
    this.checkSetup();

    // Shortcuts to DOM Elements.
    // this.messageList = document.getElementById('messages');
    // this.messageForm = document.getElementById('message-form');
    // this.messageInput = document.getElementById('message');
    // this.submitButton = document.getElementById('submit');
    // this.submitImageButton = document.getElementById('submitImage');
    // this.imageForm = document.getElementById('image-form');
    // this.mediaCapture = document.getElementById('mediaCapture');
    // this.userPic = document.getElementById('user-pic');
    // this.userName = document.getElementById('user-name');
    // this.signInButton = document.getElementById('sign-in');
    // this.signOutButton = document.getElementById('sign-out');
    // this.signInSnackbar = document.getElementById('must-signin-snackbar');

    // Saves message on form submit.
    $("#message-form").submit(this.saveMessage.bind(this));
    $("#sign-out").click(this.signOut.bind(this));
    $("#sign-in").click(this.signIn.bind(this));

    // Toggle for the button.
    var buttonTogglingHandler = this.toggleButton.bind(this);
    $("#message").on("keyup change", buttonTogglingHandler);

    $("#submitImage").click(function () {
        $("#mediaCapture").click();
    }.bind(this));
    $("#mediaCapture").change(this.saveImageMessage.bind(this));

    this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
FriendlyChat.prototype.initFirebase = function () {
    // TODO(DEVELOPER): Initialize Firebase.
};

// Loads chat messages history and listens for upcoming ones.
FriendlyChat.prototype.loadMessages = function () {
    // TODO(DEVELOPER): Load and listens for new messages.
};

// Saves a new message on the Firebase DB.
FriendlyChat.prototype.saveMessage = function (e) {
    e.preventDefault();
    // Check that the user entered a message and is signed in.
    if ($("#message").val() && this.checkSignedInWithMessage()) {

        // TODO(DEVELOPER): push new message to Firebase.

    }
};

// Sets the URL of the given img element with the URL of the image stored in Firebase Storage.
FriendlyChat.prototype.setImageUrl = function (imageUri, imgElement) {
    imgElement.src = imageUri;

    // TODO(DEVELOPER): If image is on Firebase Storage, fetch image URL and set img element's src.
};

// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
FriendlyChat.prototype.saveImageMessage = function (event) {
    var file = event.target.files[0];

    // Clear the selection in the file picker input.
    $("#image-form")[0].reset();

    // Check if the file is an image.
    if (!file.type.match(/image.*/)) {
        var data = {
            message: 'You can only share images',
            timeout: 2000
        };
        $("#must-signin-snackbar")[0].MaterialSnackbar.showSnackbar(data);
        return;
    }
    // Check if the user is signed-in
    if (this.checkSignedInWithMessage()) {

        // TODO(DEVELOPER): Upload image to Firebase storage and add message.

    }
};

// Signs-in Friendly Chat.
FriendlyChat.prototype.signIn = function () {
    // TODO(DEVELOPER): Sign in Firebase with credential from the Google user.
};

// Signs-out of Friendly Chat.
FriendlyChat.prototype.signOut = function () {
    // TODO(DEVELOPER): Sign out of Firebase.
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
FriendlyChat.prototype.onAuthStateChanged = function (user) {
    if (user) { // User is signed in!
        // Get profile pic and user's name from the Firebase user object.
        var profilePicUrl = null;   // TODO(DEVELOPER): Get profile pic.
        var userName = null;        // TODO(DEVELOPER): Get user's name.

        // Set the user's profile pic and name.
        $("#user-pic").css("background-image", 'url(' + profilePicUrl + ')');
        $("#user-name").text(userName);

        // Show user's profile and sign-out button.
        $("#user-name, #user-pic, #sign-out").show();

        // Hide sign-in button.
        $("#sign-in").hide();

        // We load currently existing chat messages.
        this.loadMessages();
    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        $("#user-name, #user-pic, #sign-out").hide();

        // Show sign-in button.
        $("#sign-in").show();
    }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
FriendlyChat.prototype.checkSignedInWithMessage = function () {
    /* TODO(DEVELOPER): Check if user is signed-in Firebase. */

    // Display a message to the user using a Toast.
    var data = {
        message: 'You must sign-in first',
        timeout: 2000
    };
    $("#must-signin-snackbar")[0].MaterialSnackbar.showSnackbar(data);
    return false;
};

// Resets the given MaterialTextField.
FriendlyChat.resetMaterialTextfield = function (element) {
    element.val("");
    element.parent()[0].MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
FriendlyChat.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
    '<div class="spacing"><div class="pic"></div></div>' +
    '<div class="message"></div>' +
    '<div class="name"></div>' +
    '</div>';

// A loading image URL.
FriendlyChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
FriendlyChat.prototype.displayMessage = function (key, name, text, picUrl, imageUri) {
    var messages = $("#messages");
    var div = $("#" + key);
    // If an element for that message does not exists yet we create it.
    if (!div.length) {
        div = $(FriendlyChat.MESSAGE_TEMPLATE);
        div.attr("id", key);
        messages.append(div);
    }
    if (picUrl) {
        div.find('.pic').css("background-image", 'url(' + picUrl + ')');
    }
    div.find('.name').text(name);
    var messageElement = div.find('.message');
    if (text) { // If the message is text.
        messageElement.text(text);
        // Replace all line breaks by <br>.
        messageElement.html(messageElement.html().replace(/\n/g, '<br>'));
    } else if (imageUri) { // If the message is an image.
        var image = $('img');
        image.load(function () {
            messages.scrollTop(messages[0].scrollHeight);
        }.bind(this));
        this.setImageUrl(imageUri, image);
        messageElement.empty();
        messageElement.append(image);
    }
    // Show the card fading-in.
    setTimeout(function () {
        div.addClass('visible');
    }, 1);
    messages.scrollTop(messages[0].scrollHeight);
    $("message").focus();
};

// Enables or disables the submit button depending on the values of the input
// fields.
FriendlyChat.prototype.toggleButton = function () {
    $("#submit").prop('disabled', !$("#message").val());
};

// Checks that the Firebase SDK has been correctly setup and configured.
FriendlyChat.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions.');
    } else if (config.storageBucket === '') {
        window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
            'actually a Firebase bug that occurs rarely. ' +
            'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
            'and make sure the storageBucket attribute is not empty. ' +
            'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
            'displayed there.');
    }
};

$(function () {
    window.friendlyChat = new FriendlyChat();
});
