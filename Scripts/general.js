/**
 * Requires a webserver to be run.
 */
document.addEventListener('DOMContentLoaded', function () {
    //add the general stylesheet to the header.
    $('head').append('<link rel="stylesheet" type="text/css" href="Content/general.css">');

    //Add the header to the start of the body
    var headerElement = document.createElement('header');
    document.body.insertBefore(headerElement, document.body.firstChild);
    $('header').load("Includes/general-header.html");

    var footerElement = document.createElement('footer');
    document.body.appendChild(footerElement);
    $('footer').load("Includes/general-footer.html");

}, false);
