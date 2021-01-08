document.getElementById("dutch-language").onclick = function () {
    setLanguageSetting("nl", getCurrentUserID())
};

document.getElementById("english-language").onclick = function () {
    setLanguageSetting("en", getCurrentUserID())
};


async function setLanguageSetting(languageKey, userId) {
    //Retrieve data of users settings.
    const currentUserSetting = await getDataByPromise(`SELECT * FROM setting WHERE userId = ?;`,
        [userId]);
    //Retrieve data of given language type.
    const currentLanguage = await getDataByPromise(`SELECT *
                                                    FROM language
                                                    WHERE languageKey = ?;`,
        [languageKey]);

    //Does this user have settings?
    if (currentUserSetting.length > 0) {
        await getDataByPromise(`UPDATE setting
                          SET languageId = ?
                          WHERE setting.userId = ?`,
            [currentLanguage[0].id, userId]);
    } else {
        //Create new settings.
        await generateDefaultSetting(userId,currentLanguage[0].id);
    }

    //Set the LocalStorage language.
    CustomTranslation.setLanguage(languageKey);
}