let currentUserID = FYSCloud.Session.get("userID");
console.log("currentUserID = " + currentUserID);
if (currentUserID === undefined) {
    console.log("Not logged in");
}
/** Redirect when not logged in */
let appElement = document.getElementById("app");
if (appElement !== undefined) {
    let attrElement = appElement.getAttribute("data-pageType");
    if (attrElement === "user" || attrElement === "admin") {
        //Check if user is logged in.
        if (getCurrentUserID() === undefined)
            window.open("index.html", "_self");
    }
}

function redirectToHome(){
    let appElement = document.getElementById("app");
    if (appElement !== undefined) {
        let attrElement = appElement.getAttribute("data-pageType");
        if (attrElement === "user") {
            window.open("homepage.html", "_self");
        }
        if(attrElement === "admin"){
            window.open("admin-profile.html", "_self");
        }
    }
}

let headElement = $('head');
//add the general stylesheet to the page's header.
headElement.append('<link rel="stylesheet" type="text/css" href="Content/CSS/default.css">');
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
    FYSCloud.Session.set("userID", id);
}

function getCurrentUserID() {
    return currentUserID;
}

function closeSession() {
    window.open("index.html", "_self");
    FYSCloud.Session.clear();
}

//TODO: Change this to the users preference.
/** Change language when the Header is Loaded */
var initialLanguage = "nl";
document.addEventListener("headerLoadedEvent", function (event) {
    FYSCloud.Localization.CustomTranslations.setLanguage(initialLanguage);
});
