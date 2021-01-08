/**
 * Check whether the page is currently accessed by a Admin Profile.
 */
let isOnAdminProfile = false;
/**
 * name of the current menu. ex: 'home/statistics'.
 */
let currentMenuType = 'home';
/**
 * Check whether the navigation is visible on the screen.
 */
let isNavigationVisible = true;

const generalElement = document.getElementById("general");
if (generalElement !== null) {
    currentMenuType = generalElement.getAttribute("data-type");
    isOnAdminProfile = generalElement.hasAttribute("data-nav-admin");
    isNavigationVisible = generalElement.hasAttribute("data-nav-visible");
}

$(function () {
    onHeaderLoaded();
});

function onHeaderLoaded() {
    //sets the profile page url
    $("#profile-link").click(function () {
        redirectToProfileById(getCurrentUserID())
    });

    setNavigationVisibility(isNavigationVisible);
    if (isNavigationVisible) {
        //changes the nav if it's displayed on a admin page
        if (isOnAdminProfile)
            overrideMenuButtons([["account", "admin-profile.html", "header.adminNavigation.account"],
                ["overview data", "admin-panel.html", "header.adminNavigation.overview"],
                ["statistics", "admin-statistics.html", "header.adminNavigation.statistics"]]);

        updateMenuButtons();
    }

    if (getCurrentUserID() !== undefined)
        FYSCloud.API.queryDatabase(
            "SELECT * FROM user WHERE id = ?", [getCurrentUserID()]
        ).done(function (data) {
            if (data.length !== undefined)
                $('#profile-display-name').html(data[0]["username"]);
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
        if (currentMenuType === $(this).attr("type")) {
            if ($(this).attr("type") === "home") {
                $("#home-nav-element").attr("current", "");
            } else {
                $(this).attr("current", "");
            }
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

    for (let i = newButtons.length - 1; i >= 0; i--) {
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

/** closes the notification and deletes it from the database */
function closeNotification(userID) {
    //Remove the html element.
    $("#notification-user-" + userID).remove();

    //removes the notification from the database
    FYSCloud.API.queryDatabase(
        "DELETE FROM usernotification WHERE targetUser = ? AND requestingUser = ?", [getCurrentUserID(), userID]
    ).fail(reason => console.log(reason));

    // Decrease and update the notification counter.
    currentNotificationAmount--;
    updateNotificationCounter();
}

function addNotification(userData) {
    // console.log(userData)
    //userData = de data van 1 user
    let userID = userData["id"];
    let username = userData["username"];
    // console.log(username)

    let displayString = CustomTranslation.getStringFromTranslations("header.notificationText").replace("%name", username);
    displayString = displayString.replace("%name", username);

    return `
    <li class="notification-display-content-item" id='notification-user-${userID}'>
        <div class="notification-text">
        <div class="notificatione-text-nam" username="${username}">${displayString}</div>
        </div>
        <div class="notification-buttons">
        <img class="notification-profile-icon" src="Content/Images/user-notification.png" onclick="redirectToProfileById(${userID})">
        <img class="notification-close-icon" src="Content/Images/close.svg" onclick="closeNotification(${userID})">
        </div>
        </li>
    `;
}

document.addEventListener("languageChangeEvent", function (event) {
    let displayString = CustomTranslation.getStringFromTranslations("header.notificationText");
    $(".notification-text-name").each(function () {
        $(this).html(displayString.replace("%name", $(this).attr("username")));
    });
});

/** Notification - Database connection */
//Fetch user notifications.
if (getCurrentUserID() !== undefined)
    FYSCloud.API.queryDatabase(
        "SELECT * FROM usernotification WHERE targetUser = ?", [getCurrentUserID()]
    ).done(function (notificationData) {

        // returns if there are no notifications to be displayed
        if (notificationData.length <= 0) {
            updateNotificationCounter();
            return;
        }

        let notificationIDs = new Array(notificationData.length);
        for (let i = 0; i < notificationIDs.length; i++) {
            notificationIDs[i] = notificationData[i]["requestingUser"];
        }

        let targetUserArrayString = "(" + notificationIDs.toString() + ")"; //method shown on FYSCloud didn't work.

        //Fetch all the notifications that match all the ID's in arrayString.
        FYSCloud.API.queryDatabase(
            "SELECT * FROM user WHERE id IN " + targetUserArrayString
        ).done(function (userData) {
            // console.log(userData)
            currentNotificationAmount = userData.length;
            updateNotificationCounter();

            $(userData).each(object => $("#notification-display-list").append(addNotification(userData[object])));

            //translate the newly added objects.
            FYSCloud.Localization.translate(false);
        }).fail(function (reason) {
            console.log(reason);
        });

    }).fail(function (reason) {
        console.log(reason);
    });

