document.getElementById("dutch-language").onclick = function () {
    setLanguageSetting("nl", getCurrentUserID())
};

document.getElementById("english-language").onclick = function () {
    setLanguageSetting("en", getCurrentUserID())
};


async function setLanguageSetting(languageKey, userId) {
    //Retrieve data of users settings.
    const currentUserSetting = await getDataByPromise("SELECT * FROM setting WHERE userId = ?;",
        [userId]);
    //Retrieve data of given language type.
    const currentLanguage = await getDataByPromise(`SELECT *
                                                    FROM language
                                                    WHERE languageKey = ?;`,
        [languageKey]);

    //Does this user have settings?
    if (currentUserSetting.length > 0) {
        getDataByPromise(`UPDATE setting
                          SET languageId = ?
                          WHERE setting.userId = ?`,
            [currentLanguage[0].id, userId]);
    } else {
        //Create new settings.
        getDataByPromise("INSERT INTO `setting` (`id`, `userId`, `languageId`, `profileVisibilityId`, `sameGender`, `displayGenderId`, `notifcationId`, `maxDistance`, `radialDistance`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)",
            [userId, currentLanguage[0].id, 1, 1, 1, 0, 11, 500]);
    }

    //Set the LocalStorage language.
    FYSCloud.Localization.CustomTranslations.setLanguage(languageKey);
}