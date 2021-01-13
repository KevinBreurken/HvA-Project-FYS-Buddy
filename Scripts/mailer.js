CustomTranslation.loadJSONTranslationFile("Content/Translations/mailer-translation.json")

/*
Sends an email to the FYSCloud API with an Promise.
 */
function sendEmailByPromise(email, mailName, subject, html) {
    return new Promise((resolve, reject) => {
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
            html: html
        }).done(data => resolve(data))
            .fail(reason => reject(reason));
    });
}

/*
Creates an HTML string to send with an e-mail.
 */
async function generateMailHTML(name, textPrefix, linkUrl, languageKey) {
    const title = CustomTranslation.getStringFromTranslations(`mail.${textPrefix}.title`, languageKey).replace('%name', name);
    const body = CustomTranslation.getStringFromTranslations(`mail.${textPrefix}.text`, languageKey);
    const link = CustomTranslation.getStringFromTranslations(`mail.${textPrefix}.link`, languageKey);
    const footerImageHTML = '<img src="http://drive.google.com/uc?export=view&id=1kMlZl0nUAPt2jxgH2jeG2hWGiKL_X3Cp" width="400px">';

    return `<h1>${title}</h1> <p>${body}</p> <a href='${linkUrl}'><p>${link}</p></a>${footerImageHTML}`;
}