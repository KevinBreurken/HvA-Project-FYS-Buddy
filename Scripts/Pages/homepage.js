//clicks on the 'All results' tab so it's open by default
document.getElementById("default-active").click();

//function to switch the tab and active tab-button
function openTabContent (currentButton) {
    var tabButtons = $(".tab-button");
    var tabContent = $("#tab-content");

    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].style.backgroundColor = "";
    }
    currentButton.style.backgroundColor = "#c11905";

    FYSCloud.API.queryDatabase(
        "SELECT * FROM user"
    ).done(function(data) {
        // console.log(data);
        $.get("Views/user-display.html", function (htmlData) {
            tabContent.html("");
            for (let i = 0; i < data.length; i++) {
                tabContent.append($(htmlData));
            }
        });
    }).fail(function(reason) {
        console.log(reason);
    });
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

