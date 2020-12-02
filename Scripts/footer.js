var footerTranslations = {
    footer:{
        changeLanguage:{
            nl: "Verander Taal",
            en: "Change Language"
        },
        dutchLanguage:{
            nl: "Nederlands",
            en: "Dutch"
        },
        englishLanguage:{
            nl: "Engels",
            en: "English"
        },
        links:{
            nl: "Links",
            en: "Links"
        },
        help:{
            nl: "Hulp Pagina",
            en: "Help Page"
        },
        contact:{
            nl: "Contact",
            en: "Contact"
        },
        vacations:{
            nl: "Corendon Vakanties",
            en: "Corendon Vacations"
        }
    }
};

$(function () {
    FYSCloud.Localization.Buddy.addTranslationJSON(footerTranslations);
});

document.getElementById("dutch-language").onclick = function (){
    FYSCloud.Localization.Buddy.setLanguage('nl');
    //TODO: Set users language preference in database.
};

document.getElementById("english-language").onclick = function (){
    FYSCloud.Localization.Buddy.setLanguage('en');
    //TODO: Set users language preference in database.
};