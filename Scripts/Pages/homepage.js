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
    document.getElementById("overlay-background").style.display = "block";
}

//function to close the active user-display or overlay
function closeFunction (currentDisplay) {
    document.getElementById(currentDisplay).style.display = "none";
    document.getElementById("overlay-background").style.display = "none";
}

//function to swap the favorites icon
function swapFavoritesIcon (currentIconId, newIconId) {
    document.getElementById(currentIconId).style.display = "none";
    document.getElementById(newIconId).style.display = "";
}

//function that swaps the color of the 'send request' button
function swapColor(button) {
    button.style.backgroundColor = "var(--color-corendon-dark-red)";
}

