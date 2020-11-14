//clicks on the 'All results' tab so it's open by default
document.getElementById("default-active").click();

//function to switch the tab and active tab-button
function openTabContent (currentTab, currentButton) {
    var tabButton = document.getElementsByClassName("tab-button");
    var tabContent = document.getElementsByClassName("tab-content");

    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    document.getElementById(currentTab).style.display = "flex";

    for (let i = 0; i < tabButton.length; i++) {
        tabButton[i].style.backgroundColor = "";
    }
    currentButton.style.backgroundColor = "#c11905";
}

//displays the current overlay and the overlay-background
function displayOverlay (overlayId) {
    document.getElementById(overlayId).style.display = "flex";
    var overlayBackground = document.getElementById("overlay-background")
    overlayBackground.style.display = "block";
}

//function to close the active user-display or overlay
function closeFunction (currentDisplay) {
    document.getElementById(currentDisplay).style.display = "none";
    document.getElementById("overlay-background").style.display = "none";
}

//function to swap the favorites icon
function swapFavoritesIcon (currentIconId, newIconId) {
    var currentIcon = document.getElementById(currentIconId);
    var newIcon = document.getElementById(newIconId);
    currentIcon.style.display = "none";
    newIcon.style.display = "";
}

// //function to display the filters
// function openFilters () {
//     var overlayToOpen = document.getElementById('filter-dropdown');
//     overlayToOpen.style.display = "flex";
// }
//
// function closeFilters () {
//     var overlayToClose = document.getElementById('filter-dropdown');
//     overlayToClose.style.display = "none";
// }
