window.addEventListener('load', function () {
    //clicks on the 'All results' tab so it's open by default
    $("#all-results").click();

    // todo: filter the user data
    //toggle
    //radiobuttons
    //als je op deze radiobutton klikt, dan ..
})

//1. todo: create different query's;
//1.1 All results: all results matching the users location, date and gender preference
//1.2 Friends
//1.3 Friend requests (ingoing)
//1.4 Favorites

//todo: 2. filters; distance and buddy type

//todo: 3. match only gender

//todo: set button color depending on if there is an outgoing friend request, the user if friends with the user or no action
//todo: send notification to the other user
//function(s) for setting the status of the 'send friend request' button and sets database data

//todo: set favorites data in the database when clicking (swap)

/** function to switch the tab content and active tab-button */
async function openTabContent (currentButton) {
    let tab = $("#tab");

    //swaps the button colors
    $(".tab-button").css("backgroundColor", "");
    $(currentButton).css("backgroundColor", "#c11905");

    // console.log(currentButton.id)

    //todo: querys
    let userList = await getDataByPromise(`SELECT p.*, u.username, u.id, t.* FROM fys_is111_1_dev.profile p
    INNER JOIN fys_is111_1_dev.user u ON p.userId = u.id 
    INNER JOIN fys_is111_1_dev.travel t ON u.id = t.userId`);

    // console.log(userList)

    $(tab).html("");
    // $(userList).each(user => $(tab).append(generateUserDisplay(user)));
    for (let i = 0; i < userList.length; i++) {
        $(tab).append(generateUserDisplay(userList[i]));
    }
}

/** function for generating a user display */
function generateUserDisplay(currentUser) {
    console.log(currentUser)
    let userId = currentUser["userId"];

    let userDisplay = document.createElement("div");
    userDisplay.className = "user-display";
    userDisplay.setAttribute("id", "user-display-" + userId);

    let username = currentUser["username"] === "" ? "username" : currentUser["username"];
    let url = "https://dev-is111-1.fys.cloud/uploads/profile-pictures/" + currentUser["pictureUrl"];
    let location = currentUser["destination"] === "" ? "location" : currentUser["destination"];

    //start and end date
    let date = new Date(currentUser["startdate"]);
    const startDate = currentUser["startdate"] === "" ? "start date" : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    date = new Date(currentUser["enddate"]);
    const endDate = currentUser["enddate"] === "" ? "end date" : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    let buddy = currentUser["buddyType"] === "" ? "type of buddy" : currentUser["buddyType"];

    //todo: add buddyId or buddyClass
    userDisplay.innerHTML =
        `<h1 id=user-display-h1-${userId}>${username}</h1>
            <img onerror="this.src='https://dev-is111-1.fys.cloud/uploads/profile-pictures/default-profile-picture.png'" class="profile-picture" src="${url}">
            <div>
            <p>${location}</p>
            <p>from ${startDate}</p>
            <p>until ${endDate}</p>
            <p>${buddy}</p>
            </div>
            <div class="tab-content-column-4">
            <button id="button1-${userId}" onclick="openUserOverlay('${userId}')">more info</button>
            <button id="button2-${userId}" onclick="closeElement('user-display-${userId}')">X</button>
            <div id="favorite-v1-${userId}" onclick="setFavorite('favorite-v1-${userId}','favorite-v2-${userId}')">
            <img class="favorite-icon" src="Content/Images/favorite-v1.png">
            </div>
            <div id="favorite-v2-${userId}" style="display: none" onclick="setFavorite('favorite-v2-${userId}','favorite-v1-${userId}')">
            <img class="favorite-icon" src="Content/Images/favorite-v2.png">
            </div>
            </div>
            </div>`;

    return userDisplay;
}

/** function for opening the overlay with the correct user data*/
async function openUserOverlay (overlayUserId) {
    // console.log(overlayUserId)

    let overlayUserData = await getDataByPromise(`SELECT p.*, u.username, u.id FROM fys_is111_1_dev.profile p
    INNER JOIN fys_is111_1_dev.user u ON p.userId = u.id
    WHERE u.id = ?`, overlayUserId);

    let overlayUserInterestsIds = await getDataByPromise("SELECT * FROM fys_is111_1_dev.userinterest WHERE userId = ?", overlayUserId);

    console.log(overlayUserData)
    console.log(overlayUserData[0]["username"])

    //setting the data from the user and profile tables for in the overlay
    let url = "https://dev-is111-1.fys.cloud/uploads/profile-pictures/" + overlayUserData[0]["pictureUrl"]
    let fullName = overlayUserData[0]["firstname"] + " " + overlayUserData[0]["lastname"];
    let username;

    //putting the data from the user and profile tables in the overlay
    $("#overlay-row-1").html(`<img onerror="this.src='https://dev-is111-1.fys.cloud/uploads/profile-pictures/default-profile-picture.png'" src="${url}">`);
    $("#overlay-full-name").html(`${fullName}`);
    $("#overlay-username").html(`a.k.a. ${overlayUserData[0]["username"]}`);
    $("#overlay-bio").html(`${overlayUserData[0]["biography"]}`);

    //putting the interests into the overlay
    $("#overlay-interests-ul").html("");
    $(overlayUserInterestsIds).each(interest => {
        $("#overlay-interests-ul").append(`<li>` + overlayUserInterestsIds[interest]["interestId"] + `</li>`);
    });

    //displays the overlay and overlay-background
    displayUserOverlay()

    //function to redirect the user to the profilepage
    $("#profile-button").click(function (){redirectToProfileById(overlayUserId)});
}

/** function for opening the overlay */
function displayUserOverlay() {
    $("#overlay").css("display", "flex");
    $("#overlay-background").css("display", "block");
}

/** function to close the active user-display or overlay */
function closeElement (currentDisplay) {
    $("#" + currentDisplay).css("display", "none");
    $("#overlay-background").css("display", "none");
}

/** function that swaps the favorites icon */
function setFavorite (currentIconId, newIconId) {
    $("#" + currentIconId).css("display", "none");
    $("#" + newIconId).css("display", "");
}