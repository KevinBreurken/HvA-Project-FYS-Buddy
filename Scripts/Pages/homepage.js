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

window.addEventListener('load', function () {
    //clicks on the 'All results' tab so it's open by default
    $("#all-results").click();

    //on page load fire this function that will populate a select list using data from the database
    populateCityList();
})

// let locationList;
// async function getLocation(locationID){
//     if (locationList === undefined)
//         locationList = await getDataByPromise("SELECT * FROM location");
//     for (let i = 0; i < locationList.length; i++) {
//         if(locationList[i].id === locationID)
//             return locationList[i];
//     }
// }
//todo: create different query's;
//1.1 All results todo: gender preference, blocked, display settings
//1.2 Friends
//1.3 Friend requests (ingoing)
//1.4 Favourites

//todo: evt. interests

//todo: filters; distance and buddy type

//todo: set button color depending on if there is an outgoing friend request, the user if friends with the user or no action
//todo: send notification to the other user
//function(s) for setting the status of the 'send friend request' button and sets database data

async function populateCityList() {
    //query the database for all location data using a promise
    let cityList = await getDataByPromise("SELECT * FROM location");

    //for each loop that populates the cityList select options with data from the database
    $(cityList).each(city => {
    $("#cityList").append(`<option value=${cityList[city]["id"]}>` + cityList[city]["destination"] + `</option>`);
    });
}

function sendTravelData() {
    //get current selected value from select element in form
    var citySelect = document.getElementById("cityList").value;
    
    var startDate = new Date($('#sDate').val());
    var endDate = new Date($('#eDate').val());

    startDateFormat = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate()
    endDateFormat = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate()
    
    if(startDateFormat != "" && endDateFormat != "" && citySelect != "") {
        FYSCloud.API.queryDatabase(
            "UPDATE `travel` SET `destination` = ? ,`startdate` = ? ,`enddate` = ? WHERE `userId` = ?;",
            [citySelect, startDateFormat, endDateFormat, getCurrentUserID()]
            ).done(function() {
                alert("updated the destination in travel table succesfull");
            }).fail(function (reason) {
                console.log(reason);
            });
    }else{
        alert("no date selected");
    }
}

/** function to switch the tab content and active tab-button */
async function openTabContent(currentButton) {
    let tab = $("#tab");

    //swaps the button colors
    $(".tab-button").css("backgroundColor", "");
    $(currentButton).css("backgroundColor", "#c11905");

    //resets the filters
    resetFilters();

    //gets the current user's data
    const CURRENT_USER = await getDataByPromise(`SELECT 
       u.id, 
       t.userId, t.destination, t.startdate, t.enddate,
       l.*
    FROM fys_is111_1_dev.user u
    INNER JOIN fys_is111_1_dev.travel t ON u.id = t.userId
    INNER JOIN fys_is111_1_dev.location l ON t.destination = l.id
    WHERE u.id = ?`, getCurrentUserID());

    let queryExtension = ``;
    let queryArray = [];
    let noMatchesMessage = `<p>There are no matches available for you. Try changing your settings or come back later.</p>`
    switch (currentButton.id.toString()) {
        case "all-results":
            queryExtension = ` AND t.startdate < ?
            AND t.enddate > ?
            AND p.userId != ?
            AND (6371 * acos(cos(radians(l.latitude)) * cos(radians(?)) * cos(radians(?) - radians(l.longitude)) + sin(radians(l.latitude)) * sin(radians(?)))) < IFNULL(s.radialDistance, 999999)`;
            queryArray = [CURRENT_USER[0]["enddate"], CURRENT_USER[0]["startdate"], getCurrentUserID(), CURRENT_USER[0]["latitude"], CURRENT_USER[0]["longitude"], CURRENT_USER[0]["latitude"]];
            break;
        case "friends":
            queryExtension = ` AND (fr.user1 = ${CURRENT_USER[0]["userId"]} OR fr.user1 = p.userId) AND (fr.user2 = ${CURRENT_USER[0]["userId"]} OR fr.user2 = p.userId)`;
            noMatchesMessage = `<p>You currently don't have any friends. Try sending some friend requests to other users.</p>`;
            break;
        case "friend-requests":
            queryExtension = ` AND z.requestingUser = p.userId AND z.targetUser = ${CURRENT_USER[0]["userId"]}`;
            noMatchesMessage = `<p>You currently don't have any friend requests. Come back later.</p>`;
            break;
        case "favourites":
            queryExtension = ` AND f.requestingUser = ${CURRENT_USER[0]["userId"]} AND f.favouriteUser = p.userId`;
            noMatchesMessage = `<p>You currently haven't set any users as a favourite. You can do this by clicking on a heart on a user-display </p>`;
            break;
    }

    //gets the data of the relevant users for the current user
    //calculating distance snippet from stackoverflow answer; https://stackoverflow.com/a/48263512
    let userList = await getDataByPromise(`SELECT 
       p.userId, p.pictureUrl, 
       u.username,
       r.roleId, 
       s.radialDistance,
       t.startdate, t.enddate,
       l.*,
       f.favouriteUser
    FROM fys_is111_1_dev.profile p
    INNER JOIN fys_is111_1_dev.user u ON u.id = p.userId
    INNER JOIN fys_is111_1_dev.userrole r ON r.userId = p.userId
    LEFT JOIN fys_is111_1_dev.setting s ON s.userId = p.userId
    INNER JOIN fys_is111_1_dev.travel t ON t.userId = p.userId
    INNER JOIN fys_is111_1_dev.location l ON l.id = t.destination
    LEFT JOIN fys_is111_1_dev.favourite f ON f.requestingUser = ${CURRENT_USER[0]["userId"]} AND f.favouriteUser = p.userId
    LEFT JOIN fys_is111_1_dev.friend fr ON (fr.user1 = ${CURRENT_USER[0]["userId"]} OR fr.user1 = p.userId) AND (fr.user2 = ${CURRENT_USER[0]["userId"]} OR fr.user2 = p.userId)
    LEFT JOIN fys_is111_1_dev.friendrequest z ON (z.requestingUser = p.userId AND z.targetUser = ${CURRENT_USER[0]["userId"]})
    WHERE r.roleId = 1`+ queryExtension
        , queryArray);

    // console.log(userList)

    $(tab).html("");
    if (userList.length !== 0) {
        //appends a user-display with the correct data to the tab for every user that needs to be displayed
        for (let i = 0; i < userList.length; i++) {
            $(tab).append(generateUserDisplay(userList[i]))
        }
    } else {
        //displays a help message whenever there are no matches available to the user
        $(tab).append(noMatchesMessage)
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
    let buddy = currentUser["buddyType"] === "" ? "type of buddy" : currentUser["buddyType"];
    let favouriteVersion = currentUser["favouriteUser"] === null ? 1 : 2;
    
    //start and end date
    //todo: fix the displaying of dates
    let date = new Date(currentUser["startdate"]);
    const startDate = currentUser["startdate"] === "" ? "start date" : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    let date2 = new Date(currentUser["enddate"]);
    const endDate = currentUser["enddate"] === "" ? "end date" : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;


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
            <div id="favourite-v1-${userId}" onclick="setFavourite('${userId}', 'favourite-v1-${userId}',)">
            <img src="Content/Images/favourite-v${favouriteVersion}.png" class="favourite-icon">
            </div>
            </div>
            </div>`;

    return userDisplay;
}

/**
 * function for opening the overlay with the correct user data
 * @param overlayUserId id of the user that is fetched and displayed from the database.
 */
async function openUserOverlay(overlayUserId) {
    //disable scrolling
    document.body.style.overflow = 'hidden';
    document.querySelector('html').scrollTop = window.scrollY;
    //get user profile.
    let overlayUserData = await getDataByPromise(`SELECT p.*, u.username, u.id
                                                  FROM fys_is111_1_dev.profile p
                                                           INNER JOIN fys_is111_1_dev.user u ON p.userId = u.id
                                                  WHERE u.id = ?`, overlayUserId);

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
    displayUserOverlay();

    //determine what kind of request button we want to show the user,
    let matchingFriend = await getDataByPromise(`SELECT *
                                                 FROM friendrequest
                                                 WHERE (targetUser = ? AND requestingUser = ?)
                                                    OR (targetUser = ? AND requestingUser = ?)
    `, [getCurrentUserID(), overlayUserId, overlayUserId, getCurrentUserID()]);

    //Reset button style elements.
    let requestButton = $("#send-request-button");
    requestButton.attr("disabled", false);
    requestButton.unbind();
    requestButton.css('opacity', '1');
    requestButton.hover(function () { $(this).css("background-color", "var(--color-corendon-dark-red)");
        }, function () { $(this).css("background-color", "");} );


    if (matchingFriend[0] != null) {
        if (matchingFriend[0]["requestingUser"] === parseInt(getCurrentUserID())) { //We already send the request
            disableRequestButton();
        } else if (matchingFriend[0]["targetUser"] === parseInt(getCurrentUserID())) { //We got a request
            requestButton.attr("data-translate", "overlay.button.accept");
            requestButton.click(function (){acceptRequest(overlayUserId)});
        }
    } else {
        requestButton.attr("data-translate", "overlay.button.send");
        requestButton.click(function () {sendRequest(getCurrentUserID(),overlayUserId)});
    }

    FYSCloud.Localization.translate(false);
    $("#profile-button").click(function () {
        redirectToProfileById(overlayUserId)
    });
}

function disableRequestButton() {
    let requestButton = $("#send-request-button");
    requestButton.hover();
    requestButton.css('opacity', '0.6');
    requestButton.attr("disabled", true);
    requestButton.attr("data-translate", "overlay.button.sent");
    FYSCloud.Localization.translate(false);
}

function acceptRequest(sentUser,userIdToAccept) {
    getDataByPromise(`DELETE FROM friendrequest
                      WHERE (targetUser = ${sentUser} AND requestingUser = ${userIdToAccept})
                         OR (targetUser = ${userIdToAccept} AND requestingUser = ${sentUser});
                      DELETE FROM usernotification
                      WHERE (targetUser = ${sentUser} AND requestingUser = ${userIdToAccept})
                         OR (targetUser = ${userIdToAccept} AND requestingUser = ${sentUser});
                      INSERT INTO friend (user1, user2)
                      VALUES (${sentUser},${userIdToAccept});
    `);
    //todo: remove element from display tab.
    closeUserOverlay();
}

function sendRequest(sentUser,userIdToSend) {
    getDataByPromise(`INSERT INTO friendrequest (requestingUser, targetUser)
                      VALUES (${sentUser},${userIdToSend});
                      INSERT INTO usernotification (requestingUser, targetUser)
                      VALUES (${sentUser},${userIdToSend});`).then((data) => {
        // console.log(data);
    });
    disableRequestButton();
}

/** function for opening the overlay */
function displayUserOverlay() {
    $("#overlay").css("display", "flex");
    $("#overlay-background").css("display", "block");
}

function closeUserOverlay(){
    document.body.style.overflow = null;
    closeElement("overlay");
}
/** function to close the active user-display or overlay */
function closeElement(currentDisplay) {
    $("#" + currentDisplay).css("display", "none");
    $("#overlay-background").css("display", "none");
}

/** favourites function */
async function setFavourite (userId) {

    let favourite = await getDataByPromise(`SELECT * FROM favourite
    WHERE requestingUser = ? AND favouriteUser = ?`, [getCurrentUserID(), userId]);

    if (favourite["length"] === 0) {
        FYSCloud.API.queryDatabase(
            `INSERT INTO favourite (requestingUser, favouriteUser) VALUES (?, ?)`, [getCurrentUserID(), userId]
        ).done(function () {
            $(`#favourite-v1-${userId}`).html(`<img src="Content/Images/favourite-v2.png" class="favourite-icon">`)
            console.log("added")
        }).fail(function (reason) {
            console.log(reason)
        });
    } else if (favourite["length"] === 1) {
        FYSCloud.API.queryDatabase(
            `DELETE FROM favourite WHERE requestingUser = ? AND favouriteUser = ?`, [getCurrentUserID(), userId]
        ).done(function () {
            $(`#favourite-v1-${userId}`).html(`<img src="Content/Images/favourite-v1.png" class="favourite-icon">`)
            console.log("deleted")
        }).fail(function (reason) {
            console.log(reason)
        })
    }
}

/** Filters */
var currentDistanceFilterAmount;

function setTravelFilter(element) {
    let distanceAmount = $(element).data("distance");
    if (currentDistanceFilterAmount === distanceAmount)
        return;
    $(".filter-option-distance").removeAttr("current");
    $(element).attr("current", "");
    currentDistanceFilterAmount = distanceAmount;

    //todo: apply filter.
}

var currentBuddyFilterID;

function setBuddyFilter(element) {
    let buddyIndex = $(element).data("buddy");
    if (currentBuddyFilterID === buddyIndex)
        return;
    $(".filter-option-buddy").removeAttr("current");
    $(element).attr("current", "");
    currentBuddyFilterID = buddyIndex;

    //todo: apply filter.
}

function resetFilters() {
    //remove all current attributes from options
    $(".filter-option-buddy").removeAttr("current");
    $(".filter-option-distance").removeAttr("current");
    //set the default buddy option.
    let buddyDefault = $("#filter-option-buddy-default");
    currentBuddyFilterID = buddyDefault.data("buddy");
    buddyDefault.attr("current", "");
    //set the defualt distance option.
    let distanceDefault = $("#filter-option-distance-default");
    currentDistanceFilterAmount = buddyDefault.data("distance");
    distanceDefault.attr("current", "");
}
