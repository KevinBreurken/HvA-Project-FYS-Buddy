//clicks on the 'All results' tab so it's open by default
document.getElementById("default-active").click();

//function to switch the tab and active tab-button
function openTabContent (currentButton) {
    let tabButtons = $(".tab-button");
    let tab = $("#tab");

    //swaps the button colors
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].style.backgroundColor = "";
    }
    currentButton.style.backgroundColor = "#c11905";

    FYSCloud.API.queryDatabase(
        "SELECT * FROM user"
    ).done(function(data) {
        console.log(data);
        tab.html("");
        generatedUserDisplays(tab, data);
    }).fail(function(reason) {
        console.log(reason);
    });
}

//generates user-displays
function generatedUserDisplays(tab, data) {
    let userDisplays = [];
    for (let i = 0; i < data.length; i++) {

        userDisplays[i] = document.createElement("div");
        userDisplays[i].className = "user-display";
        userDisplays[i].setAttribute("id", "user-display-" + i);

        tab.append(userDisplays[i]);

        userDisplays[i].innerHTML =
            "<h1 id=\"user-display-h1-" + i + "\">username" + i + "</h1>" +
            "<img class=\"profile-picture\" src=\"Content/Images/profile-picture-" + (i+1) + ".jpg\">" +
            "<div>" +
            "<p>City, Country</p>" +
            "<p>from dd-mm-yyyy</p>" +
            "<p>until dd-mm-yyyy</p>" +
            "<p>type of buddy</p>" +
            "</div>" +
            "<div class=\"tab-content-column-4\">" +
            "<button id=\"button1-" + i + "\">more info</button>" +
            "<button id=\"button2-" + i + "\">X</button>" +
            "<div id=\"favorite-v1-" + i + "\">" +
            "<img class=\"favorite-icon\" src=\"Content/Images/favorite-v1.png\">" +
            "</div>" +
            "<div id=\"favorite-v2-" + i + "\" style=\"display: none\">" +
            "<img class=\"favorite-icon\" src=\"Content/Images/favorite-v2.png\">" +
            "</div>" +
            "</div>";

        document.getElementById("button1-" + i)
            .onclick = function(){displayOverlay('overlay-1')};
        document.getElementById("button2-" + i)
            .onclick = function (){closeFunction("user-display-" + i)};
        document.getElementById("favorite-v1-" + i)
            .onclick = function (){swapFavoritesIcon("favorite-v1-" + i, "favorite-v2-" + i)};
        document.getElementById("favorite-v2-" + i)
            .onclick = function (){swapFavoritesIcon("favorite-v2-" + i, "favorite-v1-" + i)};
    }
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

