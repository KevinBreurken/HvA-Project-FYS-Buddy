FYSCloud.Localization.CustomTranslations.loadJSONTranslationFile("Content/Translations/mailer-translation.json")

async function sendFriendEmail(idOfRecipient, textPrefix){
    //Check if this user has any settings
    const recipientSetting = await getDataByPromise(`SELECT * FROM setting WHERE userId = ?`,idOfRecipient);
    if(recipientSetting.length === 0)
        return;
    //Check if the user wants any notifications
    if(recipientSetting[0].notifcationId === 0)
        return;
    //Retrieve the language key
    const userLanguage = await getDataByPromise(`SELECT * FROM language WHERE id = ?`,recipientSetting[0].languageId);

    const url = window.location.href;
    getDataByPromise(`SELECT * FROM user WHERE id = ?`,idOfRecipient).then((userData) => {
        getDataByPromise(`SELECT * FROM profile WHERE userId = ?`,idOfRecipient).then((profileData) => {
            const body = FYSCloud.Localization.CustomTranslations.getStringFromTranslations(`mail.${textPrefix}.text`,userLanguage[0].languageKey);
            const link = FYSCloud.Localization.CustomTranslations.getStringFromTranslations(`mail.${textPrefix}.link`,userLanguage[0].languageKey);
            const subject = FYSCloud.Localization.CustomTranslations.getStringFromTranslations(`mail.${textPrefix}.subject`,userLanguage[0].languageKey);
            sendMail(userData[0].email,profileData[0].firstname,subject,
                `<h1>Hello ${profileData[0].firstname} </h1> <p>${body}</p> <a href='${url}'><p>${link}</p></a>`);

        });
    });
}