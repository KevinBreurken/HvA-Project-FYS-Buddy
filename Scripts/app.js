let headElement = $('head');
//add the general stylesheet to the page's header.
headElement.append('<link rel="stylesheet" type="text/css" href="Content/CSS/default.css">');
//add the favicon to the page's header.
headElement.append(`<link rel='shortcut icon' type='image/x-icon' href='Content/Images/favicon.ico'/>`);
//add the config file
headElement.append(`<title>Corendon Travel Buddy</title>`);

/** Localisation */
FYSCloud.Localization.Buddy = (function ($) {
    const exports = {
        addTranslationJSON: addTranslationJSON
    };
    var currentTranslations;
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

//TODO: Change this to the users preference.
var initialLanguage = "nl";
$(function () {
    FYSCloud.Localization.switchLanguage(initialLanguage);
});


/** Sessions */
let currentUserID = FYSCloud.Session.get("userID",-1);
console.log("currentUserID = " + currentUserID);
if(currentUserID === -1){
    console.log("Not logged in");
}

function setCurrentUserID(id){
    FYSCloud.Session.set("userID",id);
}

function getCurrentUserID(){
    return currentUserID;
}

function closeSession(){
    window.open("index.html","_self");
    FYSCloud.Session.set("userID",-1);
}