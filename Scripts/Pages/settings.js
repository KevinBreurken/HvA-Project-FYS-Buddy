// Validation
let validation = true;

// Get user settings:
let sessionUserId = getCurrentUserID();

// Language
const languageControl = document.getElementById("language");

let languageOptions;
let initialLanguageKey;
let translations;
let languageId;

// Security
const pwdCurrent = document.getElementById("currentAccountPassword");
const pwdInput = document.getElementById("newAccountPassword");
const pwdRepeat = document.getElementById("repeatAccountPassword");
let newPwdMatchesOld;
let pwdFilledIn = pwdInput.value !== "" && pwdInput.value !== null && typeof pwdInput !== "undefined";
let pwdRepeatMatch = pwdInput.value === pwdRepeat.value;

// Profile
const profileVisibilityControl = document.getElementById("profileVisibility");
let initialProfileVisibility;

let profileVisibilityOptions;
let firstname;
let lastname;
let profileVisibilityId;

// Block

// Gender
let sameGenderControl = document.getElementById("showOwnGenderOnly");
let sameGender;
const genderControl = document.getElementById("identifyAs");
let initialGender;
let displayGenderId;

// Distance
// Get distance control elements:
const distanceControls = document.getElementById("distance-controls");
// Get maximum distance:
const distanceMax = document.getElementById("maxDistance");
let initialMaxDistance;
// Get provided distance:
const distanceRange = document.getElementById("distance");
// Get element to print result in:
const distanceResult = document.getElementById("distanceResult");
let initialDistanceResult;

// Notification
const notificationControl = document.getElementById("statusNotified");
let currentNotificationId;

// Using FYS Cloud API must use the correct database, if page appears incorrect,
// please make sure to configure config.js to the appropriate database.

// Retrieve all database information related to stored settings for a provided user:
FYSCloud.API.queryDatabase(
    "SELECT * FROM `setting` WHERE `userId` = ?;",
    [sessionUserId]
).done(function(settings) {
    // Retrieve all database information related to stored languages
    FYSCloud.API.queryDatabase(
        "SELECT * FROM `language`;"
    ).done(function(languages) {
        // Populate language dropdown:
        setLanguages(languages);

        // Initial language can be set here:
        // initialLanguageKey = languages[0].languageKey;

        // Get initial language by looking into user settings (if it exists):
        if(settings.length > 0) {
            // Get the stored language key for a user:
            languages.forEach(language => {
                if(settings[0].languageId === language.id) {
                    initialLanguageKey = language.languageKey;
                }
            });
        }

        // Retrieve all database information related to stored profile visibility options:
        FYSCloud.API.queryDatabase(
            "SELECT * FROM `profilevisbility`;"
        ).done(function(profileVisibilities) {
            // Populate profile visibility options dropdown:
            setProfileVisibilities(profileVisibilities);

            // Get initial profile visibility value by looking into user settings (if it exists):
            if(settings.length > 0) {
                // Get the stored profile visibility value for a user:
                profileVisibilities.forEach(profileVisibility => {
                    if(settings[0].profileVisibilityId === profileVisibility.id) {
                        initialProfileVisibility = profileVisibility.name;
                    }
                });
            }


            // Retrieve all database information related to stored gender options:
            FYSCloud.API.queryDatabase(
                "SELECT * FROM `gender`;"
            ).done(function(genders) {
                // Set gender id to a default value of the first record found within genders table:
                displayGenderId = genders[0].id;

                if(settings.length > 0) {
                    // Check the checkbox for displaying own gender according to configuration:
                    if(settings[0].sameGender) {
                        sameGenderControl.click()
                    }

                    // Get the stored gender value for a user:
                    genders.forEach(gender => {
                        if(settings[0].displayGenderId === gender.id) {
                            initialGender = gender.name;
                        }
                    });
                    displayGenderId = settings[0].displayGenderId;
                }

                // Distance & Notifications:
                if(settings.length > 0) {
                    initialMaxDistance = settings[0].maxDistance;
                    initialDistanceResult = settings[0].radialDistance;
                    currentNotificationId = settings[0].notifcationId;
                }

                // Final functions and setters, utilize all retrieved information:
                setProfileVisibility(initialProfileVisibility);
                setGender(initialGender);
                setMaxDistance(initialMaxDistance);
                setDistanceResult(initialDistanceResult);
                setNotificationSettings(currentNotificationId)
                applySettingsEventlistener(settings, languages, profileVisibilities, genders);
                // Set the language of the page the configured language:
                setLanguage(initialLanguageKey);
            });
        });
    }).fail(function(reason) {
        console.log(reason);
    });
}).fail(function(reason) {
    console.log(reason);
});

// Get password from current user:
FYSCloud.API.queryDatabase(
    "SELECT * FROM `user` WHERE `user`.`id` = ?",
    [sessionUserId]
).done(function(users) {
    // TODO: Use encryption/decryption for password comparison
    currentPwdEventListener(users[0].password);
}).fail(function(reason) {
    console.log(reason);
});

// TODO: only get the profile information of profiles who communicated to the current user stored in the session.
// Get profiles:
FYSCloud.API.queryDatabase(
    "SELECT * FROM `profile`"
).done(function(profiles) {
    genderEventlistener(profiles)

    FYSCloud.API.queryDatabase(
        "SELECT * FROM `blocked` WHERE `blocked`.`requestingUser` = ?",
        [sessionUserId]
    ).done(function(blockedUsers) {
        profileSearchEventListener(profiles, blockedUsers);
        blockedSearchEventListener(profiles, blockedUsers);
    }).fail(function(reason) {
        console.log(reason);
    });
}).fail(function(reason) {
    console.log(reason);
});

// Language handling:
// Populates language select element dependant on a collection of languages:
function setLanguages(languages) {
    languageOptions = "";
    for(let i = 0; i < languages.length; i++) {
        languageOptions += "<option value=\"" + languages[i].languageKey + "\" data-translate=\"settings.language.select." + languages[i].languageKey + "\">" + languages[i].name + "</option>"
    }
    languageControl.innerHTML = languageOptions;
}

// Sets the language of a page and language select element to appropriate given language:
function setLanguage(initialLanguageKey) {
    initialLanguageKey = typeof initialLanguageKey === "undefined" ? "en" : initialLanguageKey;

    translations = {
        settings: {
            capitalArticles: {
                nl: "Een",
                en: "A"
            },
            articles: {
                nl: "een",
                en: "a"
            },
            lowercase: {
                nl: "kleine",
                en: "lowercase"
            },
            uppercase: {
                nl: "hoofd",
                en: "capital (uppercase)&nbsp;"
            },
            number: {
                nl: "nummer",
                en: "number"
            },
            header: {
                nl: "Instellingen",
                en: "Settings"
            },
            language: {
                nl: "Taal",
                en: "Language",
                select: {
                    nl: {
                        nl: "Nederlands",
                        en: "Dutch"
                    },
                    en: {
                        nl: "Engels",
                        en: "English"
                    }
                }
            },
            account: {
                nl: "Account",
                en: "Account",
                label: {
                    nl: "Profiel uitschakelen",
                    en: "Disable profile"
                },
                anchor: {
                    nl: "Uitschakelen",
                    en: "Disable"
                }
            },
            security: {
                nl: "Beveiliging",
                en: "Security",
                currentPassword: {
                    nl: "Huidige wachtwoord",
                    en: "Current password"
                },
                newPassword: {
                    nl: "Nieuwe wachtwoord",
                    en: "New password"
                },
                repeatPassword: {
                    nl: "Herhaal wachtwoord",
                    en: "Repeat password"
                },
                validationMessage: {
                    nl: "Wachtwoord moet het volgende bevatten",
                    en: "Password must contain the following"
                },
                minOf: {
                    nl: "Minimum van",
                    en: "Minimum of"
                },
                eightChars: {
                    nl: "8 karakters",
                    en: "8 characters"
                }
            },
            privacy: {
                nl: "Privacy",
                en: "Privacy",
                label: {
                    nl: "Profiel zichtbaar voor",
                    en: "Profile visible to"
                },
                select: {
                    everyone: {
                        nl: "Iedereen",
                        en: "Everyone"
                    },
                    matchesonly: {
                        nl: "Alleen matches",
                        en: "Matches only"
                    },
                    justme: {
                        nl: "Alleen mij",
                        en: "Just me"
                    }
                }
            },
            block: {
                nl: "Blokkeren",
                en: "Block",
                label: {
                    nl: "Iemand zoeken",
                    en: "Search someone"
                },
                button : {
                    nl: "Blokkeren",
                    en: "Block"
                }
            },
            blocked: {
                label: {
                    nl: "Geblokkeerden zoeken",
                    en: "Search blocked people"
                },
                button: {
                    nl: "Geblokkeerden tonen",
                    en: "Show blocked people"
                },
                buttonHide: {
                    nl: "Geblokkeerden verbergen",
                    en: "Hide blocked people"
                }
            },
            unblock: {
                button: {
                    nl: "Deblokkeren",
                    en: "Unblock"
                }
            },
            preferences: {
                nl: "Voorkeuren",
                en: "Preferences",
                genderLabel: {
                    nl: "Toon alleen resultaat van hetzelfde geslacht als mij.",
                    en: "Only show results matching my own gender."
                },
                identifyLabel: {
                    nl: "Identificeren als",
                    en: "Identify as"
                },
                maxDistanceLabel: {
                    nl: "Maximale afstand",
                    en: "Maximum distance"
                },
                distanceRangeLabel: {
                    nl: "Straal van afstand",
                    en: "Radial distance"
                },
                distanceResultLabel: {
                    nl: "De afstand is ingesteld op: ",
                    en: "The distance has been set to: "
                },
                select: {
                    unlimited: {
                        nl: "Oneindig",
                        en: "Unlimited"
                    }
                }
            },
            notifications: {
                nl: "Meldingen",
                en: "Notifications",
                optionOneLabel: {
                    nl: "Bij wijzigingen aan mijn profiel (zoals een nieuwe potentiele beschikbare connection) zou ik meldingen per mail willen ontvangen",
                    en: "I would like to get notified by e-mail about status changes to my profile (e.g. new potential connections available)"
                },
                optionTwoLabel: {
                    nl: "Ik zou meldingen per mail willen over app wijzigingen",
                    en: "I would like to get notified by e-mail about updates to the app"
                }
            },
            information: {
                nl: "Informatie",
                en: "Information",
                version: {
                    nl: "Versie ",
                    en: "Version "
                }
            },
            applyButton: {
                nl: "Gegevens bijwerken",
                en: "Apply changes"
            }
        }
    };

    CustomTranslation.addTranslationJSON(translations);
    CustomTranslation.setLanguage(initialLanguageKey);

    // $languageControl = $("select#language");
    //
    // $languageControl.val(initialLanguage);
    //
    // $languageControl.on("change", function () {
    //     FYSCloud.Localization.switchLanguage($(this).val());
    // });

    // or the vanilla javascript way:

    languageControl.setAttribute("value", initialLanguageKey);

    // Set language control to initial language:
    for(let i = 0; i < languageControl.length; i++) {
        let currentOption = languageControl.options[i];
        if(currentOption.value === initialLanguageKey) {
            languageControl.selectedIndex = i;
        }
    }
}

languageControl.addEventListener("change", function() {
    CustomTranslation.setLanguage($(this).val());
});

// Account handling:
let accountControl = document.getElementById("disableProfile");
accountControl.addEventListener("click", function() {
    // Deactivate an account:
    FYSCloud.API.queryDatabase(
        "UPDATE `setting` " +
        "SET `deactivated` = ? " +
        "WHERE `userId` = ?;",
        [1, sessionUserId]
    ).done(function() {
        // Initiate a page refresh so that user will be routed to re-activation page:
        window.location.href = "settings.html";
    }).fail(function(reason) {
        console.log(reason);
    });
});

// A way to re-activate an account on any related page responsible for doing so could use
// the following FYS Cloud call on e.g. a button on-click event:
// FYSCloud.API.queryDatabase(
//     "UPDATE `setting`" +
//     "SET `deactivated` = '0'" +
//     "WHERE `userId` = ?;",
//     [sessionUserId]
// ).done(function(data) {
//     console.log(data);
// }).fail(function(reason) {
//     console.log(reason);
// });

// Password handling:
function currentPwdEventListener(password) {
    pwdCurrent.addEventListener("input", function() {
        newPwdMatchesOld = this.value === password;
    });
}

// Password validation:
pwdInput.addEventListener("input", function() {
    let validationContainer = document.querySelector("#validationMessage");
    let letterVal = document.querySelector("#letterVal");
    let capitalVal = document.querySelector("#capitalVal");
    let numberVal = document.querySelector("#numberVal");
    let lengthVal = document.querySelector("#lengthVal");
    if(this.value === "") {
        validationContainer.style.display = "none";
    }
    else {
        validationContainer.style.display = "block";
    }

    // Validate lowercase letters
    let lowerCaseLettersReg = /[a-z]/g;
    if(this.value.match(lowerCaseLettersReg)) {
        letterVal.classList.remove("invalid");
        letterVal.classList.add("valid");
    } else {
        letterVal.classList.remove("valid");
        letterVal.classList.add("invalid");
        validation = false;
    }

    // Validate capital letters
    let upperCaseLettersReg = /[A-Z]/g;
    if(this.value.match(upperCaseLettersReg)) {
        capitalVal.classList.remove("invalid");
        capitalVal.classList.add("valid");
    } else {
        capitalVal.classList.remove("valid");
        capitalVal.classList.add("invalid");
        validation = false;
    }

    // Validate numbers
    let numbersReg = /[0-9]/g;
    if(this.value.match(numbersReg)) {
        numberVal.classList.remove("invalid");
        numberVal.classList.add("valid");
    } else {
        numberVal.classList.remove("valid");
        numberVal.classList.add("invalid");
        validation = false;
    }

    // Validate length
    const lengthValRequired = 8;
    if(this.value.length >= lengthValRequired) {
        lengthVal.classList.remove("invalid");
        lengthVal.classList.add("valid");
    } else {
        lengthVal.classList.remove("valid");
        lengthVal.classList.add("invalid");
        validation = false;
    }

    // If everything has been entered correctly or field was left empty, validation succeeded:
    if(this.value.match(lowerCaseLettersReg) && this.value.match(upperCaseLettersReg) && this.value.match(numbersReg) && this.value.length >= lengthValRequired || this.value === "") {
        validation = true;
    }

    // When password in the "repeat password" field does not match the attempted new password, a new password can't be
    // stored and feedback should be passed:
    pwdRepeatMatch = this.value === pwdRepeat.value;

    // Change boolean state whether a password has been filled in or not:
    pwdFilledIn = pwdInput.value !== "" && typeof pwdInput !== "undefined";
});

// Password confirmation:
pwdRepeat.addEventListener("input", function() {
    pwdRepeatMatch = this.value === pwdInput.value;
});

// Profile handling:
function setProfileVisibilities(profileVisibilities) {
    profileVisibilityOptions = "";
    //TODO: Because of data-translate, the options won't appear on page init for some weird reason. Further assistance required.
    profileVisibilities.forEach(option => {
        profileVisibilityOptions += "<option value=\"" + option.name + "\" data-translate=\"settings.privacy.select." + option.name.toLowerCase().replace(/ /g, '') + "\">" + option.name + "</option>";
    });
    profileVisibilityControl.innerHTML = profileVisibilityOptions;
}

// Sets the profile visibility select element to the appropriate given profile visibility
function setProfileVisibility(initialProfileVisibility) {
    initialProfileVisibility = typeof initialProfileVisibility === "undefined" ? "Everyone" : initialProfileVisibility;

    // Doesn't work:
    // profileVisibilityControl.forEach(option => {
    //     console.log(option);
    // });

    for (let i = 0; i < profileVisibilityControl.length; i++) {
        let currentOption = profileVisibilityControl.options[i];
        if(currentOption.value === initialProfileVisibility) {
            profileVisibilityControl.selectedIndex = i;
        }
    }
}

// Block handling:
// TODO: Clean up big mess of duplicate code.

// TODO: prefix must be set depending on environment configured within javascript configuration (e.g. config.js):
const imageSrcPrefix = `${environment}/uploads/profile-pictures/`;

// Search all available profiles to receive "blocked" status and
// display these to receive a "blocked" status on the settings page:
function profileSearchEventListener(profiles, blockedUsers) {
    document.getElementById("search-profiles").addEventListener("input", function() {
        const resultContainer = document.getElementById("searchProfilesResult");
        let result = "";
        // Check if given input is empty:
        if(this.value === "") {
            // remove any existing result container if available:
            resultContainer.remove();
        }
        else {
            let providedInput = this.value.toUpperCase();

            // if(localBlockedUsers) {
            //     for (let j = 0; j < localBlockedUsers.length; j++) {
            //         console.log(localBlockedUsers[j]);
            //     }
            // }
            // else {
            //     console.log("No locally blocked users were added.")
            // }

            for(let i = 0; i < profiles.length; i++) {
                // Check if a given profile is already blocked:
                let profileBlocked;
                for (let j = 0; j < blockedUsers.length; j++) {
                    if(profiles[i].userId === blockedUsers[j].blockedUser) {
                        profileBlocked = true;
                        break;
                    }
                }

                // If a user has recently been blocked, invert blocked state:
                if(localBlockedUsers) {
                    for (let j = 0; j < localBlockedUsers.length; j++) {
                        if(profiles[i].userId === Number(localBlockedUsers[j])) {
                            // Invert blocked state:
                            profileBlocked = !profileBlocked;
                        }
                    }
                }

                // null checking
                firstname = profiles[i].firstname == null ? "" : profiles[i].firstname + " ";
                lastname = profiles[i].lastname == null ? "" : profiles[i].lastname + " ";

                // Check for input match to firstname and lastname
                if(firstname.toUpperCase().indexOf(providedInput) > -1
                    || lastname.toUpperCase().indexOf(providedInput) > -1) {

                    result += "<div class=\"user-card\">" +
                        "<div class=\"user-card-image\">" +
                        "<img onerror=\"this.src='Content/Images/default-profile-picture.png'\" src=\"" + imageSrcPrefix + profiles[i].pictureUrl + "\" style=\"width: 100%;\" alt=\"" + firstname.trim() + "'s profile image\" />" +
                        "</div>" +
                        "<div class=\"user-card-content\">" +
                        "<span class=\"user-data\">" + profiles[i].userId + "</span>" +
                        "<div class=\"card-info\">" + firstname + lastname + "<br /><span class='profile-bio'>" + profiles[i].biography + "</span></div>" +
                        "<div class=\"card-control\">";

                    // Create appropriate button depending on whether a profile has been blocked or not:
                    if (profileBlocked) {
                        result += "<button class=\"unblock-button\" type=\"button\" data-translate=\"settings.unblock.button\">Unblock</button>";
                    } else {
                        result += "<button class=\"block-button\" type=\"button\" data-translate=\"settings.block.button\">Block</button>"
                    }

                    result += "</div>" +
                        "</div>" +
                        "</div>";
                }
            }

            // If no container element exists, create one:
            if(resultContainer) {
                // Element already exists, change its contents:
                resultContainer.innerHTML =  result;
            }
            else {
                // Utilize generated HTML by populating a container:
                // resultContainer = <div class="search-profiles-result"></div>
                const resultContainer = document.createElement("div");
                resultContainer.setAttribute("id", "searchProfilesResult");
                const eleToAppendAfter = document.getElementById("block-user");
                // Display all profiles that are available to receive a "blocked" status on the settings page:
                resultContainer.innerHTML = result;
                eleToAppendAfter.parentNode.insertBefore(resultContainer, eleToAppendAfter.nextSibling);
            }
        }

        // Translate the dynamically generated "block" buttons:
        CustomTranslation.setLanguage($("#language").val());
    });
}

// Add event listener for block search button:
// function blockedSearchEventListener(profiles, blockedUsers) {
//     document.getElementById("show-blocked-users").addEventListener("click", function () {
//         alert("Show blocked people");
//         this.remove();
//     });
//
//     document.getElementById("hide-blocked-users").addEventListener("click", function() {
//         this.remove();
//     });
// }

// Previous function tends to create a null reference error for some weird kind of reason I can't understand.

// Add event listener for blocked people search:
let localBlockedUsers;
function blockedSearchEventListener(profiles, blockedUsers) {
    // Add event listener for blocked people search button:
    document.addEventListener("click", function(e) {
        if(e.target.classList.contains("block-button")) {
            const toggleButton = e.target;
            const resultContainer = document.getElementById("searchBlockedResult");
            if(e.target.id === "show-blocked-users") {
                // Toggle button from show to hide blocked people:
                toggleButton.setAttribute("id", "hide-blocked-users");
                toggleButton.setAttribute("data-translate", "settings.blocked.buttonHide");

                // Add the collection of blocked users to the settings page:
                let result = "";

                if(localBlockedUsers) {
                    for (let j = 0; j < localBlockedUsers.length; j++) {
                        console.log(localBlockedUsers[j]);
                    }
                }
                else {
                    console.log("No locally blocked users were added.")
                }

                // Loop through profiles
                for(let i = 0; i < profiles.length; i++) {
                    // Check if a given profile is already blocked:
                    let profileBlocked;
                    for (let j = 0; j < blockedUsers.length; j++) {
                        if(profiles[i].userId === blockedUsers[j].blockedUser) {
                            profileBlocked = true;
                            break;
                        }
                    }
                    if(profileBlocked) {
                        // null checking
                        firstname = profiles[i].firstname == null ? "" : profiles[i].firstname + " ";
                        lastname = profiles[i].lastname == null ? "" : profiles[i].lastname + " ";

                        result += "<div class=\"user-card\">" +
                            "<div class=\"user-card-image\">" +
                            "<img onerror=\"this.src='Content/Images/default-profile-picture.png'\" src=\"" + imageSrcPrefix + profiles[i].pictureUrl + "\" style=\"width: 100%;\" alt=\"" + firstname.trim() + "'s profile image\" />" +
                            "</div>" +
                            "<div class=\"user-card-content\">" +
                            "<span class=\"user-data\">" + profiles[i].userId + "</span>" +
                            "<div class=\"card-info\">" + firstname + lastname + "<br /><span class='profile-bio'>" + profiles[i].biography + "</span></div>" +
                            "<div class=\"card-control\">" +
                            "<button class=\"unblock-button\" type=\"button\" data-translate=\"settings.unblock.button\">Unblock</button>" +
                            "</div>" +
                            "</div>" +
                            "</div>";
                    }
                }
                // Utilize generated HTML by populating a container:
                const resultContainer = document.createElement("div");
                resultContainer.setAttribute("id", "searchBlockedResult");
                const eleToAppendAfter = document.getElementById("hide-blocked-users");
                // Display all profiles that are available to receive a "blocked" status on the settings page:
                resultContainer.innerHTML = result;
                eleToAppendAfter.parentNode.insertBefore(resultContainer, eleToAppendAfter.nextSibling);
            }
            else if(e.target.id === "hide-blocked-users") {
                toggleButton.setAttribute("id", "show-blocked-users");
                toggleButton.setAttribute("data-translate", "settings.blocked.button");

                // Remove the collection of blocked users to the settings page:
                resultContainer.remove();
            }

            // Translate everything that has been added to the DOM:
            CustomTranslation.setLanguage($("#language").val());
        }
    });

    // Add event listener for blocked people search input:
    document.getElementById("search-blocked-users").addEventListener("input", function() {
        const toggleButton = document.getElementById("show-blocked-users");
        const resultContainer = document.getElementById("searchBlockedResult");

        // Toggle button from show to hide blocked people:
        if(toggleButton) {
            toggleButton.setAttribute("id", "hide-blocked-users");
            toggleButton.setAttribute("data-translate", "settings.blocked.buttonHide");
        }

        // Add the collection of blocked users to the settings page:
        let result = "";
        let providedInput = this.value.toUpperCase();

        // Loop through profiles
        for(let i = 0; i < profiles.length; i++) {
            // Check if a given profile is already blocked:
            let profileBlocked;
            for (let j = 0; j < blockedUsers.length; j++) {
                if(profiles[i].userId === blockedUsers[j].blockedUser) {
                    profileBlocked = true;
                    break;
                }
            }

            // null checking
            firstname = profiles[i].firstname == null ? "" : profiles[i].firstname + " ";
            lastname = profiles[i].lastname == null ? "" : profiles[i].lastname + " ";

            // Check for input match to firstname and lastname
            if(firstname.toUpperCase().indexOf(providedInput) > -1
                || lastname.toUpperCase().indexOf(providedInput) > -1) {

                // Create appropriate button depending on whether a profile has been blocked or not:
                if (profileBlocked) {
                    result += "<div class=\"user-card\">" +
                        "<div class=\"user-card-image\">" +
                        "<img onerror=\"this.src='Content/Images/default-profile-picture.png'\" src=\"" + imageSrcPrefix + profiles[i].pictureUrl + "\" style=\"width: 100%;\" alt=\"" + firstname.trim() + "'s profile image\" />" +
                        "</div>" +
                        "<div class=\"user-card-content\">" +
                        "<span class=\"user-data\">" + profiles[i].userId + "</span>" +
                        "<div class=\"card-info\">" + firstname + lastname + "<br /><span class='profile-bio'>" + profiles[i].biography + "</span></div>" +
                        "<div class=\"card-control\">" +
                        "<button class=\"unblock-button\" type=\"button\" data-translate=\"settings.unblock.button\">Unblock</button>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                }
            }
        }
        // Utilize generated HTML by populating a container:
        if(resultContainer) {
            resultContainer.innerHTML = result;
        }
        else {
            const resultContainer = document.createElement("div");
            resultContainer.setAttribute("id", "searchBlockedResult");
            const eleToAppendAfter = document.getElementById("hide-blocked-users");
            // Display all profiles that are available to receive a "blocked" status on the settings page:
            resultContainer.innerHTML = result;
            eleToAppendAfter.parentNode.insertBefore(resultContainer, eleToAppendAfter.nextSibling);
        }

        // Translate the dynamically generated "block" buttons:
        CustomTranslation.setLanguage($("#language").val());
    });
}

// Add event listener to block buttons:
document.addEventListener("click", function(e) {
    // Clicking on block buttons:
    if(e.target.classList.contains("block-button")) {
        // Clicking on card specific block button:
        if(e.target.parentNode.classList.contains("card-control")) {
            // Block specified person:
            let blockedUser = e.target.parentNode.parentNode.getElementsByClassName("user-data")[0].innerText;
            blockUser(blockedUser);
        }
        else {
            // Clicking on general block button:
            // When the button is a block user button:
            if(e.target.id === "block-user") {
                // If any cards exists, by default block the first person:
                if (document.getElementsByClassName("user-card")[0]) {
                    // Block the first person:
                    let blockedUser = document.getElementsByClassName("user-card")[0].getElementsByClassName("user-data")[0].innerText;
                    blockUser(blockedUser);
                }
            }
        }
    }
    else if(e.target.classList.contains("unblock-button")) {
        let blockedUser = e.target.parentNode.parentNode.getElementsByClassName("user-data")[0].innerText;
        unblockUser(blockedUser);
    }
});

// Blocking a user:
function blockUser(user) {
    if(user) {
        // Locally keep track of added users from a blocked users collection:
        if(localBlockedUsers) {
            localBlockedUsers.push(user);
        }
        else {
            // On first time, initialize array:
            localBlockedUsers = [];
            localBlockedUsers.push(user);
        }

        FYSCloud.API.queryDatabase(
            "INSERT INTO `blocked` (`requestingUser`, `blockedUser`, `reason`)" +
            "VALUES (?, ?, ?);",
            [sessionUserId, user, "Blocked through settings, reason unsupported."]
        ).done(function(data) {
            console.log(data);
            alert("User containing userId " + user + " is now blocked.");
        }).fail(function(reason) {
            console.log(reason);
        });
    }
}

// Unblocking a user:
function unblockUser(user) {
    // Locally keep track of removed users from a blocked users collection:
    if(localBlockedUsers) {
        localBlockedUsers.splice(localBlockedUsers.indexOf(user), 1);
    }

    if(user) {
        FYSCloud.API.queryDatabase(
            "DELETE FROM `blocked`" +
            "WHERE `blocked`.`requestingUser` = ?" +
            "AND `blocked`.`blockedUser` = ?",
            [sessionUserId, user]
        ).done(function(data) {
            console.log(data);
            alert("User containing userId " + user + " is now unblocked.");
        }).fail(function(reason) {
            console.log(reason);
        });
    }
}

// Gender handling:
function setGender(initialGender) {
    initialGender = typeof initialGender === "undefined" ? "male" : initialGender;

    for (let i = 0; i < genderControl.length; i++) {
        let currentOption = genderControl.options[i];
        if(currentOption.value === initialGender) {
            genderControl.selectedIndex = i;
        }
    }
}

let currentProfile;
function genderEventlistener(profiles) {
    document.getElementById("showOwnGenderOnly").addEventListener("change", function() {
        // Check whether own gender should only be shown:
        if(this.checked) {
            // Get profile for current user stored in the session:
            profiles.forEach(profile => {
                if(profile.userId === Number(sessionUserId)) {
                    currentProfile = profile;
                }
            });

            // // null checking
            // firstname = currentProfile.firstname == null ? "" : currentProfile.firstname + " ";
            // lastname = currentProfile.lastname == null ? "" : currentProfile.lastname + " ";
            // // logging
            // console.log("User " + firstname + lastname + "is of gender \'" + currentProfile.gender + "\'");

            if(currentProfile === undefined) {
                console.log("Profile for user " + sessionUserId + " does not exist.");
            }
            else {
                if(currentProfile.gender.toLowerCase() === "other") {
                    document.querySelector("#identifyAsContainer").style.display = "block";
                }
            }
        }
        else {
            let display = getComputedStyle(document.querySelector("#identifyAsContainer")).display;
            if(display !== "none") {
                document.querySelector("#identifyAsContainer").style.display = "none";
            }
        }
    });
}

// Distance handling:
if(distanceMax.value === "unlimited") {
    distanceControls.style.display = "none";
    distanceResult.innerHTML = "&infin;";
}
else {
    // Print the output of provided distance:
    distanceResult.innerHTML = distanceRange.value;
}

// When changing the range bar's value, print the changed value:
distanceRange.oninput = function() {
    distanceResult.innerHTML = this.value;
}

// Change maximum distance for slider when option has been changed:
distanceMax.addEventListener("change", function() {
    if(this.value === "unlimited") {
        distanceControls.style.display = "none";
        distanceResult.innerHTML = "&infin;";
    }
    else {
        distanceControls.style.display = "block";
        distanceRange.setAttribute("max", this.value);
        // Update distance result when selected option exceeds slider's previous value.
        if(Number(distanceResult.innerHTML) > this.value || distanceResult.innerHTML.charCodeAt(0) === 8734) {
            distanceResult.innerHTML = this.value;
        }
    }
});

const lastMaxDistanceOptionInteger = distanceMax.options[distanceMax.length - 2].value;
function setMaxDistance(initialMaxDistance) {
    // Get default maximum distance:
    let defaultMaxDistance = 100;
    for(let i = 0; i < distanceMax.length; i++) {
        let currentOption = distanceMax.options[i];

        if(currentOption.hasAttribute("selected")) {
            defaultMaxDistance = currentOption.value;
        }
    }

    // Set initial maximum distance:
    initialMaxDistance = typeof initialMaxDistance === "undefined" ? defaultMaxDistance : initialMaxDistance;

    // Set max distance select element accordingly
    // If an "unlimited" value has been stored:
    if(Number(initialMaxDistance) > Number(lastMaxDistanceOptionInteger)) {
        distanceMax.selectedIndex = distanceMax.length - 1;
    }
    else {
        for (let i = 0; i < distanceMax.length; i++) {
            let currentOption = distanceMax.options[i];

            if (Number(currentOption.value) === initialMaxDistance) {
                distanceMax.selectedIndex = i;
            }
        }
    }

    // Set max distance range element accordingly:
    // (Using .dispatchEvent so that everything that is related to change event on the select will be executed, changing
    // the range element as well.)
    distanceMax.dispatchEvent(new Event('change'));
}

function setNotificationSettings(notificationId){
    notificationControl.checked = notificationId;
}

function setDistanceResult(initialDistanceResult) {
    const defaultDistanceResult = distanceRange.value;
    initialDistanceResult = typeof initialDistanceResult === "undefined" ? defaultDistanceResult : initialDistanceResult;


    if(Number(initialDistanceResult) > Number(lastMaxDistanceOptionInteger)) {
        distanceRange.value = initialDistanceResult;
        distanceResult.innerHTML = "&infin;";
    }
    else {
        distanceRange.value = initialDistanceResult;
        distanceResult.innerHTML = initialDistanceResult;
    }

}

// TODO: Remove alerts
function applySettingsEventlistener(settings, languages, profileVisibilities, genders) {
    document.getElementById("apply").addEventListener("click", function (event) {
        event.preventDefault();

        // Validate fields on submition:
        if (validation) {
            // TODO: Store all information related to changes made to settings (language is done).

            // Get appropriate language identifier dependant on the selection of the language:
            languages.forEach(language => {
                if (language.languageKey === languageControl.value) {
                    languageId = language.id;
                }
            });

            // Get appropriate profile availability identifier dependant on the selection of the profile availability:
            profileVisibilities.forEach(option => {
                if (option.name === profileVisibilityControl.value) {
                    profileVisibilityId = option.id;
                }
            });

            // Get appropriate configuration for showing own gender:
            sameGender = sameGenderControl.checked;

            // Get appropriate gender identifier dependant on the selection of the gender:
            genders.forEach(gender => {
                if (gender.name === genderControl.value) {
                    displayGenderId = gender.id;
                }
            });

            let maxDis = distanceMax.value;
            let radDis = distanceResult.innerText;

            // If maximum distance has been set to unlimited
            if (isNaN(maxDis)) {
                // Set maximum distance to an "unlimited" amount of km's:
                const unlimitedDistance = 40075;
                maxDis = unlimitedDistance;
                radDis = unlimitedDistance;
            }

            currentNotificationId = notificationControl.checked;

            // Check whether a setting already exists for provided user:
            if (settings.length > 0) {
                // A setting for the user already exists, so an UPDATE should be executed:
                FYSCloud.API.queryDatabase(
                    "UPDATE `setting` " +
                    "SET `deactivated` = ?, `languageId` = ?, `profileVisibilityId` = ?, `sameGender` = ?, `displayGenderId` = ?, `notifcationId` = ?, `maxDistance` = ?, `radialDistance` = ? " +
                    "WHERE `setting`.`userId` = ?;",
                    [0, languageId, profileVisibilityId, sameGender, displayGenderId, currentNotificationId, maxDis, radDis, sessionUserId]
                ).done(function () {
                    // Password checking and update when necessary:

                    // Check if an attempt to change the password has been made:
                    if (pwdFilledIn) {
                        // Check if current password is entered correctly:
                        if (newPwdMatchesOld) {
                            // Check if the password to be changed has been properly confirmed:
                            if (pwdRepeatMatch) {
                                FYSCloud.API.queryDatabase(
                                    "UPDATE `user` " +
                                    "SET `password` = ? " +
                                    "WHERE `user`.`id` = ?;",
                                    [pwdInput.value, sessionUserId]
                                ).done(function () {
                                    window.location.href = "homepage.html";
                                }).fail(function (reason) {
                                    console.log(reason);
                                });
                            } else {
                                alert("Repeated password does not match.")
                            }
                        } else {
                            alert("Current password is incorrect")
                        }
                    } else {
                        window.location.href = "homepage.html";
                    }
                }).fail(function (reason) {
                    console.log(reason);
                });
            } else {
                // There is no setting available yet, creating new setting, execute INSERT:
                FYSCloud.API.queryDatabase(
                    "INSERT INTO `setting` (`id`, `userId`, `deactivated`, `languageId`, `profileVisibilityId`, `sameGender`, `displayGenderId`, `notifcationId`, `maxDistance`, `radialDistance`) " +
                    "VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                    [sessionUserId, 0, languageId, profileVisibilityId, sameGender, displayGenderId, currentNotificationId, maxDis, radDis]
                ).done(function () {
                    // Password checking and update when necessary:

                    // Check if an attempt to change the password has been made:
                    if (pwdFilledIn) {
                        // Check if current password is entered correctly:
                        if (newPwdMatchesOld) {
                            // Check if the password to be changed has been properly confirmed:
                            if (pwdRepeatMatch) {
                                FYSCloud.API.queryDatabase(
                                    "UPDATE `user` " +
                                    "SET `password` = ? " +
                                    "WHERE `user`.`id` = ?;",
                                    [pwdInput.value, sessionUserId]
                                ).done(function () {
                                    window.location.href = "homepage.html";
                                }).fail(function (reason) {
                                    console.log(reason);
                                });
                            } else {
                                alert("Repeated password does not match.")
                            }
                        } else {
                            alert("Current password is incorrect")
                        }
                    } else {
                        window.location.href = "homepage.html";
                    }
                }).fail(function (reason) {
                    console.log(reason);
                });
            }
        } else {
            alert("Some fields are entered incorrectly!");
            event.preventDefault();
        }
    });
}
