CustomTranslation.loadJSONTranslationFile("Content/Translations/mailer-translation.json")

/*
Sends an email to the FYSCloud API.
 */
function sendMail(email, mailName, subject, html) {
    FYSCloud.API.sendEmail({
        from: {
            name: "Find your travel Buddy - Corendon IS111-1",
            address: "group@fys.cloud"
        },
        to: [
            {
                name: mailName,
                address: email
            }
        ],
        subject: subject,
        html: (html + `<img src="http://drive.google.com/uc?export=view&id=1kMlZl0nUAPt2jxgH2jeG2hWGiKL_X3Cp" width="400px">`)
    });
}
/*
Sends an friend type email (request/accepted) to an usedId.
 */
async function sendFriendEmail(idOfRecipient, textPrefix) {
    //Check if this user has any settings
    const recipientSetting = await getDataByPromise('SELECT * FROM setting WHERE userId = ?', idOfRecipient);
    if (recipientSetting.length === 0)
        return;
    //Check if the user wants any notifications
    if (recipientSetting[0].notifcationId === 0)
        return;
    //Retrieve the language key
    const userLanguage = await getDataByPromise('SELECT * FROM language WHERE id = ?', recipientSetting[0].languageId);

    const url = window.location.href;
    const userData = await getDataByPromise('SELECT * FROM user WHERE id = ?', idOfRecipient);
    const profileData = await getDataByPromise('SELECT * FROM profile WHERE userId = ?', idOfRecipient);
    //Create text elements to place in the e-mail.
    const userName = profileData[0].firstname;
    const title = CustomTranslation.getStringFromTranslations(`mail.${textPrefix}.title`, userLanguage[0].languageKey).replace('%name', userName);
    const body = CustomTranslation.getStringFromTranslations(`mail.${textPrefix}.text`, userLanguage[0].languageKey);
    const link = CustomTranslation.getStringFromTranslations(`mail.${textPrefix}.link`, userLanguage[0].languageKey);
    const subject = CustomTranslation.getStringFromTranslations(`mail.${textPrefix}.subject`, userLanguage[0].languageKey);

    sendMail(userData[0].email, userName, subject,
        `<h1>${title}</h1> <p>${body}</p> <a href='${url}'><p>${link}</p></a>`);
}