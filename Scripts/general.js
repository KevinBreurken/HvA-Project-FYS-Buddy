/**
 * Check whether the page is currently accessed by a Admin Profile.
 */
var isOnAdminProfile = false;
/**
 * name of the current menu. ex: 'home/statistics'.
 */
var currentMenuType = 'home';
/**
 * Check whether the navigation is visible on the screen.
 */
var isNavigationVisible = true;

//add the general stylesheet to the page's header.
$('head').append('<link rel="stylesheet" type="text/css" href="Content/general.css">');
//add the fyscloud to the page's header.
$('head').append('<script src="https://cdn.fys.cloud/fyscloud/0.0.3/fyscloud.min.js"></script>');
//add the favicon to the page's header.
$('head').append(`<link rel='shortcut icon' type='image/x-icon' href='Content/Images/favicon.ico'/>`);

$(document).ready(function () {
    //Add the header to the start of the body.
    var headerElement = document.createElement('header');
    document.body.insertBefore(headerElement, document.body.firstChild);
    $('header').load("Includes/general-header.html", onHeaderLoaded);

    //Add the footer to the end of the body.
    var footerElement = document.createElement('footer');
    document.body.appendChild(footerElement);
    $('footer').load("Includes/general-footer.html");
});

function onHeaderLoaded() {
    setNavigationVisibility(isNavigationVisible);
    if (isNavigationVisible) {
        if (isOnAdminProfile)
            overrideMenuButtons([["account", "admin-profile.html"], ["overview data", "admin-users.html"], ["statistics", "admin-statistics.html"]]);

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
        const homeImageHTML = i == 0 ? '<img src="Image/home-icon.png">' : '';
        //Create the list item.
        $(itemList).append(`<li><a class="main-menu-buttons" href="${newButtons[i][1]}
        " type="${newButtons[i][0]}">${homeImageHTML}${newButtons[i][0]}</a></li>`);
    }

    updateMenuButtons();
}