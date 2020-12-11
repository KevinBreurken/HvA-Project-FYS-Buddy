document.getElementById("dutch-language").onclick = function (){
    FYSCloud.Localization.CustomTranslations.setLanguage('nl');
    //TODO: Set users language preference in database.
};

document.getElementById("english-language").onclick = function (){
    FYSCloud.Localization.CustomTranslations.setLanguage('en');
    //TODO: Set users language preference in database.
};