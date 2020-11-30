/**
 * Check whether the page is currently accessed by a Admin Profile.
 */
var isOnAdminProfile = false;
/**
 * name of the current menu. ex: 'home/statistics'.
 */
var currentMenuType = 'home';
/**
 * Check whether the navigation is visible on the screen.
 */
var isNavigationVisible = true;

$("head").append('<link rel="stylesheet" href="Content/CSS/header.css">');
$("head").append('<link rel="stylesheet" href="Content/CSS/footer.css">');

// "is a shorthand for : $(document).ready(function() { ... });"
$(function (){
    $.get("Views/general-header.html", function (data) {
        $("body").prepend($(data));
        $("head").append('<script src="Scripts/header.js"></script>');

    });
    //Voeg toe aan het einde van de pagina.
    $.get("Views/general-footer.html", function (data){
        $("body").append($(data));
        $("head").append(`<script src="Scripts/footer.js"></script>`);
    });

});
