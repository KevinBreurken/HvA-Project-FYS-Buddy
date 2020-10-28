document.getElementById("default-active").click();

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

function displayOverlay (overlayId) {
    document.getElementById(overlayId).style.display = "flex";
    var overlayBackground = document.getElementById("overlay-background")
    overlayBackground.style.display = "block";
}

function closeFunction (currentDisplay) {
    document.getElementById(currentDisplay).style.display = "none";
    var overlayBackground = document.getElementById("overlay-background")
    overlayBackground.style.display = "none";
}