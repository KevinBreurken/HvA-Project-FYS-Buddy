FYSCloud.API.configure({
    url: "https://api.fys.cloud",
    apiKey: "fys_is111_1.14Sh6xypTzeSUHD4",
    database: "fys_is111_1_kevintest", //Change this to the database-name you want to use for testing.
    environment: "dev"
});

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
        "SELECT * FROM session"
    ).done(function (data) {
        let averageTimes = 0;
        let loginTodayAmount = 0;
        for (let i = 0; i < data.length; i++) {
            let loginDate = new Date(data[i]["loginTime"]);

            let loginTime = loginDate.getTime() / 1000;
            let logoffTime = new Date(data[i]["logoffTime"]).getTime() / 1000;
            //TODO: creates a problem when averageTimes reaches the integer limit. Create a method of storing average time per session on the database.
            averageTimes += ((logoffTime - loginTime));
            loginTodayAmount += isDateToday(loginDate);
        }
        // ** USERS - AVERAGE VISIT TIME **
        $('#visit-time-average').html(secondsToTimeString((averageTimes / data.length)));
        // ** TRAFFIC - LOGGED IN TODAY **
        $('#logged-in').html(loginTodayAmount);
    }).fail(function (reason) {
        console.log(reason);
    });

    fetchTraffic();
    fetchPages();
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

function fetchPages() {
    // ~~~~ FETCH LIST OF PAGES, SORTED BY BOUNCE DESCENDING ~~~~
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM pages " +
        "ORDER BY bounce DESC;"
    ).done(function (data) {
        // ** BOUNCE RATE **
        $('#page-bounce').html(makeOL(jsonToArray(data, ["pageName", "bounce"])));
    }).fail(function (reason) {
        console.log(reason);
    });

    // ~~~~ FETCH LIST OF PAGES, SORTED BY VISITS DESCENDING ~~~~
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM pages " +
        "ORDER BY visits DESC;"
    ).done(function (data) {
        // ** AMOUNT OF VIEWS **
        $('#page-views').html(makeOL(jsonToArray(data, ["pageName", "visits"])));
    }).fail(function (reason) {
        console.log(reason);
    });
}

function fetchTraffic() {
    // ** TYPE DEVICE **
    FYSCloud.API.queryDatabase(
        "SELECT deviceType, count(*) as 'amount' FROM session GROUP BY deviceType"
    ).done(function (data) {
        generatePiechart('#device-type', jsonToArray(data, ["deviceType", "amount"]));
    }).fail(function (reason) {
        console.log(reason);
    });

    // ** BROWSER TYPE **
    FYSCloud.API.queryDatabase(
        "SELECT browserType, count(*) as 'amount' FROM session GROUP BY browserType"
    ).done(function (data) {
        generatePiechart('#browser-type', jsonToArray(data, ["browserType", "amount"]));
    }).fail(function (reason) {
        console.log(reason);
    });
}

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

function secondsToTimeString(seconds) {
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}