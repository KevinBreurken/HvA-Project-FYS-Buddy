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
        return "Tablet";
    }
    if (
        /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        return "Mobile";
    }
    return "Desktop";
};

/**
 * snippet from:
 * https://www.codegrepper.com/code-examples/delphi/javascript+detect+browser+chrome+firefox
 *
 * Detects which browser is running this function.
 * @returns {string} type name of the browser.
 */
function detectBrowser() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) !== -1) {
        return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
        return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") !== -1) {
        return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
        return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") !== -1) || (!!document.documentMode === true)) {
        return 'IE';
    } else {
        return 'Unknown';
    }
}

/**
 * snippet from:
 * https://codereview.stackexchange.com/questions/177962/find-the-most-common-number-in-an-array-of-numbers
 * Looks through an array to find the most common occurring element.
 */
function findCommon(arr) {
    var max = 1,
        m = [],
        val = arr[0],
        i, x;

    for (i = 0; i < arr.length; i++) {
        x = arr[i]
        if (m[x]) {
            ++m[x] > max && (max = m[i], val = x);
        } else {
            m[x] = 1;
        }
    }
    return val;
}

/**
 * snippet from:
 * https://stackoverflow.com/a/49448231
 * Detects what browser is currently used.
 */
function detectBrowser() {
    var test = function(regexp) {return regexp.test(window.navigator.userAgent)}
    switch (true) {
        case test(/edg/i): return "Microsoft Edge";
        case test(/trident/i): return "Microsoft Internet Explorer";
        case test(/firefox|fxios/i): return "Mozilla Firefox";
        case test(/opr\//i): return "Opera";
        case test(/ucbrowser/i): return "UC Browser";
        case test(/samsungbrowser/i): return "Samsung Browser";
        case test(/chrome|chromium|crios/i): return "Google Chrome";
        case test(/safari/i): return "Apple Safari";
        default: return "Other";
    }
}
