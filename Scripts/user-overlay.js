//include mailer to send email after requests.
$("head").append('<script src="Scripts/mailer.js"></script>');
/**
 * function for opening the overlay with the correct user data
 * @param overlayUserId id of the user that is fetched and displayed from the database.
 */
async function openUserOverlay(overlayUserId) {
    //disables scrolling
    document.body.style.overflow = 'hidden';
    document.querySelector('html').scrollTop = window.scrollY;

    //get user profile.
    let overlayUserData = await getDataByPromise(`SELECT 
       p.*, u.username, 
       u.id
    FROM profile p
    INNER JOIN user u ON p.userId = u.id
    WHERE u.id = ?`, overlayUserId);

    //gets the interestIds of the overlay user
    let overlayUserInterestsIds = await getDataByPromise(`SELECT 
       * 
    FROM userinterest 
    WHERE userId = ?`, overlayUserId);

    //setting the data from the user and profile tables for in the overlay
    let url = `${environment}/uploads/profile-pictures/` + overlayUserData[0]["pictureUrl"]
    let fullName = overlayUserData[0]["firstname"] + " " + overlayUserData[0]["lastname"];

    //putting the data from the user and profile tables in the overlay
    $("#overlay-row-1").html(`<img onerror="this.src='Content/Images/default-profile-picture.png'" src="${url}">`);
    $("#overlay-full-name").html(`${fullName}`);
    $("#overlay-username").html(`a.k.a. ${overlayUserData[0]["username"]}`);
    $("#overlay-bio").html(`${overlayUserData[0]["biography"]}`);
    //putting the interests into the overlay
    $("#overlay-interests-ul").html("");
    $(overlayUserInterestsIds).each(interest => {
        $("#overlay-interests-ul").append(`<li data-translate="interests.${overlayUserInterestsIds[interest]["interestId"]}"></li>`);
    });

    CustomTranslation.translate(false);

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
            requestButton.click(function (){acceptRequest(getCurrentUserID(),overlayUserId)});
        }
    } else {
        requestButton.attr("data-translate", "overlay.button.send");
        requestButton.click(function () {sendRequest(getCurrentUserID(),overlayUserId)});
    }
    CustomTranslation.translate(false);
    $("#profile-button").click(function () {redirectToProfileById(overlayUserId)});
}

function disableRequestButton() {
    let requestButton = $("#send-request-button");
    requestButton.hover();
    requestButton.css('opacity', '0.6');
    requestButton.attr("disabled", true);
    requestButton.attr("data-translate", "overlay.button.sent");
}

function acceptRequest(acceptedUser,userIdToAccept) {
    getDataByPromise(`DELETE FROM friendrequest
                      WHERE (targetUser = ${acceptedUser} AND requestingUser = ${userIdToAccept})
                         OR (targetUser = ${userIdToAccept} AND requestingUser = ${acceptedUser});
                      DELETE FROM usernotification
                      WHERE (targetUser = ${acceptedUser} AND requestingUser = ${userIdToAccept})
                         OR (targetUser = ${userIdToAccept} AND requestingUser = ${acceptedUser});
                      INSERT INTO friend (user1, user2)
                      VALUES (${acceptedUser},${userIdToAccept});
    `).then((data) => sendFriendMatchData(userIdToAccept));
    //Remove display from tab.
    $(`#user-display-${userIdToAccept}`).remove();
    sendFriendEmail(userIdToAccept,'accept');
    closeUserOverlay();
}

async function sendFriendMatchData(userIdToAccept){
    //Get current user travel destination.
    const CURRENT_USER = await getDataByPromise(`SELECT *
    FROM travel WHERE id = ?`, getCurrentUserID());
    //Send the location that we currently have to the database.
    await getDataByPromise(`INSERT INTO adminlocationdata (locationId, destinationEverMatched)
                            VALUES (?, 1)
                            ON DUPLICATE KEY UPDATE destinationEverMatched = destinationEverMatched + 1`, CURRENT_USER[0]["locationId"]);
    //Check which interests are equal.
    const userInterests = await getDataByPromise(`SELECT * FROM userinterest WHERE userId = ?`,getCurrentUserID());
    const otherUserInterest = await getDataByPromise(`SELECT * FROM userinterest WHERE userId = ?`,userIdToAccept);
    $(userInterests).each(uInterest => {
        $(otherUserInterest).each(oInterest => {
            if(userInterests[uInterest]["interestId"] === otherUserInterest[oInterest]["interestId"])
                //Send statistic data for interests.
                getDataByPromise(`INSERT INTO admininterestdata (interestId, interestEverMatched)
                                  VALUES (?, 1)
                                  ON DUPLICATE KEY UPDATE interestEverMatched = interestEverMatched + 1`, userInterests[uInterest]["interestId"]);
        });
    });
}

function sendRequest(sentUser,userIdToSend) {
    getDataByPromise(`INSERT INTO friendrequest (requestingUser, targetUser)
                      VALUES (${sentUser},${userIdToSend});
                      INSERT INTO usernotification (requestingUser, targetUser)
                      VALUES (${sentUser},${userIdToSend});`).then((data) => {
    });

    sendFriendEmail(userIdToSend,'request');
    disableRequestButton();
}
/** function for opening the overlay */
function displayUserOverlay() {
    $("#overlay").css("display", "flex");
    $("#overlay-background").css("display", "block");
}

/** function for closing the overlay */
function closeUserOverlay(){
    document.body.style.overflow = null;
    $("#overlay").css("display", "none");
    $("#overlay-background").css("display", "none");
}