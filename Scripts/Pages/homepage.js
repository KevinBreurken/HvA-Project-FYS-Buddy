window.addEventListener('load', function () {
    //clicks on the 'All results' tab so it's open by default
    document.getElementById("default-active").click();
})

//todo: create different query's;
//1.1 All results: all results matching the users location, date and gender preference
//1.2 Friends
//1.3 Friend requests (ingoing)
//1.4 Favorites

//2.1 match only gender
//2.2 filters

//todo: set button color depending on if there is an outgoing friend request, the user if friends with the user or no action
//todo: send notification to the other user
//function(s) for setting the status of the 'send friend request' button and sets database data

//todo: set favorites data in the database when clicking (swap)

/** function to switch the tab and active tab-button */
async function openTabContent (currentButton) {
    //swaps the button colors
    $(".tab-button").css("backgroundColor", "");
    $(currentButton).css("backgroundColor", "#c11905");

    let userList = await getUserData();
    console.log(userList[0])


    $("#tab").html("");
    //todo: use forEach()
    for (let i = 0; i < userList.length; i++) {
        //displayUser() returns a string with all the elements and data for one userDisplay
       $("#tab").append(generateUserDisplay(userList[i]));
    }
}

/** function for getting user data from the database */
function getUserData() {
    return new Promise(userList => {
        FYSCloud.API.queryDatabase(
            "SELECT * FROM user"
        ).done(function(data) {
            userList(data);
        }).fail(function(reason) {
            console.log(reason);
        });
    });
}

/** function for generating a user display */
function generateUserDisplay(currentUser) {
    let userId = currentUser.userId;

    let userDisplay = document.createElement("div");
    userDisplay.className = "user-display";
    userDisplay.setAttribute("id", "user-display-" + userId);

    //todo date
    //todo buddy
    let buddy;

    userDisplay.innerHTML =
        `<h1 id=user-display-h1-${userId}>${currentUser.username}</h1>
            <img class="profile-picture" src="${currentUser.url}">
            <div>
            <p>${currentUser.location}</p>
            <p>from ${currentUser.startDate}</p>
            <p>until ${currentUser.endDate}</p>
            <p>${"buddy"}</p>
            </div>
            <div class="tab-content-column-4">
            <button id="button1-${userId}" onclick="openUserOverlay('${userId}')">more info</button>
            <button id="button2-${userId}" onclick="closeElement('user-display-${userId}')">X</button>
            <div id="favorite-v1-${userId}" onclick="setFavorite('favorite-v1-${userId}','favorite-v2-${userId}')">
            <img class="favorite-icon" src="Content/Images/favorite-v1.png">
            </div>
            <div id="favorite-v2-${userId}" style="display: none" onclick="setFavorite('favorite-v2-${userId}','favorite-v1-${userId}')">
            <img class="favorite-icon" src="Content/Images/favorite-v2.png">
            </div>
            </div>
            </div>`;

    return userDisplay;
}

//displays the current overlay and the overlay-background
function openUserOverlay (currentOverlayUserId) {
    FYSCloud.API.queryDatabase(
        "SELECT * FROM user WHERE userId = ?", [currentOverlayUserId]
    ).done(function(data) {
        //getting data for the overlay
        const userUrl = data[0].url === "" ? "https://dev-is111-1.fys.cloud/uploads/profile-pictures/default-profile-picture.png" : data[0].url;
        const firstName = data[0].firstName === "" ? "FirstName" : data[0].firstName;
        const lastName = data[0].lastName === "" ? "LastName" : data[0].lastName;
        const username = data[0].username === "" ? "username" : data[0].username;
        const bio = data[0].bio === "" ? "..." : data[0].bio;

        $("#overlay-row-1").html(`<img src="${userUrl}">`);
        $("#overlay-full-name").html(firstName + " " + lastName);
        $("#overlay-username").html("a.k.a. " + username);
        $("#overlay-interests").html(data[0].interest);
        $("#overlay-bio").html(bio);

        //geting the interests from the user that needs to be displayed in the overlay
        FYSCloud.API.queryDatabase(
            "SELECT * FROM interests WHERE userId = ?", [currentOverlayUserId]
        ).done(function(interestsData) {
            let userInterest = [];

            interestsData.forEach(element => userInterest.push("<li>"+element.interest+"</li>"));

            $("#overlay-interests-ul").html(userInterest);
        }).fail(function(reason) {
            console.log(reason);
        });

        //displays the overlay and overlay-background
        $("#overlay").css("display", "flex");
        $("#overlay-background").css("display", "block");

        //function to redirect the user to the profilepage
        $("#profile-button").click(function (){redirectToProfileById(currentOverlayUserId)});
    }).fail(function(reason) {
        console.log(reason);
    });
}

//function to close the active user-display or overlay
function closeElement (currentDisplay) {
    document.getElementById(currentDisplay).style.display = "none";
    document.getElementById("overlay-background").style.display = "none";
}

//function that swaps the favorites icon
function setFavorite (currentIconId, newIconId) {
    document.getElementById(currentIconId).style.display = "none";
    document.getElementById(newIconId).style.display = "";
}