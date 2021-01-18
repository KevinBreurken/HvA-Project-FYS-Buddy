/**
 * Implementation of the FYS.Cloud library
 *
 * @version 0.0.3
 * @author Lennard Fonteijn
 *
 * @namespace FYSCloud
 */
var FYSCloud = (function ($) {
    if (!$) {
        alert("The FYS.Cloud library is dependent on jQuery, which is not loaded!");
    }
    return {};
})(jQuery);

/**
 * API-extension for the FYS.Cloud library
 *
 * @author Lennard Fonteijn
 *
 * @namespace API
 * @memberof FYSCloud
 */
FYSCloud.API = (function ($) {
    var options = {
        url: undefined,
        apiKey: undefined,
        database: undefined,
        environment: undefined
    };
    var exports = {
        configure: configure,
        queryDatabase: configurationError,
        sendEmail: configurationError,
        uploadFile: configurationError,
        deleteFile: configurationError,
        fileExists: configurationError,
        deleteDirectory: configurationError,
        listDirectory: configurationError,
        directoryExists: configurationError
    };
    /**
     * @memberof FYSCloud.API
     *
     * @description Configure the FYS.Cloud API
     * @param {FYSCloud.API.Options} newOptions Options-object to configure the FYS.Cloud API
     *
     * @returns {boolean} Returns true when the configuration is valid, otherwise false.
     */
    function configure(newOptions) {
        const errors = [];
        if (!newOptions.url) {
            errors.push("- url => API-URL from FYS.Cloud");
        }
        if (!newOptions.apiKey) {
            errors.push("- apiKey => API-Key from FYS.Cloud");
        }
        if (!newOptions.database) {
            errors.push("- database => Name of target database for queries");
        }
        if (!newOptions.environment) {
            errors.push("- environment => Name of the environment");
        }
        if (errors.length > 0) {
            alert(`FYS.Cloud API configuration is missing one or more properties:\n${errors.join("\n")}`);
            return false;
        }
        options = newOptions;
        exports.queryDatabase = queryDatabase;
        exports.sendEmail = sendEmail;
        exports.uploadFile = uploadFile;
        exports.deleteFile = deleteFile;
        exports.fileExists = fileExists;
        exports.deleteDirectory = deleteDirectory;
        exports.listDirectory = listDirectory;
        exports.directoryExists = directoryExists;
        return true;
    }
    /**
     * @memberof FYSCloud.API
     *
     * @description Send a SQL query to the configured database
     * @param {string} query Query written in SQL
     * @param {Array<(string|number|boolean)>} values Array of values to replace question marks (?) in the query with. Replacing is done from left to right.
     *
     * @returns {Promise<(Array<Object>|string)>} Returns a promise which can either fail (string with reason) or succeed (Array<Object> with results).
     */
    function queryDatabase(query, values) {
        var promise = $.Deferred();
        $.ajax({
            url: options.url + "/db",
            type: "POST",
            headers: {
                "Authorization": `Bearer ${options.apiKey}`
            },
            data: JSON.stringify({
                query: query,
                values: values,
                database: options.database
            })
        }).done(function (data) {
            promise.resolve(data);
        }).fail(function (xhr) {
            apiFail(promise, xhr);
        });
        return promise.promise();
    }
    /**
     * @memberof FYSCloud.API
     *
     * @description Send an email
     * @param {FYSCloud.API.Email} email Email to send
     *
     * @returns {Promise<string>} Returns a promise which can either fail (string with reason) or succeed (string with status).
     */
    function sendEmail(email) {
        var promise = $.Deferred();
        $.ajax({
            url: options.url + "/mail",
            type: "POST",
            headers: {
                "Authorization": `Bearer ${options.apiKey}`
            },
            data: JSON.stringify(email)
        }).done(function (data) {
            promise.resolve(data);
        }).fail(function (xhr) {
            apiFail(promise, xhr);
        });
        return promise;
    }
    /**
     * @memberof FYSCloud.API
     *
     * @description Upload a file to the uploads-folder on the configured FYS.Cloud environment
     * @param {string} fileName Name of the file to upload, has to contain an extension.
     * @param {string} dataUrl Data-URL of the file in base64
     * @param {boolean} [overwrite] Set to true to overwrite an existing file, otherwise false. (Default: false)
     *
     * @returns {Promise<string>} Returns a promise which can either fail (string with reason) or succeed (string with URL to file).
     */
    function uploadFile(fileName, dataUrl, overwrite) {
        var promise = $.Deferred();
        if (!fileName || !dataUrl) {
            promise.reject("fileName or dataUrl cannot be empty!");
            return promise;
        }
        $.ajax({
            url: options.url + "/file",
            type: "POST",
            headers: {
                "Authorization": `Bearer ${options.apiKey}`
            },
            data: JSON.stringify({
                environment: options.environment,
                fileName: fileName,
                action: "upload",
                overwrite: overwrite || false,
                buffer: dataUrl.match("^data:(.*?);base64,(.*?)$")[2]
            })
        }).done(function (data) {
            promise.resolve(data);
        }).fail(function (xhr) {
            apiFail(promise, xhr);
        });
        return promise;
    }
    /**
     * @memberof FYSCloud.API
     *
     * @description Delete a file from the uploads-folder on the configured FYS.Cloud environment
     * @param {string} fileName Path to the file to delete, can contain forward slashes (/) to access subfolders.
     *
     * @returns {Promise<string>} Returns a promise which can either fail (string with reason) or succeed (string with "OK").
     */
    function deleteFile(fileName) {
        var promise = $.Deferred();
        if (!fileName) {
            promise.reject("fileName cannot be empty!");
            return promise;
        }
        $.ajax({
            url: options.url + "/file",
            type: "POST",
            headers: {
                "Authorization": `Bearer ${options.apiKey}`
            },
            data: JSON.stringify({
                environment: options.environment,
                fileName: fileName,
                action: "deleteFile"
            })
        }).done(function (data) {
            promise.resolve(data);
        }).fail(function (xhr) {
            apiFail(promise, xhr);
        });
        return promise;
    }
    /**
     * @memberof FYSCloud.API
     * @since 0.0.3
     *
     * @description Checks if a file exists inside the uploads-folder on the configured FYS.Cloud environment.
     * @param {string} fileName Path to the file to check for existence, can contain forward slashes (/) to access subfolders.
     *
     * @returns {Promise<(boolean|string)>} Returns a promise which can either fail (string with reason) or succeed (boolean set to true if file exists, otherwise false).
     */
    function fileExists(fileName) {
        var promise = $.Deferred();
        if (!fileName) {
            promise.reject("fileName cannot be empty!");
            return promise;
        }
        $.ajax({
            url: options.url + "/file",
            type: "POST",
            headers: {
                "Authorization": `Bearer ${options.apiKey}`
            },
            data: JSON.stringify({
                environment: options.environment,
                fileName: fileName,
                action: "fileExists"
            })
        }).done(function (data) {
            promise.resolve(data);
        }).fail(function (xhr) {
            apiFail(promise, xhr);
        });
        return promise;
    }
    /**
     * @memberof FYSCloud.API
     *
     * @description Delete a directory from the uploads-folder on the configured FYS.Cloud environment, but only when it is empty.
     * @param {string} path Path to the directory to delete, can contain forward slashes (/) to access subfolders. Folder has to be empty!
     *
     * @returns {Promise<string>} Returns a promise which can either fail (string with reason) or succeed (string with "OK").
     */
    function deleteDirectory(path) {
        var promise = $.Deferred();
        /*if (!path) {
            promise.reject("path cannot be empty!");
            return promise;
        }*/
        $.ajax({
            url: options.url + "/file",
            type: "POST",
            headers: {
                "Authorization": `Bearer ${options.apiKey}`
            },
            data: JSON.stringify({
                environment: options.environment,
                fileName: path || "/",
                action: "deleteDirectory"
            })
        }).done(function (data) {
            promise.resolve(data);
        }).fail(function (xhr) {
            apiFail(promise, xhr);
        });
        return promise;
    }
    /**
     * @memberof FYSCloud.API
     *
     * @description List all files and directories inside a directory, inside the uploads-folder on the configured FYS.Cloud environment.
     * @param {string} path Path to the directory to list, can contain forward slashes (/) to access subfolders.
     *
     * @returns {Promise<(Array<string>|string)>} Returns a promise which can either fail (string with reason) or succeed (Array<string> with files and directories).
     */
    function listDirectory(path) {
        var promise = $.Deferred();
        /*if (!path) {
            promise.reject("path cannot be empty!");
            return promise;
        }*/
        $.ajax({
            url: options.url + "/file",
            type: "POST",
            headers: {
                "Authorization": "Bearer " + options.apiKey
            },
            data: JSON.stringify({
                environment: options.environment,
                fileName: path || "/",
                action: "list"
            })
        }).done(function (data) {
            promise.resolve(data);
        }).fail(function (xhr) {
            apiFail(promise, xhr);
        });
        return promise;
    }
    /**
     * @memberof FYSCloud.API
     * @since 0.0.3
     *
     * @description Checks if a directory exists inside the uploads-folder on the configured FYS.Cloud environment.
     * @param {string} path Path to the directory to check for existence, can contain forward slashes (/) to access subfolders.
     *
     * @returns {Promise<(boolean|string)>} Returns a promise which can either fail (string with reason) or succeed (boolean set to true if directory exists, otherwise false).
     */
    function directoryExists(path) {
        var promise = $.Deferred();
        if (!path) {
            promise.reject("path cannot be empty!");
            return promise;
        }
        $.ajax({
            url: options.url + "/file",
            type: "POST",
            headers: {
                "Authorization": "Bearer " + options.apiKey
            },
            data: JSON.stringify({
                environment: options.environment,
                fileName: path,
                action: "directoryExists"
            })
        }).done(function (data) {
            promise.resolve(data);
        }).fail(function (xhr) {
            apiFail(promise, xhr);
        });
        return promise;
    }
    function apiFail(promise, xhr) {
        if (xhr.status === 400) {
            const data = JSON.parse(xhr.responseText);
            promise.reject(data.reason || "Something bad happened, see console.");
        }
        else {
            promise.reject("Something bad happened, see console.");
        }
    }
    function configurationError() {
        const promise = $.Deferred();
        promise.reject("FYS.Cloud API is not properly configured!");
        return promise;
    }
    /**
     * @memberof FYSCloud.API
     *
     * @description Holds all options for the FYS.Cloud API
     * @typedef {Object} Options
     * @property {string} url URL of the FYS.Cloud API
     * @property {string} apiKey API-Key to authenticate yourself with the FYS.Cloud API
     * @property {string} database Name of the database you want to query by default
     * @property {string} environment Name of the environment you want to manipulate files on
     */
    /**
     * @memberof FYSCloud.API
     *
     * @description Represents a single email contact
     * @typedef {Object} EmailAddress
     * @property {string} name Name of the contact
     * @property {string} address Email address of the contact
     */
    /**
     * @memberof FYSCloud.API
     *
     * @description Represents an email
     * @typedef {Object} Email
     * @property {EmailAddress} from Sender of the email
     * @property {Array<FYSCloud.API.EmailAddress|string>} to Receivers of the email
     * @property {Array<FYSCloud.API.EmailAddress|string>} [cc] Other receivers of the email
     * @property {Array<FYSCloud.API.EmailAddress|string>} [bcc] Blind receivers of the email
     * @property {string} subject Subject of the email
     * @property {string} [text] Contents of the email as text
     * @property {string} [html] Contents of the email as html
     */
    return exports;
})(jQuery);

/**
 * Localization-extension for the FYS.Cloud library
 *
 * @author Lennard Fonteijn
 *
 * @namespace Localization
 * @memberof FYSCloud
 *
 * @since 0.0.3
 */
FYSCloud.Localization = (function ($) {
    const exports = {
        setTranslations: setTranslations,
        switchLanguage: switchLanguage,
        translate: translate
    };
    var localization;
    var activeLanguage;
    /**
     * @memberof FYSCloud.Localization
     *
     * @description Register all the translations to localize a webpage
     * @param {any} translations Free-form object with all translations
     */
    function setTranslations(translations) {
        localization = translations;
    }
    /**
     * @memberof FYSCloud.Localization
     *
     * @description Switch the active language, will be immediately applied.
     * @param {string} language Name of the language to activate
     */
    function switchLanguage(language) {
        activeLanguage = language;
        translate(true);
    }
    /**
     * @memberof FYSCloud.Localization
     *
     * @description Apply the translations for the active language, useful for dynamic changes on a webpage.
     * @param {boolean} [force] Set to true to translate everything on a webpage, otherwise false to only translate untranslated parts (Default: false).
     */
    function translate(force) {
        const selector = force
            ? "[data-translate]"
            : "[data-translate]:not([localized])";
        $(selector).each(function () {
            const localizeKey = $(this).attr("data-translate");
            const localizeKeys = localizeKey.split(".");
            var result = localization;
            for (let i = 0; i < localizeKeys.length; i++) {
                result = result[localizeKeys[i]];
                if (result === undefined) {
                    break;
                }
            }
            $(this)
                .attr("translated", "")
                .html(
                    result && result[activeLanguage]
                        ? result[activeLanguage]
                        : `[${localizeKey}]`
                );
        });
    }
    return exports;
})(jQuery);

/**
 * Session-extension for the FYS.Cloud library
 *
 * @author Lennard Fonteijn
 *
 * @namespace Session
 * @memberof FYSCloud
 */
FYSCloud.Session = (function ($) {
    var session = {};
    const exports = {
        get: get,
        set: set,
        remove: remove,
        clear: clear
    };
    /**
     * @memberof FYSCloud.Session
     * @function get
     *
     * @description Get all session-data as an object
     *
     * @returns {Object} Returns all session-data as an object
     */
    /**
     * @memberof FYSCloud.Session
     *
     * @description Get a specific key from the session
     * @param {string} key Name of the key to get
     * @param {any} [defaultValue] Value to return if the key does not exist or returns empty. (Default: undefined)
     *
     * @returns {any} Returns the value of the key, or the specified default value.
     */
    function get(key, defaultValue) {
        const copy = $.extend({}, session);
        if (arguments.length === 0) {
            return copy;
        }
        return copy[key] || defaultValue;
    }
    /**
     * @memberof FYSCloud.Session
     *
     * @description Set a key in the session
     * @param {string} key Name of the key to set
     * @param {any} value Value to set the key to
     */
    function set(key, value) {
        session[key] = value;
        saveSession();
    }
    /**
     * @memberof FYSCloud.Session
     *
     * @description Remove a key from the session
     * @param {string} key Name of the key to remove
     */
    function remove(key) {
        delete session[key];
        saveSession();
    }
    /**
     * @memberof FYSCloud.Session
     *
     * @description Remove all data from the session
     */
    function clear() {
        session = {};
        saveSession();
    }
    function loadSession() {
        try {
            session = JSON.parse(localStorage.getItem("session"));
        }
        catch (e) {
            //Do nothing
        }
        if (!session) {
            session = {};
            saveSession();
        }
    }
    function saveSession() {
        localStorage.setItem("session", JSON.stringify(session));
    }
    loadSession();
    return exports;
})(jQuery);

/**
 * URL-extension for the FYS.Cloud library
 *
 * @author Lennard Fonteijn
 *
 * @namespace URL
 * @memberof FYSCloud
 */
FYSCloud.URL = (function ($) {
    var currentQueryString = parseQuery(window.location.search);
    const exports = {
        queryString: getFromQueryString,
        redirect: redirect,
        replace: replace
    };
    /**
     * @memberof FYSCloud.URL
     * @function queryString
     *
     * @description Get the querystring as an object
     *
     * @returns {Object} Returns the querystring as an object
     */
    /**
     * @memberof FYSCloud.URL
     * @alias queryString
     *
     * @description Get a specific key from the querystring
     * @param {string} key Name of the key to get
     * @param {any} [defaultValue] Value to return if the key does not exist or returns empty. (Default: undefined)
     *
     * @returns {any} Returns the value of the key, or the specified default value.
     *
     * @example
     * //URL: profile.html?id=15
     * var id = FYSCloud.URL.queryString("id");
     * console.log(id); //15
     */
    function getFromQueryString(key, defaultValue) {
        const copy = $.extend({}, currentQueryString);
        if (arguments.length === 0) {
            return copy;
        }
        return copy[key] || defaultValue;
    }
    /**
     * @memberof FYSCloud.URL
     *
     * @description Redirect the browser to a new URL, leaving the current URL in the back/forward browser-history.
     * @param {string} url Absolute or relative URL to redirect to
     * @param {Object} [queryString] Object with all keys to add to the querystring
     *
     * @example
     * FYSCloud.URL.redirect("profile.html", {
     *     id: 15
     * });
     */
    function redirect(url, queryString) {
        window.location.assign(FYSCloud.Utils.createUrl(url, queryString));
    }
    /**
     * @memberof FYSCloud.URL
     *
     * @description Replace the URL visible in the browser, also replacing the current URL in the back/forward browser-history. Doesn't actually redirect the page!
     * @param {string} url Absolute or relative URL to redirect to
     * @param {Object} [queryString] Object with all keys to add to the querystring
     *
     * @example
     * FYSCloud.URL.replace("profile.html", {
     *     id: 15
     * });
     */
    function replace(url, queryString) {
        history.replaceState({}, "", FYSCloud.Utils.createUrl(url, queryString));
    }
    //Source: https://github.com/medialize/URI.js/blob/gh-pages/src/URI.js
    function parseQuery(string) {
        if (!string) {
            return {};
        }
        // throw out the funky business - "?"[name"="value"&"]+
        string = string.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, "");
        if (!string) {
            return {};
        }
        const items = {};
        const splits = string.split("&");
        const length = splits.length;
        var v, name, value;
        for (let i = 0; i < length; i++) {
            v = splits[i].split("=");
            name = decodeQuery(v.shift());
            // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
            value = v.length ? decodeQuery(v.join("=")) : null;
            if (Object.prototype.hasOwnProperty.call(items, name)) {
                if (typeof items[name] === "string" || items[name] === null) {
                    items[name] = [items[name]];
                }
                items[name].push(value);
            } else {
                items[name] = value;
            }
        }
        return items;
    }
    function decodeQuery(string) {
        string += "";
        try {
            return decodeURIComponent(string);
        } catch (e) {
            return string;
        }
    }
    return exports;
})(jQuery);

/**
 * Utils-extension for the FYS.Cloud library
 *
 * @author Lennard Fonteijn
 *
 * @namespace Utils
 * @memberof FYSCloud
 */
FYSCloud.Utils = (function ($) {
    const alphaNumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const symbols = " `!\"$%^&*()-_=+[{]};:'@#~|,<.>/?\\";
    const alphaNumericWithSymbols = alphaNumeric + symbols;
    const exports = {
        getDataUrl: getDataUrl,
        createUrl: createUrl,
        randomString: randomString,
        toSqlDatetime: toSqlDatetime
    };
    /**
     * @memberof FYSCloud.Utils
     *
     * @description Convert a file-input to a Data-URL
     * @param {Object|string} fileInput HTMLInputElement, jQuery-object or DOM-selector of the file-input.
     *
     * @returns {Promise<FYSCloud.Utils.DataURL|string>} Returns a promise which can either fail (string with reason) or succeed (DataURL of the file).
     *
     * @example
     * FYSCloud.Utils
     *     .getDataUrl("#fileInput")
     *     .done(function(data) {
     *         console.log(data);
     *     })
     *     .fail(function(reason) {
     *         console.log(reason);
     *     });
     */
    function getDataUrl(fileInput) {
        var promise = $.Deferred();
        const element = $(fileInput).get(0);
        var file;
        var fileName;
        if (element) {
            file = element.files[0];
            fileName = element.value.split(/(\\|\/)/g).pop();
        }
        else {
            promise.reject("Could not find element!");
            return promise;
        }
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            const mimeType = reader.result.match("^data:(.*?);base64,")[1];
            const extensionIndex = fileName.lastIndexOf(".");
            promise.resolve({
                fileName: fileName,
                extension: extensionIndex > -1 ? fileName.substring(extensionIndex + 1) : "",
                mimeType: mimeType,
                isImage: mimeType.indexOf("image/") >= 0,
                url: reader.result
            });
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
        else {
            promise.reject(`Could not load ${fileName || "file"}!`);
        }
        return promise;
    }
    /**
     * @memberof FYSCloud.Utils
     *
     * @description Create an URL with a querystring
     * @param {string} url Absolute or relative URL
     * @param {Object} [queryString] Object with all keys to add to the querystring
     *
     * @returns {string} Returns the created URL
     *
     * @example
     * var url = FYSCloud.Utils.createUrl("matches.html", {
     *     search: "paris",
     *     filters: [
     *         "tagA",
     *         "tagB"
     *     ]
     * });
     *
     * console.log(url); //matches.html?search=paris&filters=tagA&filters=tagB
     */
    function createUrl(url, queryString) {
        var targetUrl = url;
        if (queryString && Object.keys(queryString).length > 0) {
            targetUrl += `?${$.param(queryString, true)}`;
        }
        return targetUrl;
    }
    /**
     * @memberof FYSCloud.Utils
     *
     * @description Generate a string of random characters
     * @param {number} length Length of the string to generate
     * @param {boolean} includeSymbols Set to true to include non-alphanumeric characters, otherwise false.
     *
     * @returns {string} Returns the generated random string
     */
    function randomString(length, includeSymbols) {
        const characters = includeSymbols ? alphaNumericWithSymbols : alphaNumeric;
        const result = [];
        for (let i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
        }
        return result.join("");
    }
    /**
     * @memberof FYSCloud.Utils
     * @since 0.0.3
     *
     * @description Convert a Date-object to an SQL accepted String-format
     *
     * @param {Date} inputDate Date-object to convert
     *
     * @returns {string} SQL accepted String-format of the Date-object
     */
    function toSqlDatetime(inputDate) {
        const date = new Date(inputDate);
        const dateWithOffset = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return dateWithOffset
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
    }
    /**
     * @memberof FYSCloud.Utils
     *
     * @description Represents the Data-URL of a file
     * @typedef {Object} DataURL
     * @property {string} fileName Filename of the file
     * @property {string} extension Extension of the file, can be empty.
     * @property {string} mimeType MIME-type of the file
     * @property {boolean} isImage Is set to true when the mimeType represents an image, otherwise false.
     * @property {string} url Data-URL of the file
     */
    return exports;
})(jQuery);