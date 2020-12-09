window.addEventListener('load', function () {
    //clicks on the 'All results' tab so it's open by default
    $("#all-results").click();

    // todo: filter the user data
    //toggle
    //radiobuttons
    //als je op deze radiobutton klikt, dan ..
})

let locationList;
async function getLocation(locationID){
    if (locationList === undefined)
        locationList = await getDataByPromise("SELECT * FROM location");
    for (let i = 0; i < locationList.length; i++) {
        if(locationList[i].id === locationID)
            return locationList[i];
    }
}
//todo: create different query's;
//1.1 All results todo: gender preference, blocked, display settings
//1.2 Friends
//1.3 Friend requests (ingoing)
//1.4 Favorites

//todo: 2. filters; distance and buddy type

//todo: 3. match only own gender (setting)

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

    //resets the filters
    resetFilters();

    //gets the current user's data
    const CURRENT_USER = await getDataByPromise(`SELECT u.id, t.userId, t.destination, t.startdate, t.enddate,l.* FROM fys_is111_1_dev.user u
    INNER JOIN fys_is111_1_dev.travel t ON u.id = t.userId
    INNER JOIN fys_is111_1_dev.location l ON t.destination = l.id
    WHERE u.id = ?`, getCurrentUserID());

    //gets the data of the relevant users for the current user
    //calculating distance snippet from stackoverflow answer; https://stackoverflow.com/a/48263512
    let userList = await getDataByPromise(`SELECT 
       p.userId, p.pictureUrl, 
       u.username,
       r.roleId, 
       s.radialDistance,
       t.startdate, t.enddate,
       l.*
    FROM fys_is111_1_dev.profile p
    INNER JOIN fys_is111_1_dev.user u ON u.id = p.userId
    INNER JOIN fys_is111_1_dev.userrole r ON r.userId = p.userId
    LEFT JOIN fys_is111_1_dev.setting s ON s.userId = p.userId
    INNER JOIN fys_is111_1_dev.travel t ON t.userId = p.userId
    INNER JOIN fys_is111_1_dev.location l ON l.id = t.destination
    WHERE r.roleId = 1
    AND t.startdate < ?
    AND t.enddate > ?
    AND p.userId != ?
    AND (6371 * acos(cos(radians(l.latitude)) * cos(radians(?)) * cos(radians(?) - radians(l.longitude)) + sin(radians(l.latitude)) * sin(radians(?)))) < IFNULL(s.radialDistance, 999999)`
        , [CURRENT_USER[0]["enddate"], CURRENT_USER[0]["startdate"], getCurrentUserID(), CURRENT_USER[0]["latitude"], CURRENT_USER[0]["longitude"], CURRENT_USER[0]["latitude"]]);

    $(tab).html("");
    //appends a user-display with the correct data to the tab for every user that needs to be displayed
    for (let i = 0; i < userList.length; i++) {
        $(tab).append(generateUserDisplay(userList[i]));
    }
}

/** function for generating a user display */
function generateUserDisplay(currentUser) {

    let userId = currentUser["userId"];

    let userDisplay = document.createElement("div");
    userDisplay.className = "user-display";
    userDisplay.setAttribute("id", "user-display-" + userId);

    let username = currentUser["username"] === "" ? "username" : currentUser["username"];
    let url = "https://dev-is111-1.fys.cloud/uploads/profile-pictures/" + currentUser["pictureUrl"];
    let location = currentUser["destination"] === "" ? "location" : currentUser["destination"];

    //start and end date
    //todo: fix the displaying of dates
    let date = new Date(currentUser["startdate"]);
    const startDate = currentUser["startdate"] === "" ? "start date" : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    let date2 = new Date(currentUser["enddate"]);
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

var overlayTranslations = {
    overlay: {
        button: {
            send: {
                nl: "Verstuur Vriendenverzoek",
                en: "Send Friend Request"
            },
            sent: {
                nl: "Vriendenverzoek Verstuurd",
                en: "Friend Request Sent"
            },
            accept: {
                nl: "Accepteer Vriendenverzoek",
                en: "Accept Friend Request"
            },
        }
    }
};
FYSCloud.Localization.CustomTranslations.addTranslationJSON(overlayTranslations);

/** function for opening the overlay with the correct user data*/
async function openUserOverlay (overlayUserId) {
    let overlayUserData = await getDataByPromise(`SELECT p.*, u.username, u.id FROM fys_is111_1_dev.profile p
    INNER JOIN fys_is111_1_dev.user u ON p.userId = u.id
    WHERE u.id = ?`, overlayUserId);

    console.log(overlayUserData)

    let overlayUserInterestsIds = await getDataByPromise("SELECT * FROM fys_is111_1_dev.userinterest WHERE userId = ?", overlayUserId);

    //setting the data from the user and profile tables for in the overlay
    let url = "https://dev-is111-1.fys.cloud/uploads/profile-pictures/" + overlayUserData[0]["pictureUrl"]
    let fullName = overlayUserData[0]["firstname"] + " " + overlayUserData[0]["lastname"];

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

    //determine what kind of request button we want to show the user,
    // (0 = send request,1 = request sent,2 = accept request)
    let matchingFriend = await getDataByPromise(`SELECT *
                      FROM friendrequest
                      WHERE (targetUser = ? AND requestingUser = ?) OR (targetUser = ? AND requestingUser = ?) 
                      `,[getCurrentUserID(),overlayUserId,overlayUserId,getCurrentUserID()]);


    let requestButton = $("#send-request-button");
    requestButton.attr("disabled",false);
    requestButton.unbind();
    requestButton.css('opacity', '1');
    requestButton.hover( function() { $(this).css("background-color","var(--color-corendon-dark-red)");
        }, function() { $(this).css("background-color","");}
    );

    if(matchingFriend[0] != null) {
        if (matchingFriend[0]["requestingUser"] === parseInt(getCurrentUserID())) { //We already send the request
            disableRequestButton();
        } else if (matchingFriend[0]["targetUser"] === parseInt(getCurrentUserID())) { //We got a request
            requestButton.attr("data-translate", "overlay.button.accept");
            requestButton.click(acceptRequest());
        }
    } else {
        requestButton.attr("data-translate","overlay.button.send");
        requestButton.click(function (){sendRequest(overlayUserId)});
    }

    FYSCloud.Localization.translate(false);
    $("#profile-button").click(function (){redirectToProfileById(overlayUserId)});
    //function to redirect the user to the profilepage
}

function disableRequestButton(){
    let requestButton = $("#send-request-button");
    requestButton.hover();
    requestButton.css('opacity', '0.6');
    requestButton.attr("disabled", true);
    requestButton.attr("data-translate", "overlay.button.sent");
    FYSCloud.Localization.translate(false);
}

function acceptRequest(userIdToAccept){

}

function sendRequest(userIdToSend){
    let currentUsedID = getCurrentUserID();
    getDataByPromise(`INSERT INTO friendrequest (requestingUser, targetUser)
                      VALUES (${currentUsedID},${userIdToSend});
                      INSERT INTO usernotification (requestingUser, targetUser)
                      VALUES (${currentUsedID},${userIdToSend});`).then((data) => {
        console.log(data);
    });
    disableRequestButton();
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

/** Filters */
var currentDistanceFilterAmount;
function setTravelFilter(element) {
    let distanceAmount = $(element).data("distance");
    if(currentDistanceFilterAmount === distanceAmount)
        return;
    $(".filter-option-distance").removeAttr("current");
    $(element).attr("current", "");
    currentDistanceFilterAmount = distanceAmount;

    //todo: apply filter.
}

var currentBuddyFilterID;
function setBuddyFilter(element) {
    let buddyIndex = $(element).data("buddy");
    if(currentBuddyFilterID === buddyIndex)
        return;
    $(".filter-option-buddy").removeAttr("current");
    $(element).attr("current", "");
    currentBuddyFilterID = buddyIndex;

    //todo: apply filter.
}

function resetFilters(){
    //remove all current attributes from options
    $(".filter-option-buddy").removeAttr("current");
    $(".filter-option-distance").removeAttr("current");
    //set the default buddy option.
    let buddyDefault = $("#filter-option-buddy-default");
    currentBuddyFilterID = buddyDefault.data("buddy");
    buddyDefault.attr("current","");
    //set the defualt distance option.
    let distanceDefault = $("#filter-option-distance-default");
    currentDistanceFilterAmount = buddyDefault.data("distance");
    distanceDefault.attr("current","");
}
