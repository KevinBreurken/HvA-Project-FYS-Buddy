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
            nl: "Heeft een contactverzoek verstuurd.",
            en: "Has sent a contact request."
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

    FYSCloud.Localization.CustomTranslations.addTranslationJSON(headerTranslations);
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

$(function () {
    onHeaderLoaded();
});