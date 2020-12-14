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