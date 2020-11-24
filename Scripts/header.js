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

    const notificationText = " has sent a contact request";
    // $('.notification-text').html(testNames[Math.floor(Math.random() * testNames.length)] + notificationText);

    $('.notification-text').each(function (index, element) {
        $(this).html(testNames[Math.floor(Math.random() * testNames.length)] + notificationText);
    });

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
    if(state === false)
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
        src="Content/Images/home-icon.png">`: '';
        //Create the list item.
        $(itemList).append(`<li><a class="main-menu-buttons" href="${newButtons[i][1]}
        " type="${newButtons[i][0]}">${homeImageHTML}${newButtons[i][0]}</a></li>`);
    }

    updateMenuButtons();
}

$(function (){
    onHeaderLoaded();
});