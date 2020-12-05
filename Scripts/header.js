$(function () {
    onHeaderLoaded();
});

function onHeaderLoaded() {
    //sets the profile page url
    $("#profile-link").click(function (){redirectToProfileById(getCurrentUserID())});
    
    setNavigationVisibility(isNavigationVisible);
    if (isNavigationVisible) {
        if (isOnAdminProfile)
            overrideMenuButtons([["account", "admin-profile.html", "header.adminNavigation.account"],
                ["overview data", "admin-panel.html", "header.adminNavigation.overview"],
                ["statistics", "admin-statistics.html", "header.adminNavigation.statistics"]]);

        updateMenuButtons();
    }

    FYSCloud.API.queryDatabase(
        "SELECT * FROM user WHERE userID = ?",
        [getCurrentUserID()]
    ).done(function (data) {
        if (data.length !== undefined)
            $('#profile-display-name').html(data[0]["firstName"]);
    }).fail(function (reason) {
        console.log(reason);
    });

    document.dispatchEvent(new CustomEvent("headerLoadedEvent"));
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
    const itemList = $('.nav-button');
    itemList.remove();
    $('#notification-display').remove();

    for (let i = newButtons.length -1; i >= 0; i--) {
        //Add the homepage icon to the first item only.
        const homeImageHTML = i == 0 ? `<img class="main-menu-home-icon"
        src="Content/Images/home-icon.png">` : '';
        const btn = newButtons[i];
        //Create the list item.
        $(".main-menu-items").prepend(`
            <li><a class="main-menu-buttons" data-translate="${btn[2]}" href="${btn[1]}" type="${btn[0]}">${homeImageHTML}${btn[0]}</a>
        </li>`);
    }
    updateMenuButtons();
}

/** Notifications */
var currentNotificationAmount = 0;

function updateNotificationCounter() {
    //Only show +9 when notifications are above 10.
    let amountDisplayString = (currentNotificationAmount > 9) ? "9+" : currentNotificationAmount;
    $("#notification-display-counter-text").html(amountDisplayString);
    if (currentNotificationAmount === 0) {
        //hide the whole notification counter when no notification is available.
        $(".notification-display-dropdown").parent().hide();
    }
}

function closeNotification(userID) {
    //Remove the html element.
    $("#notification-user-" + userID).remove();
    // Decrease and update the notification counter.
    currentNotificationAmount--;
    updateNotificationCounter();
    //TODO:Remove database entry of notification.
}

function addNotification(userData) {
    let userID = userData["userID"];
    let displayString = FYSCloud.Localization.CustomTranslations.getStringFromTranslations("header.notificationText");
    displayString = displayString.replace("%name", userData["firstName"]);

    return `
    <li class="notification-display-content-item" id='notification-user-${userID}'>
        <div class="notification-text">
        <div class="notification-text-name" name-user="${userData["firstName"]}">${displayString}</div>
        </div>
        <div class="notification-buttons">
        <img class="notification-profile-icon" src="Content/Images/open-profile.svg" onclick="openProfile(${userID})">
        <img class="notification-close-icon" src="Content/Images/close.svg" onclick="closeNotification(${userID})">
        </div>
        </li>
    `;
}

document.addEventListener("languageChangeEvent", function (event) {
    let displayString = FYSCloud.Localization.CustomTranslations.getStringFromTranslations("header.notificationText");
    $(".notification-text-name").each(function() {
        $(this).html(displayString.replace("%name", $(this).attr("name-user")));
    });
});

/** Notification - Database connection */
//Fetch user notifications.
FYSCloud.API.queryDatabase(
    "SELECT * FROM notifications WHERE userID = ?",
    [getCurrentUserID()] //TODO: add the logged in user ID to fetch it's own notifications.
).done(function (notificationData) {
    if (notificationData.length <= 0) {
        updateNotificationCounter();
        return;
    }

    let notificationIDs = [notificationData.length];
    for (let i = 0; i < notificationData.length; i++) {
        notificationIDs[i] = notificationData[i]["sentUserID"];
    }
    let arrayString = "(" + notificationIDs.toString() + ")"; //method shown on FYSCloud didn't work.

    //Fetch all the notifications that match all the ID's in arrayString.
    FYSCloud.API.queryDatabase(
        "SELECT * FROM user WHERE userID IN " + arrayString
    ).done(function (userData) {
        currentNotificationAmount = userData.length;
        updateNotificationCounter();
        for (let i = 0; i < userData.length; i++) {
            $("#notification-display-list").append(addNotification(userData[i]));
        }
        //translate the newly added objects.
        FYSCloud.Localization.translate(false);
    }).fail(function (reason) {
        console.log(reason);
    });

}).fail(function (reason) {
    console.log(reason);
});

