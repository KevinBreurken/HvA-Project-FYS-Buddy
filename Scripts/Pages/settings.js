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
let currentProfile;
let firstname;
let middlename;
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

                // Distance:
                if(settings.length > 0) {
                    initialMaxDistance = settings[0].maxDistance;
                    initialDistanceResult = settings[0].radialDistance;
                }

                // Final functions and setters, utilize all retrieved information:
                setProfileVisibility(initialProfileVisibility);
                setGender(initialGender);
                setMaxDistance(initialMaxDistance);
                setDistanceResult(initialDistanceResult);
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
        blockEventListener(profiles, blockedUsers);
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
                    nl: "Zoeken",
                    en: "Search"
                },
                button : {
                    nl: "Blokkeren",
                    en: "Block"
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

    FYSCloud.Localization.CustomTranslations.addTranslationJSON(translations);
    FYSCloud.Localization.CustomTranslations.setLanguage(initialLanguageKey);

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
    FYSCloud.Localization.CustomTranslations.setLanguage($(this).val());
});

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
// TODO: prefix must be set depending on environment configured within javascript configuration (e.g. config.js):
const imageSrcPrefix = "https://dev-is111-1.fys.cloud/uploads/profile-pictures/";
function blockEventListener(profiles, blockedUsers) {
    document.querySelector("input#search-block").addEventListener("input", function() {
        const resultContainer = this.parentNode.querySelector("#searchBlockResult");
        let result = "";
        // Check if given input is empty:
        if(this.value === "") {
            // remove any existing result container if available:
            resultContainer.remove();
        }
        else {
            let providedInput = this.value.toUpperCase();

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

                    result += "<div class=\"user-card\">" +
                        "<div class=\"user-card-image\">" +
                        "<img onerror=\"this.src=imageSrcPrefix + 'default-profile-picture.png\" src=\"" + imageSrcPrefix + profiles[i].pictureUrl + "\" style=\"width: 100%;\" alt=\"" + firstname.trim() + "'s profile image\" />" +
                        "</div>" +
                        "<div class=\"user-card-content\">" +
                        "<span class=\"user-data\">" + profiles[i].userId + "</span>" +
                        "<div class=\"card-info\">" + firstname + lastname + "<br />" + profiles[i].biography + "</div>" +
                        "<div class=\"card-control\">";

                    // Create appropriate button depending on whether a profile has been blocked or not:
                    if (profileBlocked) {
                        result += "<button class=\"unblock-button\">Unblock</button>";
                    } else {
                        result += "<button class=\"block-button\">Block</button>"
                    }

                    result += "</div>" +
                        "</div>" +
                        "</div>";
                }
            }

            // If no container element exists, create one:
            if(resultContainer === null) {
                // resultContainer = <div class="search-block-result"></div>
                const resultContainer = document.createElement("div");
                resultContainer.setAttribute("id", "searchBlockResult");
                const eleToAppendAfter = document.querySelector("button#block-user");
                // Display whatever is entered (sample):
                resultContainer.innerHTML = result;
                eleToAppendAfter.parentNode.insertBefore(resultContainer, eleToAppendAfter.nextSibling);
            }
            else {
                // Element already exists, change its contents:
                resultContainer.innerHTML =  result;
            }
        }
    });
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

function genderEventlistener(profiles) {
    document.getElementById("showOwnGenderOnly").addEventListener("change", function() {
        // Check whether own gender should only be shown:
        if(this.checked) {
            // Get profile for current user stored in the session:
            profiles.forEach(profile => {
                if(profile.userId === Number(sessionUserId)) {
                    currentProfile = profile;
                }
            })

            // // null checking
            // firstname = currentProfile.firstname == null ? "" : currentProfile.firstname + " ";
            // lastname = currentProfile.lastname == null ? "" : currentProfile.lastname + " ";
            // // logging
            // console.log("User " + firstname + lastname + "is of gender \'" + currentProfile.gender + "\'");

            if(currentProfile.gender.toLowerCase() === "other") {
                document.querySelector("#identifyAsContainer").style.display = "block";
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

function setMaxDistance(initialMaxDistance) {
    const defaultMaxDistance = 100;
    initialMaxDistance = typeof initialMaxDistance === "undefined" ? defaultMaxDistance : initialMaxDistance;

    // Set max distance select element accordingly
    for (let i = 0; i < distanceMax.length; i++) {
        let currentOption = distanceMax.options[i];
        if(Number(currentOption.value) === initialMaxDistance) {
            distanceMax.selectedIndex = i;
        }
    }

    // Set max distance range element accordingly:
    // (Using .dispatchEvent so that everything that is related to change event on the select will be executed, changing
    // the range element as well.)
    distanceMax.dispatchEvent(new Event('change'));
}

function setDistanceResult(initialDistanceResult) {
    let defaultDistanceResult = 20;
    initialDistanceResult = typeof initialDistanceResult === "undefined" ? defaultDistanceResult : initialDistanceResult;
    distanceRange.value = initialDistanceResult;
    distanceResult.innerHTML = initialDistanceResult;
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
               if(language.languageKey === languageControl.value) {
                   languageId = language.id;
               }
            });

            // Get appropriate profile availability identifier dependant on the selection of the profile availability:
            profileVisibilities.forEach(option => {
               if(option.name === profileVisibilityControl.value) {
                   profileVisibilityId = option.id;
               }
            });

            // Get appropriate configuration for showing own gender:
            sameGender = sameGenderControl.checked;

            // Get appropriate gender identifier dependant on the selection of the gender:
            genders.forEach(gender => {
                if(gender.name === genderControl.value) {
                    displayGenderId = gender.id;
                }
            });

            let maxDis = distanceMax.value;
            let radDis = distanceResult.innerText;

            // Check whether a setting already exists for provided user:
            if(settings.length > 0) {
                // A setting for the user already exists, so an UPDATE should be executed:
                FYSCloud.API.queryDatabase(
                    "UPDATE `setting` SET `languageId` = ?, `profileVisibilityId` = ?, `sameGender` = ?, `displayGenderId` = ?, `notifcationId` = ?, `maxDistance` = ?, `radialDistance` = ? WHERE `setting`.`userId` = ?",
                    [languageId, profileVisibilityId, sameGender, displayGenderId, 0, maxDis, radDis, sessionUserId]
                ).done(function() {
                    // Password checking and update when necessary:

                    // Check if an attempt to change the password has been made:
                    if(pwdFilledIn) {
                        // Check if current password is entered correctly:
                        if(newPwdMatchesOld) {
                            // Check if the password to be changed has been properly confirmed:
                            if (pwdRepeatMatch) {
                                FYSCloud.API.queryDatabase(
                                    "UPDATE `user` SET `password` = ? WHERE `user`.`id` = ?;",
                                    [pwdInput.value, sessionUserId]
                                ).done(function () {
                                    window.location.href = "homepage.html";
                                }).fail(function (reason) {
                                    console.log(reason);
                                });
                            } else {
                                alert("Repeated password does not match.")
                            }
                        }
                        else {
                            alert("Current password is incorrect")
                        }
                    }
                    else {
                        window.location.href = "homepage.html";
                    }
                });
            }
            else {
                // There is no setting available yet, creating new setting, execute INSERT:
                FYSCloud.API.queryDatabase(
                    "INSERT INTO `setting` (`id`, `userId`, `languageId`, `profileVisibilityId`, `sameGender`, `displayGenderId`, `notifcationId`, `maxDistance`, `radialDistance`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [sessionUserId, languageId, profileVisibilityId, sameGender, displayGenderId, 0, maxDis, radDis]
                ).done(function() {
                    // Password checking and update when necessary:

                    // Check if an attempt to change the password has been made:
                    if(pwdFilledIn) {
                        // Check if current password is entered correctly:
                        if(newPwdMatchesOld) {
                            // Check if the password to be changed has been properly confirmed:
                            if (pwdRepeatMatch) {
                                FYSCloud.API.queryDatabase(
                                    "UPDATE `user` SET `password` = ? WHERE `user`.`id` = ?;",
                                    [pwdInput.value, sessionUserId]
                                ).done(function () {
                                    window.location.href = "homepage.html";
                                }).fail(function (reason) {
                                    console.log(reason);
                                });
                            } else {
                                alert("Repeated password does not match.")
                            }
                        }
                        else {
                            alert("Current password is incorrect")
                        }
                    }
                    else {
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
