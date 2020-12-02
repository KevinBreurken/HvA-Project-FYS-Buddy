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
        tab.html("");
        generateUserDisplays(tab, data);
    }).fail(function(reason) {
        console.log(reason);
    });
}

//generates user-displays
function generateUserDisplays(tab, data) {
    let userDisplays = [];
    for (let i = 0; i < data.length; i++) {

        userDisplays[i] = document.createElement("div");
        userDisplays[i].className = "user-display";
        userDisplays[i].setAttribute("id", "user-display-" + i);

        tab.append(userDisplays[i]);

        //getting data
        let userData = data[i];

        //username
        let username = userData.username == null ? "username" : userData.username;

        //profile pic
        let userUrl = userData.url;

        //location
        let location = userData.location == null ? "City, Country" : userData.location;

        //start date
        let date = new Date(userData.startDate);
        let startDate = userData.startDate == null
            ? " " : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        //end date
        date = new Date(userData.endDate);
        let endDate = userData.endDate == null
            ? " " : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        //type of buddy
        let buddy;
        if (userData.travelBuddy === 1 && userData.activityBuddy === 1) {
            buddy = "a buddy";
        } else if (userData.travelBuddy === 1 && !(userData.activityBuddy === 1)) {
            buddy = "a travel buddy";
        } else if (!(userData.travelBuddy === 1) && userData.activityBuddy === 1) {
            buddy = "an activity buddy";
        } else {
            buddy = " a buddy";
        }

        userDisplays[i].innerHTML =
            `<h1 id=user-display-h1-${i}>${username}</h1>
            <img class="profile-picture" src="${userUrl}">
            <div>
            <p>${location}</p>
            <p>from ${startDate}</p>
            <p>until ${endDate}</p>
            <p>${buddy}</p>
            </div>
            <div class="tab-content-column-4">
            <button id="button1-${i}" onclick="displayOverlay('overlay')">more info</button>
            <button id="button2-${i}" onclick="closeFunction('user-display-${i}')">X</button>
            <div id="favorite-v1-${i}" onclick="swapFavoritesIcon('favorite-v1-${i}','favorite-v2-${i}')">
            <img class="favorite-icon" src="Content/Images/favorite-v1.png">
            </div>
            <div id="favorite-v2-${i}" style="display: none" onclick="swapFavoritesIcon('favorite-v2-${i}','favorite-v1-${i}')">
            <img class="favorite-icon" src="Content/Images/favorite-v2.png">
            </div>
            </div>
            </div>`;
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

// //function that swaps the color of the 'send request' button
// function swapColor(button) {
//     button.style.backgroundColor = "var(--color-corendon-dark-red)";
// }

