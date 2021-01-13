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

    //determine what kind of request button we want to show the user,
    let matchingFriend = await getDataByPromise(`SELECT *
    FROM friendrequest
    WHERE (targetUser = ? AND requestingUser = ?)
    OR (targetUser = ? AND requestingUser = ?)
    `, [getCurrentUserID(), overlayUserId, overlayUserId, getCurrentUserID()]);

    //Reset button style elements.
    let requestButton = $("#send-request-button");
    requestButton.show();
    requestButton.attr("disabled", false);
    requestButton.unbind();
    requestButton.css('opacity', '1');
    requestButton.hover(function () { $(this).css("background-color", "var(--color-corendon-dark-red)");
    }, function () { $(this).css("background-color", "");} );

    let declineButton = $("#decline-request-button");
    declineButton.hide();
    declineButton.hover(function () { $(this).css("background-color", "var(--color-corendon-dark-red)");
    }, function () { $(this).css("background-color", "");} );

    if (matchingFriend[0] != null) {
        if (matchingFriend[0]["requestingUser"] === parseInt(getCurrentUserID())) { //We already send the request
            disableRequestButton();
        } else if (matchingFriend[0]["targetUser"] === parseInt(getCurrentUserID())) { //We got a request
            requestButton.attr("data-translate", "overlay.button.accept");
            requestButton.click(function (){acceptRequest(getCurrentUserID(),overlayUserId)});
            declineButton.show();
        }
    } else {
        requestButton.attr("data-translate", "overlay.button.send");
        requestButton.click(function () {sendRequest(getCurrentUserID(),overlayUserId)});
    }

    await getDataByPromise(`SELECT *
    FROM friend
    WHERE (user1 = ? AND user2 = ?)
    OR (user2 = ? AND user1 = ?)
    `, [getCurrentUserID(), overlayUserId, overlayUserId, getCurrentUserID()]).then((data) =>{

        if(data.length > 0)
        requestButton.hide();
    });

    // adds a onclick function to the overlay to redirect the user to the correct profile
    $("#profile-button").click(function () {redirectToProfileById(overlayUserId)});
    // adds a onclick function to the overlay 'decline request' button
    declineButton.click(function(){declineRequest(overlayUserId, declineButton)});

    CustomTranslation.translate(false);
    //displays the overlay and overlay-background
    displayUserOverlay();
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
    if(CURRENT_USER.length === 0 )
        return;
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

async function declineRequest(overlayUserId, button) {
    //deletes the correct row in the friendrequest table when clicking on the 'decline request' button
    await getDataByPromise(`DELETE FROM friendrequest WHERE targetUser = ? AND requestingUser = ?`,
        [getCurrentUserID(), overlayUserId]);

    closeUserOverlay();
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

/*
Sends an friend type email (request/accepted) to an usedId.
 */
async function sendFriendEmail(idOfRecipient, textPrefix) {
    //Check if this user has any settings
    const recipientSetting = await getDataByPromise('SELECT * FROM setting WHERE userId = ?', idOfRecipient);
    if (recipientSetting.length === 0)
        return;
    //Check if the user wants any notifications.
    if (recipientSetting[0].notifcationId === 0)
        return;
    //Retrieve the language key.
    const userLanguage = await getDataByPromise('SELECT * FROM language WHERE id = ?', recipientSetting[0].languageId);
    //Retrieve user for the e-mail.
    const userData = await getDataByPromise('SELECT * FROM user WHERE id = ?', idOfRecipient);
    //Retrieve profile for the firstName of the recipient
    const profileData = await getDataByPromise('SELECT * FROM profile WHERE userId = ?', idOfRecipient);

    const subject = CustomTranslation.getStringFromTranslations(`mail.${textPrefix}.subject`, userLanguage[0].languageKey);
    const url = window.location.href;

    const html = await generateMailHTML(profileData[0].firstname,textPrefix,url,userLanguage[0].languageKey);
    sendMail(userData[0].email, userName, subject, html);
}