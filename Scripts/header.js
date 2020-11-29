function onHeaderLoaded() {
    setNavigationVisibility(isNavigationVisible);
    if (isNavigationVisible) {
        if (isOnAdminProfile)
            overrideMenuButtons([["account", "admin-profile.html"], ["overview data", "admin-panel.html"], ["statistics", "admin-statistics.html"]]);

        updateMenuButtons();
    }

    //For testing purposes
    //Randomise Account name.
    const testNames = [
        'Irene',
        'Hanna',
        'Kiet',
        'Dylan',
        'Kevin',
        'Barry',
        'Anthonius',
        'Bernardus',
        'Gijsbertinandus'
    ];
    const preText = 'Welcome, ';
    $('.profile-display-text').html(preText + testNames[Math.floor(Math.random() * testNames.length)]);

}

/**
 * Updates the button menu's 'current' attributes.
 * @param {string} typeName name of the menu button's type attribute.
 */
function updateMenuButtons() {
    //Get every main menu button
    $('.main-menu-buttons').each(function (i, obj) {
        if (currentMenuType == $(this).attr("type")) {
            $(this).attr("current", "");
            return;
        }
    });
}

function setNavigationVisibility(state) {
    $('.main-menu-buttons').toggle(state);
    if (state === false)
        $('.main-menu').empty();
}

/**
 * Deletes the current menu and changes to a new set.
 * @param {array} newButtons data for the new buttons.
 */
function overrideMenuButtons(newButtons) {
    //remove all menu buttons.
    const itemList = $('.main-menu-items');
    itemList.empty();

    for (let i = 0; i < newButtons.length; i++) {
        //Add the homepage icon to the first item only.
        const homeImageHTML = i == 0 ? `<img class="main-menu-home-icon"
        src="Content/Images/home-icon.png">` : '';
        //Create the list item.
        $(itemList).append(`<li><a class="main-menu-buttons" href="${newButtons[i][1]}
        " type="${newButtons[i][0]}">${homeImageHTML}${newButtons[i][0]}</a></li>`);
    }

    updateMenuButtons();
}

$(function () {
    onHeaderLoaded();
});

//Fetch user notifications.
FYSCloud.API.queryDatabase(
    "SELECT * FROM notifications WHERE userID = ?",
    [1] //TODO: add the logged in user ID to fetch it's own notifications.
).done(function (notificationData) {

    let notificationIDs = [notificationData.length];
    for (let i = 0; i < notificationData.length; i++) {
        notificationIDs[i] = notificationData[i]["sentUserID"];
    }

    let string = "(" + notificationIDs.toString() + ")";
    FYSCloud.API.queryDatabase(
        "SELECT * FROM user WHERE userID IN " + string
    ).done(function (userData) {
        let amountDisplayString = (userData.length > 9) ? "9+" : userData.length;
        $("#notification-display-counter-text").html(amountDisplayString);

        for (let i = 0; i < userData.length; i++) {
            // $("#notification-display-list").append(addNotification(userData[i]));
        }
        console.log(userData);
    }).fail(function (reason) {
        console.log(reason);
    });

}).fail(function (reason) {
    console.log(reason);
});

function addNotification(userData) {

    let userID = userData["userID"];
    //TODO: Change notification language.
    let notificationText = userData["firstName"] + " heeft een contactverzoek gestuurd.";
    return "<li class=\"notification-display-content-item\" id='notification-user-"+userID+"'>" +
        "<div class=\"notification-text\">" + notificationText + "</div>" +
        "<div class=\"notification-buttons\">" +
        "<img class=\"notification-profile-icon\" src=\"Content/Images/open-profile.svg\" onclick=\"openProfile(" + userID + ")\">" +
        "<img class=\"notification-close-icon\" src=\"Content/Images/close.svg\" onclick=\"closeNotification(" + userID + ")\">" +
        "</div>" +
        "</li>";
}

function openProfile(userID) {
    //TODO:Open profile to correct profile.
    window.open("profile2.html","_self");
}

function closeNotification(userID) {
    //Remove the html element.
    $("#notification-user-"+userID).remove();
    //TODO:Remove database entry of notification.
}