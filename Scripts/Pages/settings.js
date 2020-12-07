// Validation
let validation = true;

// User
let users;
let currentUser;
let firstname;
let middlename;
let lastname;

// Get user settings:
// TODO: Use session user id instead:
let sessionUserId = getCurrentUserID();

// Distance
let distanceControls;
let distanceRange;
let distanceMax;
let distanceResult;

// Language
const languageControl = document.getElementById("language");
let languageOptions;
let initialLanguageKey;
let translations;

// TODO: only get the user information of users who communicated to the current user stored in the session.
// Get users:
FYSCloud.API.queryDatabase(
    "SELECT * FROM user"
).done(function(data) {
    users = data;
}).fail(function(reason) {
    console.log(reason);
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM `setting` WHERE `userId` = ?",
    [sessionUserId]
).done(function(setting) {
    // Check if a setting exists for a user:
    FYSCloud.API.queryDatabase(
        "SELECT * FROM `language`"
    ).done(function(languages) {
        // Languages:
        // Using FYS Cloud API must use the correct database, if page appears incorrect,
        // please make sure to configure config.js to the appropriate database.

        // Pass languages to form submission event:
        applySettingsEventlistener(languages);

        // Populate language dropdown:
        setLanguages(languages);

        // Initial language can be set here:
        // initialLanguageKey = languages[0].languageKey;

        // A way to get language could be by using a function which returns:
        //initialLanguageKey = getLanguageKeyByUser(languages, sessionUserId);

        // TODO: Use promises to move this to a function and return the appropriate language key:
        // Get initial language by looking into user settings (if it exists):
        if(setting.length > 0) {
            // Get the stored language key for a user:
            for(let i = 0; i < languages.length; i++) {
                if(setting[0].languageId === languages[i].id) {
                    // Set the appropriate language key (such as "nl" for Dutch or "en" for English):
                    initialLanguageKey = languages[i].languageKey;
                }
            }
        }
        // Set the language of the page the configured language:
        setLanguage(initialLanguageKey);
    }).fail(function(reason) {
        console.log(reason);
    });

    // Set the language of the page the configured language:
    setLanguage(initialLanguageKey);
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
                    matchesOnly: {
                        nl: "Alleen matches",
                        en: "Matches only"
                    },
                    justMe: {
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

    languageControl.addEventListener("change", function() {
        FYSCloud.Localization.CustomTranslations.setLanguage($(this).val());
    });
}

// Gets a set language for a given user, returns a language as a string:
function getLanguageByUser(languages, userId) {
    if(typeof languages === "undefined") {
        FYSCloud.API.queryDatabase(
            "SELECT * FROM languages"
        ).done(function(languages) {
            for (let i = 0; i < languages.length; i++) {
                if(languages[i].id === getLanguageIdByUser(userId)) {
                    return languages[i].languageKey;
                }
            }
        }).fail(function(reason) {
            console.log(reason);
        });
    }
    else {
        for (let i = 0; i < languages.length; i++) {
            if(languages[i].id === getLanguageIdByUser(userId)) {
                return languages[i].languageKey;
            }
        }
    }
}

// console.log(getLanguageIdByUser(1));
// let myPromise = new Promise(function(myResolve, myReject) {
//     FYSCloud.API.queryDatabase(
//         "SELECT * FROM `fys_is111_1_barry`.`settings` WHERE `userId` = ?",
//         [userId]
//     ).done(function(setting) {
//         console.log("returning languageId: " + setting[0].languageId);
//         return setting[0].languageId;
//     }).fail(function(reason) {
//         console.log(reason);
//         return 0;
//     });
// });
//
// // Gets a set language for a given user, returns a languageId:
// function getLanguageIdByUser(userId) {
//     userId = typeof userId === "undefined" ? 0 : userId;
//     FYSCloud.API.queryDatabase(
//         "SELECT * FROM `fys_is111_1_barry`.`settings` WHERE `userId` = ?",
//         [userId]
//     ).done(function(setting) {
//         console.log("returning languageId: " + setting[0].languageId);
//         return setting[0].languageId;
//     }).fail(function(reason) {
//         console.log(reason);
//         return 0;
//     });
// }

// Distance handling:
// Get distance control elements:
distanceControls = document.querySelector("#distance-controls");
// Get maximum distance:
distanceMax = document.querySelector("#maxDistance");
// Get provided distance:
distanceRange = document.querySelector("#distance");
// Get element to print result in:
distanceResult = document.querySelector("#distanceResult");

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

// Block handling:
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

        for(let i = 0; i < users.length; i++) {
            // null checking
            firstname = users[i].firstname == null ? "" : users[i].firstname + " ";
            middlename = users[i].middlename == null ? "" : users[i].middlename + " ";
            lastname = users[i].lastname == null ? "" : users[i].lastname + " ";

            if(firstname.toUpperCase().indexOf(providedInput) > -1
                || middlename.toUpperCase().indexOf(providedInput) > -1
                || lastname.toUpperCase().indexOf(providedInput) > -1) {
                result += "<div class=\"user-card\">" +
                    "<div class=\"user-card-image\"></div>" +
                    "<div class=\"user-card-content\">" +
                    "<div class=\"card-info\">" + firstname + middlename + lastname + "<br />Eventual information...</div>" +
                    "<div class=\"card-control\">" +
                    "<button>Block</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
            }
        }

        // // temp:
        // const users = ["Barry Stavenuiter", "Dylan van den Berg", "Hanna Toenbreker", "Kiet van Wijk", "Kevin Breurken", "Irene Doodeman", "Chris Verra"];
        // // Loop through collection of users and compare it to provided input for matching results:
        // let providedInput = this.value.toUpperCase();
        // for(let i = 0; i < users.length; i++) {
        //     if(users[i].toUpperCase().indexOf(providedInput) > -1) {
        //         result += "<div class=\"user-card\">" +
        //             "<div class=\"user-card-image\"></div>" +
        //             "<div class=\"user-card-content\">" +
        //             "<div class=\"card-info\">" + users[i] + "<br />Eventual information...</div>" +
        //             "<div class=\"card-control\">" +
        //             "<button>Block</button>" +
        //             "</div>" +
        //             "</div>" +
        //             "</div>";
        //     }
        // }


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

// Validation:
let pwdInput = document.querySelector("#newAccountPassword");
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
    }

    // Validate length
    const lengthValRequired = 8;
    if(this.value.length >= lengthValRequired) {
        lengthVal.classList.remove("invalid");
        lengthVal.classList.add("valid");
    } else {
        lengthVal.classList.remove("valid");
        lengthVal.classList.add("invalid");
    }

    // If everything has been entered correctly or field was left empty
    if(this.value.match(lowerCaseLettersReg) && this.value.match(upperCaseLettersReg) && this.value.match(numbersReg) && this.value.length >= lengthValRequired || this.value === "") {
        validation = true;
    }
});

// Check whether own gender should only be shown:
document.querySelector("#showOwnGenderOnly").addEventListener("change", function() {
    if(this.checked) {
        //TODO: Get information from back-end related to what logged in person's gender identify as.

        // temp:
        currentUser = users[0];
        // null checking
        firstname = currentUser.firstname == null ? "" : currentUser.firstname + " ";
        middlename = currentUser.middlename == null ? "" : currentUser.middlename + " ";
        lastname = currentUser.lastname == null ? "" : currentUser.lastname + " ";
        // logging
        console.log("User " + firstname + middlename + lastname + "is of gender \'" + currentUser.gender + "\'");

        if(currentUser.gender.toLowerCase() === "other") {
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

// TODO: Remove alerts
function applySettingsEventlistener(languages) {
    document.getElementById("apply").addEventListener("click", function (event) {
        event.preventDefault();

        // Validate fields on submition:
        if (validation) {
            // TODO: Store all information related to changes made to settings (language is done).
            let languageId;

            // Get appropriate language identifer dependant on the selection of the language
            for(let i = 0; i < languages.length; i++) {
                if(languages[i].languageKey === languageControl.value) {
                    languageId = languages[i].id;
                }
            }

            // Check whether a setting already exists for provided user:
            FYSCloud.API.queryDatabase(
                "SELECT * FROM `setting` WHERE `userId` = ?",
                [sessionUserId]
            ).done(function(setting) {
                if(setting.length > 0) {
                    // Check whether setting contains the same language id already, preventing the creation of duplicate setting records:
                    if(setting[0].languageId === languageId) {
                        //A setting containing given languageId already exists.
                        alert("Do nothing as already exists.");
                        window.location.href = "homepage.html";
                    }
                    else {
                        alert("Updating");
                        // There's already an existing setting, execute update:
                        FYSCloud.API.queryDatabase(
                            "UPDATE `setting` SET `languageId` = ? WHERE `setting`.`userId` = ?;",
                            [languageId, sessionUserId]
                        ).done(function() {
                            window.location.href = "homepage.html";
                        }).fail(function (reason) {
                            console.log(reason);
                        });
                    }
                }
                else {
                    alert("Inserting");
                    // There is no setting available yet, creating new setting, execute insert:
                    FYSCloud.API.queryDatabase(
                        //"INSERT INTO `settings` (`id`, `userId`, `languageId`) VALUES (NULL, '1', '1');"
                        "INSERT INTO `setting` (`id`, `userId`, `languageId`, `profileAvailabilityId`, `displayGenderId`, `notifcationId`, `maxDistance`, `radialDistance`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?);",
                        [sessionUserId, languageId, 0, 0, 0, 0, 0]
                    ).done(function() {
                        window.location.href = "homepage.html";
                    }).fail(function (reason) {
                        console.log(reason);
                    });
                }
            });
        } else {
            alert("Some fields are entered incorrectly!");
            event.preventDefault();
        }
    });
}

// On cancellation:
/*document.querySelector("#cancel").addEventListener("click", function() {
    window.location.href = "index.html";
})*/

/* Some sample code to pull a HTML file
var request = new XMLHttpRequest();

request.open('GET', '/somepage', true);

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        var resp = request.responseText;

        document.querySelector('#div').innerHTML = resp;
    }
};

request.send();*/
