document.getElementById("dutch-language").onclick = function (){
    FYSCloud.Localization.switchLanguage('nl');
    //TODO: Set users language preference in database.
};

document.getElementById("english-language").onclick = function (){
    FYSCloud.Localization.switchLanguage('en');
    //TODO: Set users language preference in database.
};