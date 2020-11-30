let headElement = $('head');
//add the general stylesheet to the page's header.
headElement.append('<link rel="stylesheet" type="text/css" href="Content/CSS/default.css">');
//add the favicon to the page's header.
headElement.append(`<link rel='shortcut icon' type='image/x-icon' href='Content/Images/favicon.ico'/>`);
//add the config file
headElement.append(`<title>Corendon Travel Buddy</title>`);

FYSCloud.Localization.Buddy = (function ($) {
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
    }

    function getLanguage() {
        return currentLanguage;
    }

    /**
     *  Partially used code form FYSCloud translate function.
     *  See FYSCloud documentation.
     */
    function getStringFromTranslations(translateKey,languageID) {
        //no language is given, use current language.
        if(languageID === undefined)
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
    }

    return exports;
})(jQuery);

//TODO: Change this to the users preference.
var initialLanguage = "en";
$(function () {
    FYSCloud.Localization.Buddy.setLanguage(initialLanguage);
});
