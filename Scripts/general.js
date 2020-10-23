/**
 * Check whether the page is currently accessed by a Admin Profile.
 */
var isOnAdminProfile = false;
/**
 * name of the current menu. ex: 'home/statistics'.
 */
var currentMenuType = 'home';

$(document).ready(function () {
    //add the general stylesheet to the page's header.
    $('head').append('<link rel="stylesheet" type="text/css" href="Content/general.css">');

    //Add the header to the start of the body.
    var headerElement = document.createElement('header');
    document.body.insertBefore(headerElement, document.body.firstChild);
    $('header').load("Includes/general-header.html", function () {

        if (isOnAdminProfile)
            overrideMenuButtons([["account", "#"], ["overview data", "#"], ["statistics", "#"]]);

        updateMenuButtons();
    });

    //Add the footer to the end of the body.
    var footerElement = document.createElement('footer');
    document.body.appendChild(footerElement);
    $('footer').load("Includes/general-footer.html");
});

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