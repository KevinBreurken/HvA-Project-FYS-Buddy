let currentPageType;
let appElement = document.getElementById("app");
let currentUserID = getCurrentUserID();
console.log("currentUserID = " + currentUserID);
if (currentUserID === undefined)
    console.log("Not logged in");

(function initialize() {
    $("head").append('<script src="Scripts/custom-language.js"></script>');
    CustomTranslation.loadJSONTranslationFile("Content/Translations/default-translation.json");

    /** Redirect when not logged in */
    if (appElement !== null) {
        currentPageType = appElement.getAttribute("data-pageType");
        setDatabasePageData();
        switch (currentPageType) {
            case "default":
                if (currentUserID !== undefined) //User is logged in, send to homepage
                    window.open("homepage.html", "_self");
                break;
            case "user":
                if (currentUserID === undefined) //We're on an user page and we're not logged in, send to index.
                    window.open("index.html", "_self");
                checkIfUserIsDeactivated();
                break;
            case "admin":
                if (currentUserID === undefined) //We're on an admin page and not logged in, send to index.
                    window.open("index.html", "_self");

                checkIfUserIsDeactivated();
                getDataByPromise(`SELECT * from user WHERE id = ? AND userRole = ?`,
                    [currentUserID, 2]).then((data) => {
                    if (data.length === 0) {
                        const redirectURL = (currentUserID === undefined) ? "index.html" : "homepage.html";
                        window.open(redirectURL, "_self");
                    }
                });
                break;
            case "deactivated":
                getDataByPromise(`SELECT * FROM setting WHERE userId = ?`,
                    [currentUserID]).then((data) => {
                    if (data.length > 0) {
                        if (Number(data[0].deactivated) === 1)
                            return;
                    }
                    window.open("index.html", "_self");
                });
                break;
        }
    }

    //add general page elements to the head tag.
    let headElement = $('head');
    headElement.append(`<link rel='shortcut icon' type='image/x-icon' href='Content/Images/favicon.ico'/>`);
    headElement.append(`<title>Corendon Travel Buddy</title>`);

    /** Check if this page want to load an translation */
    if (appElement !== null) {
        let transElement = appElement.getAttribute("data-translations");
        if (transElement !== null) {
            CustomTranslation.loadJSONTranslationFile(`Content/Translations/${transElement}.json`);
        }
    }

    /** Change language to LocalStorage setting**/
    var initialLanguage = FYSCloud.Session.get("language", "nl");
    CustomTranslation.setLanguage(initialLanguage);
})();

/**
 * Changes the userID set in the users localStorage.
 */
function setCurrentUserID(id) {
    FYSCloud.Session.set("userID", `${id}`);
}

/**
 * Returns the value of the current user set in the localStorage.
 */
function getCurrentUserID() {
    return FYSCloud.Session.get("userID");
}

/**
 * Redirects a user to reactivation page for reactivating accounts that are deactivated.
 */
function checkIfUserIsDeactivated() {
    getDataByPromise(`SELECT *
        FROM setting
        WHERE userId = ?`,
        [currentUserID]).then((data) => {
        if (data.length > 0) {
            if (Number(data[0].deactivated) === 1) {
                window.open("reactivate.html", "_self");
            }
        }
    });
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
    let name = window.location.pathname
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
function setDatabasePageData() {
    //we don't want to send page data as an admin.
    if (currentPageType === "admin")
        return;
    let name = window.location.pathname.split("/").filter(function (c) {
        return c.length;
    }).pop();

    getDataByPromise(`INSERT INTO adminpagedata (name, visitcount, logoutamount) VALUES(?, 1,0) ON DUPLICATE KEY UPDATE
        visitcount = visitcount + 1`,
        [name]);
}

/**
 * Stores the users session and performs login related tasks.
 * @param id userID of the user.
 */
async function loginUser(id) {
    setCurrentUserID(id);
    await setLanguageBySettingsData(id);
    await sendSessionData();
    await redirectUserByUserRole();
}

/**
 * Retrieves the language data of the user's setting, creates a new setting if the user has none.
 * @returns {Promise<void>}
 */
async function setLanguageBySettingsData(userId) {
    //Retrieve data of users settings.
    const currentUserSetting = await getDataByPromise(`SELECT * FROM setting WHERE userId = ?;`,
        [userId]);

    //User has no settings, add an new settings
    if (currentUserSetting <= 0) {
        //Get the language data so we know what ID we need to set..
        const currentLanguage = await getDataByPromise(`SELECT *
                                                        FROM language
                                                        WHERE languageKey = ?;`,
            [CustomTranslation.getLanguage()]);
        //Insert new setting.
        await generateDefaultSetting(userId, currentLanguage[0].id);
    } else {
        //Retrieve data of given language type.
        const currentLanguage = await getDataByPromise(`SELECT *
                                                        FROM language
                                                        WHERE id = ?;`,
            [currentUserSetting[0].languageId]);

        //Set the LocalStorage language.
        CustomTranslation.setLanguage(currentLanguage[0].languageKey);
    }
}

async function generateDefaultSetting(userId, languageId) {
    await getDataByPromise(`INSERT INTO setting (id, userId, languageId, profileVisibilityId, sameGender,
                                               displayGenderId, notifcationId, maxDistance, radialDistance)
                          VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, languageId, 1, 1, 1, 0, 11, 100]);
}

/**
 * Sends session data to the FYS database.
 */
async function sendSessionData() {
    if (document.getElementById("statistics-snippet") === null)
        $("head").append('<script src="Vendors/Snippets/admin-statistics-snippets.js" id="statistics-snippet"></script>'); //Required for session data.
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
    let data = await getDataByPromise(`SELECT * from user WHERE id = ? AND userRole = ?`, [getCurrentUserID(), 2]);
    if (data.length === 0)
        window.open("homepage.html", "_self");
    else
        window.open("admin-profile.html", "_self");
}
