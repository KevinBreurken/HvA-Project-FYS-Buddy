/*
    Custom translation wrapper for FYSCloud related functions.
*/
CustomTranslation = (function ($) {
    const exports = {
        translate: translate,
        addTranslationJSON: addTranslationJSON,
        setLanguage: setLanguage,
        getLanguageKey: getLanguageKey,
        loadJSONTranslationFile: loadJSONTranslationFile,
        getStringFromTranslations: getStringFromTranslations
    };

    let currentLanguageKey = 'nl';
    let currentTranslations;

    /*
    Translates text by stored languageKey.
    has an option to force translation.
     */
    function translate(force) {
        FYSCloud.Localization.translate(force);
    }

    /*
    Changes the stored language applies it to the FYSCloud functions.
     */
    function setLanguage(language) {
        currentLanguageKey = language;
        FYSCloud.Session.set("language", currentLanguageKey);
        FYSCloud.Localization.switchLanguage(currentLanguageKey);
        //Fire an language event.
        document.dispatchEvent(new CustomEvent("languageChangeEvent", {
            detail: {id: currentLanguageKey}
        }));
    }

    /*
    Returns stored language key.
     */
    function getLanguageKey() {
        return currentLanguageKey;
    }

    /*
    Retrieves an translation string by an given translate key.

    Partially used code from FYSCloud translate function.
    See FYSCloud documentation.
     */
    function getStringFromTranslations(translateKey, languageID) {
        //No language is given, use current language.
        if (languageID === undefined)
            languageID = currentLanguageKey;

        const localizeKeys = translateKey.split(".");

        let result = currentTranslations;
        for (let i = 0; i < localizeKeys.length; i++) {
            result = result[localizeKeys[i]];
            if (result === undefined)
                break;
        }

        return result[languageID];
    }

    /*
    Combines multiple translation objects into one.
     */
    function addTranslationJSON(jsonObject) {
        currentTranslations === undefined ? currentTranslations = jsonObject : $.extend(currentTranslations, jsonObject);

        FYSCloud.Localization.setTranslations(currentTranslations);
        CustomTranslation.translate(false);
    }

    /*
    Loads an JSON object from an JSON file.
     */
    function loadJSONTranslationFile(fileURL) {
        $.getJSON(fileURL, function (json) {
            addTranslationJSON(json);
        });
    }

    return exports;
})(jQuery);