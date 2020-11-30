let headElement = $('head');
//add the general stylesheet to the page's header.
headElement.append('<link rel="stylesheet" type="text/css" href="Content/CSS/default.css">');
//add the favicon to the page's header.
headElement.append(`<link rel='shortcut icon' type='image/x-icon' href='Content/Images/favicon.ico'/>`);
//add the config file
headElement.append(`<title>Corendon Travel Buddy</title>`);

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
    }

    return exports;
})(jQuery);

//TODO: Change this to the users preference.
var initialLanguage = "en";
$(function () {
    FYSCloud.Localization.switchLanguage(initialLanguage);
});