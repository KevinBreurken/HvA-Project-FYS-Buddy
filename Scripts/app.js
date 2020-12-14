$("head").append('<script src="Vendors/Snippets/admin-statistics-snippets.js"></script>'); //Required for session data.

let currentUserID = getCurrentUserID();
let currentPageType;
console.log("currentUserID = " + currentUserID);
if (currentUserID === undefined)
    console.log("Not logged in");

/** Redirect when not logged in */
let appElement = document.getElementById("app");
if (appElement !== null) {
    currentPageType = appElement.getAttribute("data-pageType");
    switch (currentPageType) {
        case "default":
            if (currentUserID !== undefined) //User is logged in, send to homepage
                window.open("homepage.html", "_self");
            break;
        case "user":
            if (currentUserID === undefined) //We're on an user page and we're not logged in, send to index.
                window.open("index.html", "_self");
            break;
        case "admin":
            if (currentUserID === undefined) //We're on an admin page and not logged in, send to index.
                window.open("index.html", "_self");

            getDataByPromise(`SELECT * from userrole WHERE userid = ? AND roleId = ?`,
                [currentUserID, 2]).then((data) => {
                if (data.length === 0) {
                    const redirectURL = (currentUserID === undefined) ? "index.html" : "homepage.html";
                    window.open(redirectURL, "_self");
                }
            });
            break;
    }
}

let headElement = $('head');
//add general page elements to the head tag.
headElement.append(`<link rel='shortcut icon' type='image/x-icon' href='Content/Images/favicon.ico'/>`);
headElement.append(`<title>Corendon Travel Buddy</title>`);

/** Localisation wrapper*/
FYSCloud.Localization.CustomTranslations = (function ($) {
    const exports = {
        addTranslationJSON: addTranslationJSON,
        setLanguage: setLanguage,
        getLanguage: getLanguage,
        loadJSONTranslationFile: loadJSONTranslationFile,
        getStringFromTranslations: getStringFromTranslations
    };

    let currentLanguage;
    let currentTranslations;

    function setLanguage(language) {
        currentLanguage = language;
        FYSCloud.Session.set("language", currentLanguage);
        FYSCloud.Localization.switchLanguage(currentLanguage);
        //Fire an language event.
        document.dispatchEvent(new CustomEvent("languageChangeEvent", {
            detail: {id: currentLanguage}
        }));
    }

    function getLanguage() {
        return currentLanguage;
    }

    /**
     *  Partially used code form FYSCloud translate function.
     *  See FYSCloud documentation.
     */
    function getStringFromTranslations(translateKey, languageID) {
        //no language is given, use current language.
        if (languageID === undefined)
            languageID = currentLanguage;

        const localizeKeys = translateKey.split(".");

        let result = currentTranslations;
        for (let i = 0; i < localizeKeys.length; i++) {
            result = result[localizeKeys[i]];
            if (result === undefined) {
                break;
            }
        }

        return result[languageID];
    }

    /**
     * Combines multiple translation objects into one.
     */
    function addTranslationJSON(jsonObject) {
        if (currentTranslations === undefined)
            currentTranslations = jsonObject;
        else
            $.extend(currentTranslations, jsonObject);

        console.log(currentTranslations);
        FYSCloud.Localization.setTranslations(currentTranslations);
        FYSCloud.Localization.translate(false);
    }

    function loadJSONTranslationFile(fileURL) {
        $.getJSON(fileURL, function (json) {
            addTranslationJSON(json);
        });
    }

    return exports;
})(jQuery);

/** Check if this page want to load an translation */
if (appElement !== null) {
    let transElement = appElement.getAttribute("data-translations");
    console.log(transElement);
    if (transElement !== null) {
        FYSCloud.Localization.CustomTranslations.loadJSONTranslationFile(`Content/Translations/${transElement}.json`);
    }
}

//TODO: Change this to the users preference.
/** Change language when the Header is Loaded */
var initialLanguage = FYSCloud.Session.get("language", "nl");
FYSCloud.Localization.CustomTranslations.setLanguage(initialLanguage);

document.addEventListener("headerLoadedEvent", function (event) {
    FYSCloud.Localization.translate(false);
});

/**
 * Changes the userID set in the users local storage.
 */
function setCurrentUserID(id) {
    FYSCloud.Session.set("userID", `${id}`);
}

/**
 * Returns the value of the current user set in the local storage.
 */
function getCurrentUserID() {
    return FYSCloud.Session.get("userID");
}

/**
 * Sends the user back to it's most appropriate page (called by clicking banner image)
 */
function redirectToHome() {
    switch (currentPageType) {
        case "default":
            window.open("index.html", "_self");
            break;
        case "user":
            window.open("homepage.html", "_self");
            break;
        case "admin":
            window.open("admin-profile.html", "_self");
            break;
    }
}

/**
 * Closes an session and sends the user back to the index page.
 */
function closeSession() {
    /** Statistics - Set page visit */
    var name = window.location.pathname
        .split("/")
        .filter(function (c) {
            return c.length;
        })
        .pop();
    getDataByPromise(`INSERT INTO adminpagedata (name, visitcount, logoutamount) VALUES(?, 0,1) ON DUPLICATE KEY UPDATE
        logoutamount = logoutamount + 1`,
        [name]);
    FYSCloud.Session.clear();
    window.open("index.html", "_self");
}

/**
 * Sends the user to the profile page with the given usedID.
 * @param id id op the profile being opened.
 */
function redirectToProfileById(id) {
    FYSCloud.URL.redirect("profile.html", {
        id: id
    });
}

/** default function for getting user data from the database by a promise */
function getDataByPromise(query, queryArray) {
    return new Promise((resolve, reject) => {
        FYSCloud.API.queryDatabase(query, queryArray)
            .done(data => resolve(data))
            .fail(reason => reject(reason));
    });
}

/**
 *
 * @param date The date format from javascript
 * @returns A date value for <input type="date">
 */
function parseDateToInputDate(date) {
    let parsedDate = new Date(date);
    let day = ("0" + parsedDate.getDate()).slice(-2)
    let month = ("0" + (parsedDate.getMonth() + 1)).slice(-2)
    return parsedDate.getFullYear() + "-" + (month) + "-" + (day)
}

/** Sends page related statistics to the database */
(function setDatabasePageData() {
    //we don't want to send page data as an admin.
    if (currentPageType === "admin")
        return;
    var name = window.location.pathname.split("/").filter(function (c) {
        return c.length;
    }).pop();

    getDataByPromise(`INSERT INTO adminpagedata (name, visitcount, logoutamount) VALUES(?, 1,0) ON DUPLICATE KEY UPDATE
        visitcount = visitcount + 1`,
        [name]);
})();

/**
 * Stores the users session and performs login related tasks.
 * @param id userID of the user.
 */
async function loginUser(id) {
    setCurrentUserID(id);
    await sendSessionData();
    await redirectUserByUserRole();
}

/**
 * Sends session data to the FYS database.
 */
async function sendSessionData() {
    const date = new Date();
    const dateWithOffset = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const dateTest = dateWithOffset.toISOString().slice(0, 19).replace('T', ' ');
    await getDataByPromise(`INSERT INTO adminsessiondata (id, logintime, devicetype, browsertype) 
        VALUES(NULL,'${dateTest}','${getDeviceType()}','${detectBrowser()}')`);
}

/**
 * sends an user to the homepage or admin-profile by its user role.
 */
async function redirectUserByUserRole() {
    let data = await getDataByPromise(`SELECT * from userrole WHERE userid = ? AND roleId = ?`, [getCurrentUserID(), 2]);
    if (data.length === 0)
        window.open("homepage.html", "_self");
    else
        window.open("admin-profile.html", "_self");
}
