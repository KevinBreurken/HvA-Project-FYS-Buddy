var headerTranslations = {
    header: {
        navigation: {
            home: {
                nl: "Home",
                en: "Home"
            },
            profile: {
                nl: "Profiel",
                en: "Profile"
            },
            settings: {
                nl: "Instellingen",
                en: "Settings"
            },
            help: {
                nl: "Help",
                en: "Help"
            }
        },
        adminNavigation: {
            account: {
                nl: "Account",
                en: "Account"
            },
            overview: {
                nl: "Data Overzicht",
                en: "Data Overview"
            },
            statistics: {
                nl: "Statistieken",
                en: "Statistics"
            }
        },
        notificationText: {
            nl: "%name Heeft een contactverzoek verstuurd.",
            en: "%name Has sent a contact request."
        },
        userDisplay: {
            welcomeText: {
                nl: "Welkom,",
                en: "Welcome,"
            },
            signOut: {
                nl: "Uitloggen",
                en: "Log out"
            }
        }
    }
};

function onHeaderLoaded() {
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
        if (data.length !== 0)
            $('#profile-display-name').html(data[0]["firstName"]);
    }).fail(function (reason) {
        console.log(reason);
    });

    FYSCloud.Localization.Buddy.addTranslationJSON(headerTranslations);
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
    const itemList = $('.main-menu-items');
    itemList.empty();

    for (let i = 0; i < newButtons.length; i++) {
        //Add the homepage icon to the first item only.
        const homeImageHTML = i == 0 ? `<img class="main-menu-home-icon"
        src="Content/Images/home-icon.png">` : '';
        //Create the list item.
        $(itemList).append(`<li><a class="main-menu-buttons" data-translate="${newButtons[i][2]}" href="${newButtons[i][1]}
        " type="${newButtons[i][0]}">${homeImageHTML}${newButtons[i][0]}</a></li>`);
    }

    updateMenuButtons();
}

$(function () {
    onHeaderLoaded();
});

function openProfile(userID) {
    //TODO:Open profile to correct profile.
    window.open("profile2.html", "_self");
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
    let displayString = FYSCloud.Localization.Buddy.getStringFromTranslations("header.notificationText");
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
    let displayString = FYSCloud.Localization.Buddy.getStringFromTranslations("header.notificationText");
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
        receivedNotificationUsers = userData;
        currentNotificationAmount = userData.length;
        updateNotificationCounter();
        for (let i = 0; i < userData.length; i++) {
            $("#notification-display-list").append(addNotification(userData[i]));
        }
        //translate the newly added objects.
        FYSCloud.Localization.translate(true);
    }).fail(function (reason) {
        console.log(reason);
    });

}).fail(function (reason) {
    console.log(reason);
});
