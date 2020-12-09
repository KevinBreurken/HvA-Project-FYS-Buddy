let currentUserID = getCurrentUserID();
console.log("currentUserID = " + currentUserID);
if (currentUserID === undefined) {
    console.log("Not logged in");
}
/** Redirect when not logged in */
let appElement = document.getElementById("app");
if (appElement !== null) {
    let attrElement = appElement.getAttribute("data-pageType");
    if (attrElement === "user" || attrElement === "admin") {
        //Check if user is logged in.
        if (getCurrentUserID() === undefined)
            window.open("index.html", "_self");
    }
    if (attrElement === "admin") {
        FYSCloud.API.queryDatabase(
                `SELECT * from userrole WHERE userid = ? AND roleId = ?`,
            [getCurrentUserID(), 2]// 2 == Admin ID
        ).done(function (data) {
            //If no entry of an admin role is found..
            if (data.length === 0) {
                if (getCurrentUserID() === undefined)
                    window.open("index.html", "_self");
                else
                    window.open("homepage.html", "_self");
            }
        }).fail(function (reason) {
            console.log(reason);
        });
    }
}

function redirectToHome() {
    let appElement = document.getElementById("app");
    if (appElement !== null) {
        let attrElement = appElement.getAttribute("data-pageType");
        if (attrElement === "user") {
            window.open("homepage.html", "_self");
        }
        if (attrElement === "admin") {
            window.open("admin-profile.html", "_self");
        }
    }
}

let headElement = $('head');
//add the general stylesheet to the page's header.
// headElement.append('<link rel="stylesheet" type="text/css" href="Content/CSS/default.css">');
//add the favicon to the page's header.
headElement.append(`<link rel='shortcut icon' type='image/x-icon' href='Content/Images/favicon.ico'/>`);
//add the config file
headElement.append(`<title>Corendon Travel Buddy</title>`);

/** Localisation */
FYSCloud.Localization.CustomTranslations = (function ($) {
    const exports = {
        addTranslationJSON: addTranslationJSON,
        setLanguage: setLanguage,
        getLanguage: getLanguage,
        getStringFromTranslations: getStringFromTranslations
    };

    var currentLanguage;
    var currentTranslations;

    function setLanguage(language) {
        currentLanguage = language;
        FYSCloud.Localization.switchLanguage(currentLanguage);
        //Fire an event.
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

    function addTranslationJSON(jsonObject) {
        if (currentTranslations === undefined)
            currentTranslations = jsonObject;
        else
            $.extend(currentTranslations, jsonObject);
        FYSCloud.Localization.setTranslations(currentTranslations);
        FYSCloud.Localization.translate(false);
    }

    return exports;
})(jQuery);

/** Sessions */
function setCurrentUserID(id) {
    FYSCloud.Session.set("userID", `${id}`);
}

function getCurrentUserID() {
    return FYSCloud.Session.get("userID");
}

function closeSession() {
    /** Statistics - Set page visit */
    var name = window.location.pathname
        .split("/")
        .filter(function (c) {
            return c.length;
        })
        .pop();
    FYSCloud.API.queryDatabase(
            `INSERT INTO adminpagedata (name, visitcount, logoutamount) VALUES(?, 0,1) ON DUPLICATE KEY UPDATE
        logoutamount = logoutamount + 1`,
        [name]
    ).done(function (data) {
    }).fail(function (reason) {
        console.log(reason);
    });
    FYSCloud.Session.clear();
    window.open("index.html", "_self");
}

function redirectToProfileById(id) {
    FYSCloud.URL.redirect("profile.html", {
        id: id
    });
}

/** function for getting user data from the database by a promise */
function getDataByPromise(query, queryArray) {
    return new Promise(resolve => {
        FYSCloud.API.queryDatabase(
            query, queryArray
        ).done(function (data) {
            resolve(data);
        }).fail(function (reason) {
            console.log(reason);
        });
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

//TODO: Change this to the users preference.
/** Change language when the Header is Loaded */
var initialLanguage = "nl";
FYSCloud.Localization.CustomTranslations.setLanguage(initialLanguage);
document.addEventListener("headerLoadedEvent", function (event) {
    FYSCloud.Localization.translate(false);
});

/** Statistics - Set page visit */
(function setDatabasePageData() {
    var name = window.location.pathname
        .split("/")
        .filter(function (c) {
            return c.length;
        })
        .pop();
    FYSCloud.API.queryDatabase(
            `INSERT INTO adminpagedata (name, visitcount, logoutamount) VALUES(?, 1,0) ON DUPLICATE KEY UPDATE
        visitcount = visitcount + 1`,
        [name]
    ).done(function (data) {
    }).fail(function (reason) {
        console.log(reason);
    });
})();

async function sendSessionData() {
    $("head").append('<script src="Vendors/Snippets/admin-statistics-snippets.js"></script>');
    const date = new Date();
    const dateWithOffset = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const dateTest = dateWithOffset.toISOString().slice(0, 19).replace('T', ' ');
    await getDataByPromise(`INSERT INTO adminsessiondata (id, logintime, devicetype, browsertype) 
        VALUES(NULL,'${dateTest}','${getDeviceType()}','${detectBrowser()}')`);
}

async function loginUser(id) {
    setCurrentUserID(id);
    await sendSessionData();
    await determineRedirectLocation();
}

async function determineRedirectLocation() {
    let data = await getDataByPromise(`SELECT * from userrole WHERE userid = ? AND roleId = ?`, [getCurrentUserID(), 2]);
    if (data.length === 0)
        window.open("homepage.html", "_self");
    else
        window.open("admin-profile.html", "_self");
}