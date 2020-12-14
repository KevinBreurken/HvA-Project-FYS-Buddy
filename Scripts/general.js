FYSCloud.Localization.CustomTranslations.loadJSONTranslationFile("Content/Translations/header-translation.json");
FYSCloud.Localization.CustomTranslations.loadJSONTranslationFile("Content/Translations/footer-translation.json");

$("head").append('<link rel="stylesheet" href="Content/CSS/header.css">');
$("head").append('<link rel="stylesheet" href="Content/CSS/footer.css">');
// "is a shorthand for : $(document).ready(function() { ... });"
$(function (){
    $.get("Views/general-header.html", function (data) {
        $("header").prepend($(data));
        $("head").append('<script src="Scripts/header.js"></script>');
    });
    //Voeg toe aan het einde van de pagina.
    $.get("Views/general-footer.html", function (data){
        $("body").append($(data));
        $("head").append(`<script src="Scripts/footer.js"></script>`);
    });

});