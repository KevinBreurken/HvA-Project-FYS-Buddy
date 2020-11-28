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
        generatedUserDisplay(tab, data);
    }).fail(function(reason) {
        console.log(reason);
    });
}

//generates user-displays
function generatedUserDisplay(tab, data) {
    let userDisplays = [];
    for (let i = 0; i < data.length; i++) {

        userDisplays[i] = document.createElement("div");
        userDisplays[i].className = "user-display";
        userDisplays[i].setAttribute("id", "user-display-" + i);
        tab.append(userDisplays[i]);

        let userdisplayH1 = document.createElement("h1");
        userdisplayH1.innerText = "username" + i;
        let userdisplayImg1 = document.createElement("img");
        userdisplayImg1.className = "profile-picture";
        userdisplayImg1.src = "Content/Images/profile-picture-1.jpg";
        let userdisplayDiv1 = document.createElement("div");
        let userdisplayDiv2 = document.createElement("div");
        userdisplayDiv2.className = "tab-content-column-4";
        userDisplays[i].append(userdisplayH1, userdisplayImg1, userdisplayDiv1, userdisplayDiv2);

        let userDisplayP1 = document.createElement("p");
        userDisplayP1.innerText = "City, Country";
        let userDisplayP2 = document.createElement("p");
        userDisplayP2.innerText = "from date";
        let userDisplayP3 = document.createElement("p");
        userDisplayP3.innerText = "until date";
        let userDisplayP4 = document.createElement("p");
        userDisplayP4.innerText = "type of buddy";
        userdisplayDiv1.append(userDisplayP1, userDisplayP2, userDisplayP3, userDisplayP4);

        let userDisplayButton1 = document.createElement("button");
        userDisplayButton1.setAttribute("id", "button1-" + i);
        userDisplayButton1.innerText = "more info";

        let userDisplayButton2 = document.createElement("button");
        userDisplayButton2.setAttribute("id", "button2-" + i);
        userDisplayButton2.innerText = "X";

        let userDisplayDiv3 = document.createElement("div");
        userDisplayDiv3.setAttribute("id", "favorite-v1-" + i);

        let userDisplayDiv4 = document.createElement("div");
        userDisplayDiv4.setAttribute("id", "favorite-v2-" + i);

        userdisplayDiv2.append(userDisplayButton1, userDisplayButton2, userDisplayDiv3, userDisplayDiv4);

        let userDisplayImg2 = document.createElement("img");
        userDisplayImg2.className = "favorite-icon";
        userDisplayImg2.src = "Content/Images/favorite-v1.png";
        userDisplayDiv3.append(userDisplayImg2);
        let userDisplayImg3 = document.createElement("img");
        userDisplayImg3.className = "favorite-icon";
        userDisplayImg3.style.display = "none";
        userDisplayImg3.src = "Content/Images/favorite-v2.png";
        userDisplayDiv4.append(userDisplayImg3);

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

