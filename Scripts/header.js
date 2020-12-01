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
            welcomeText:{
                nl: "Welkom,",
                en: "Welcome,"
            },
            signOut:{
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
        console.log(data);
        $('#profile-display-name').html(data[0]["firstName"]);
    }).fail(function (reason) {
        console.log(reason);
    });

    FYSCloud.Localization.Buddy.addTranslationJSON(headerTranslations);
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