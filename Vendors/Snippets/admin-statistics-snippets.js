/**
 * snippet from:
 * https://dev.to/itsabdessalam/detect-current-device-type-with-javascript-490j
 * 
 * Detects which device is running this function.
 * @returns {string} device type of the user.
 */
const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (
        /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        return "mobile";
    }
    return "desktop";
};

/**
 * snippet from:
 * https://www.codegrepper.com/code-examples/delphi/javascript+detect+browser+chrome+firefox
 *
 * Detects which browser is running this function.
 * @returns {string} type name of the browser.
 */
function detectBrowser() {
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) !== -1 ) {
        return 'Opera';
    } else if(navigator.userAgent.indexOf("Chrome") !== -1 ) {
        return 'Chrome';
    } else if(navigator.userAgent.indexOf("Safari") !== -1) {
        return 'Safari';
    } else if(navigator.userAgent.indexOf("Firefox") !== -1 ){
        return 'Firefox';
    } else if((navigator.userAgent.indexOf("MSIE") !== -1 ) || (!!document.documentMode === true )) {
        return 'IE';
    } else {
        return 'Unknown';
    }
}
