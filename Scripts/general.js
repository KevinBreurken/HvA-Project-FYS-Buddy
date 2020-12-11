var headerTranslations = {
    header: {
        navigation: {
            home: {
                nl: "Home",
                en: "Home"
            },
            profile: {
                nl: "Profiel",
                en: "Profile"
            },
            settings: {
                nl: "Instellingen",
                en: "Settings"
            },
            help: {
                nl: "Help",
                en: "Help"
            }
        },
        adminNavigation: {
            account: {
                nl: "Account",
                en: "Account"
            },
            overview: {
                nl: "Data Overzicht",
                en: "Data Overview"
            },
            statistics: {
                nl: "Statistieken",
                en: "Statistics"
            }
        },
        notificationText: {
            nl: "%name Heeft een contactverzoek verstuurd.",
            en: "%name Has sent a contact request."
        },
        userDisplay: {
            welcomeText: {
                nl: "Welkom,",
                en: "Welcome,"
            },
            signOut: {
                nl: "Uitloggen",
                en: "Log out"
            }
        }
    }
};
FYSCloud.Localization.CustomTranslations.addTranslationJSON(headerTranslations);
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
FYSCloud.Localization.CustomTranslations.addTranslationJSON(footerTranslations);

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
        $("header").prepend($(data));
        $("head").append('<script src="Scripts/header.js"></script>');
    });
    //Voeg toe aan het einde van de pagina.
    $.get("Views/general-footer.html", function (data){
        $("body").append($(data));
        $("head").append(`<script src="Scripts/footer.js"></script>`);
        FYSCloud.Localization.translate(false);
    });

});