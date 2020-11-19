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

let headElement = $('head');
//add the general stylesheet to the page's header.
headElement.append('<link rel="stylesheet" type="text/css" href="Content/CSS/general.css">');
//add the favicon to the page's header.
headElement.append(`<link rel='shortcut icon' type='image/x-icon' href='Content/Images/favicon.ico'/>`);
//add the config file
headElement.append(`<title>Corendon Travel Buddy</title>`);

$.get("Views/general-header.html", function (data) {
    $("body").prepend($(data));
    onHeaderLoaded();
});

// "is a shorthand for : $(document).ready(function() { ... });"
$(function (){

    //Voeg toe aan het einde van de pagina.
    $.get("Views/general-footer.html", function (data){
        $("body").append($(data));
    });

});

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