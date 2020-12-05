fetchStatisticsFromDatabase();

function fetchStatisticsFromDatabase() {
    // ~~~~ FETCH AMOUNT OF USERS ~~~~
    FYSCloud.API.queryDatabase(
        "SELECT Count(*) AS totalUserCount FROM user"
    ).done(function (data) {
        let userCount = data[0]["totalUserCount"];
        // ** USERS - TOTAL ACCOUNTS **
        $('#total-accounts').html(userCount);
        fetchMatches(userCount);
    }).fail(function (reason) {
        console.log(reason);
    });

    // ~~~~ FETCH ALL SESSIONS ~~~~
    FYSCloud.API.queryDatabase(
        "SELECT * FROM adminsessiondata"
    ).done(function (data) {
        let loginTodayAmount = 0;
        let allHours = [data.length];
        for (let i = 0; i < data.length; i++) {
            let loginDate = new Date(data[i]["logintime"]);
            allHours[i] = loginDate.getHours();
            loginTodayAmount += isDateToday(loginDate);
        }
        // ** USERS - MOST VISITED HOUR **
        $('#visit-time-average').html(findCommon(allHours));
        // ** TRAFFIC - LOGGED IN TODAY **
        $('#logged-in').html(loginTodayAmount);
    }).fail(function (reason) {
        console.log(reason);
    });
}

function fetchMatches(totalUserCount) {
    // ~~~~ FETCH ALL MATCHES ~~~~
    FYSCloud.API.queryDatabase(
        "SELECT * FROM matches"
    ).done(function (data) {
        let totalMatchesCount = data.length;
        let totalContactsShared = 0;
        for (let i = 0; i < data.length; i++)
            totalContactsShared += data[i]["contactShared"];

        // ** MATCHING - MADE MATCHES **
        $('#made-matches').html(totalMatchesCount);
        // ** MATCHING - AVERAGE MATCHES PER USER
        $('#made-match-average').html((totalUserCount / totalMatchesCount).toFixed(2));
        // ** MATCHING - CONTACT SHARED **
        $('#contacts-shared').html(totalContactsShared);
        // ** MATCHING - AVERAGE CONTACTS SHARED PER USER **
        $('#contacts-shared-average').html((totalUserCount / totalContactsShared).toFixed(2));
    }).fail(function (reason) {
        console.log(reason);
    });

    // ~~~~ FETCH LIST OF INTERESTS, SORTED BY MATCH AMOUNT ~~~~
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM interests " +
        "ORDER BY matchAmount " +
        "DESC LIMIT 10;"
    ).done(function (data) {
        let formattedArray = jsonToArray(data, ["interestName", "matchAmount"]);
        // ** MATCHING - MOST MATCHED WITH EQUAL INTEREST **
        $('#most-match-equal-interests').html(makeOL(formattedArray));
    }).fail(function (reason) {
        console.log(reason);
    });

    // ~~~~ FETCH LIST OF DESTINATIONS, SORTED BY MATCH AMOUNT ~~~~
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM destinations " +
        "ORDER BY matchAmount " +
        "DESC LIMIT 10;"
    ).done(function (data) {
        let formattedArray = jsonToArray(data, ["destinationName", "matchAmount"]);
        // ** MATCHING - MOST MATCHED WITH EQUAL DESTINATION **
        $('#most-match-equal-destination').html(makeOL(formattedArray));
    }).fail(function (reason) {
        console.log(reason);
    });
}

(function fetchPages() {
    // ~~~~ FETCH LIST OF PAGES, SORTED BY LOGOUT-AMOUNT DESCENDING ~~~~
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM adminpagedata " +
        "ORDER BY logoutamount DESC;"
    ).done(function (data) {
        // ** LOGOUT-AMOUNT **
        $('#page-logout').html(makeOL(jsonToArray(data, ["name", "logoutamount"])));
    }).fail(function (reason) {
        console.log(reason);
    });

    // ~~~~ FETCH LIST OF PAGES, SORTED BY VISITS DESCENDING ~~~~
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM adminpagedata " +
        "ORDER BY visitcount DESC;"
    ).done(function (data) {
        // ** AMOUNT OF VIEWS **
        $('#page-views').html(makeOL(jsonToArray(data, ["name", "visitcount"])));
    }).fail(function (reason) {
        console.log(reason);
    });
})();

(function fetchTraffic() {
    // ** TYPE DEVICE **
    FYSCloud.API.queryDatabase(
        "SELECT deviceType, count(*) as 'amount' FROM adminsessiondata GROUP BY deviceType"
    ).done(function (data) {
        generatePiechart('#device-type', jsonToArray(data, ["deviceType", "amount"]));
    }).fail(function (reason) {
        console.log(reason);
    });

    // ** BROWSER TYPE **
    FYSCloud.API.queryDatabase(
        "SELECT browserType, count(*) as 'amount' FROM adminsessiondata GROUP BY browserType"
    ).done(function (data) {
        generatePiechart('#browser-type', jsonToArray(data, ["browserType", "amount"]));
    }).fail(function (reason) {
        console.log(reason);
    });
})();

/**
 * Creates a Multidimensional Array from a JSON object.
 * @param json JSON Object.
 * @param attributes list of attribute names. length of array defines width of returned Array.
 * @returns {[[*], [*]]} Multidimensional Array.
 */
function jsonToArray(json, attributes) {
    let multiArray = [[json.length], [json.length]];
    for (let i = 0; i < json.length; i++) {
        for (let atrI = 0; atrI < attributes.length; atrI++) {
            multiArray[atrI][i] = json[i][attributes[atrI]];
        }
    }
    return multiArray;
}

/**
 * Checks whether a Date object is the same as the current date.
 * @param date the Date object being checked.
 * @returns {boolean} whether the Date is of today or not.
 */
function isDateToday(date) {
    let today = new Date();
    if (date.getDate() !== today.getDate())
        return false;
    if (date.getMonth() !== today.getMonth())
        return false;
    if (date.getFullYear() !== today.getFullYear())
        return false;

    return true;
}