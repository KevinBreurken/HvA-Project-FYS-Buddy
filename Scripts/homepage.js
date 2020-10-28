//clicks on the 'All results' tab so it's open by default
document.getElementById("default-active").click();

//function to switch the tab and active tab-button
function openTabContent (tabContentName, thisKeyword) {
    var tabButton = document.getElementsByClassName("tab-button");
    var tabContent = document.getElementsByClassName("tab-content");

    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    document.getElementById(tabContentName).style.display = "flex";

    for (var i = 0; i < tabButton.length; i++) {
        tabButton[i].style.backgroundColor = "";
    }
    thisKeyword.style.backgroundColor = "#c11905";
}

//displays the overlay and the overlay background
function displayOverlay (overlayId) {
    document.getElementById(overlayId).style.display = "flex";
    var overlayBackground = document.getElementById("overlay-background")
    overlayBackground.style.display = "block";
}

//function to close user displays or overlays
function closeFunction (currentDisplay) {
    document.getElementById(currentDisplay).style.display = "none";
    var overlayBackground = document.getElementById("overlay-background")
    overlayBackground.style.display = "none";
}

//function to swap the favorites icon
function swapFavoritesIcon (currentIconId, newIconId) {
    var currentIcon = document.getElementById(currentIconId);
    var newIcon = document.getElementById(newIconId);
    currentIcon.style.display = "none";
    newIcon.style.display = "";
}

//function for prototype
function favoritesRemove (currentUserDisplay) {
    var displayToRemove = document.getElementById(currentUserDisplay)
    displayToRemove.style.display = "none";
}