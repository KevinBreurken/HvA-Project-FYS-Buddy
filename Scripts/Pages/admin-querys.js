fillPagesWindow();
fillTraficWindow();

//----  USERS ----
// ** TOTAL ACCOUNTS **
FYSCloud.API.queryDatabase(
    "SELECT * FROM users"
).done(function (data) {
    $('#total-accounts').html(data.length);
    fillMatchesWindow(data.length);
}).fail(function (reason) {
    console.log(reason);
});

// ** AVERAGE VISIT TIME **
FYSCloud.API.queryDatabase(
    "SELECT * FROM session"
).done(function (data) {
    let avgtimes = 0;
    let loginTodayAmount = 0;
    for (let i = 0; i < data.length; i++) { //Count all of the seconds of every visit.
        let loginDate = new Date(data[i].loginTime);
        let loginTime = loginDate.getTime() / 1000;

        let logoffTime = new Date(data[i].logoffTime).getTime() / 1000;
        avgtimes += ((logoffTime - loginTime));
        loginTodayAmount += isDateToday(loginDate);
    }
    $('#visit-time-average').html(toTimeString((avgtimes / data.length)));
    $('#logged-in').html(loginTodayAmount);
}).fail(function (reason) {
    console.log(reason);
});

function toTimeString(seconds) {
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}

function fillMatchesWindow(totalUserCount) {
    //----  MATCHING  ----
    FYSCloud.API.queryDatabase(
        "SELECT * FROM matches"
    ).done(function (data) {
        let totalMatchesCount = data.length;
        let totalContactsShared = 0;
        for (let i = 0; i < data.length; i++)
            totalContactsShared += data[i].contactShared;

        // ** MADE MATCHES **
        $('#made-matches').html(totalMatchesCount);
        // ** AVERAGE MATCHES PER USER
        $('#made-match-average').html(totalUserCount / totalMatchesCount);
        // ** CONTACT SHARED **
        $('#contacts-shared').html(totalContactsShared);
        // ** AVERAGE CONTACTS SHARED PER USER **
        $('#contacts-shared-average').html((totalUserCount / totalContactsShared).toFixed(2));
    }).fail(function (reason) {
        console.log(reason);
    });

    // ** MOST MATCHES WITH EQUAL INTERESTS **
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM interests " +
        "ORDER BY matchAmount " +
        "DESC LIMIT 10;"
    ).done(function (data) {
        let listData = [[data.length], [data.length]];
        for (let i = 0; i < data.length; i++) {
            listData[0][i] = data[i].interestName;
            listData[1][i] = data[i].matchAmount;
        }
        $('#most-match-equal-interests').html(makeOL(listData));
    }).fail(function (reason) {
        console.log(reason);
    });

// ** MOST MATCHES WITH EQUAL DESTINATION **
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM destinations " +
        "ORDER BY matchAmount " +
        "DESC LIMIT 10;"
    ).done(function (data) {
        let listData = [[data.length], [data.length]];
        for (let i = 0; i < data.length; i++) {
            listData[0][i] = data[i].destinationName;
            listData[1][i] = data[i].matchAmount;
        }
        $('#most-match-equal-destination').html(makeOL(listData));
    }).fail(function (reason) {
        console.log(reason);
    });
}

function fillPagesWindow() {
    //----  PAGES  ----
    // ** BOUNCE RATE **
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM pages " +
        "ORDER BY bounce DESC;"
    ).done(function (data) {
        let listData = [[data.length], [data.length]];
        for (let i = 0; i < data.length; i++) {
            listData[0][i] = data[i].pageName;
            listData[1][i] = data[i].bounce;
        }
        $('#page-bounce').html(makeOL(listData));
    }).fail(function (reason) {
        console.log(reason);
    });

    // ** AMOUNT OF VIEWS **
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM pages " +
        "ORDER BY visits DESC;"
    ).done(function (data) {
        let listData = [[data.length], [data.length]];
        for (let i = 0; i < data.length; i++) {
            listData[0][i] = data[i].pageName;
            listData[1][i] = data[i].visits;
        }
        $('#page-views').html(makeOL(listData));
    }).fail(function (reason) {
        console.log(reason);
    });
}

function fillTraficWindow() {
    //----  TRAFIC ----
    // ** SITE VISITORS **

    // ** LOGGED IN USERS **

    // ** TYPE DEVICE **
    FYSCloud.API.queryDatabase(
        "SELECT deviceType, count(*) as 'amount' FROM session GROUP BY deviceType"
    ).done(function (data) {
        console.log(data);

        let pieData = [[data.length], [data.length]];
        for (let i = 0; i < data.length; i++) {
            pieData[0][i] = data[i].deviceType;
            pieData[1][i] = data[i].amount;
        }

        generatePiechart('#device-type', pieData);
    }).fail(function (reason) {
        console.log(reason);
    });

    // ** BROWSER TYPE **
    FYSCloud.API.queryDatabase(
        "SELECT browserType, count(*) as 'amount' FROM session GROUP BY browserType"
    ).done(function (data) {
        let pieData = [[data.length], [data.length]];
        for (let i = 0; i < data.length; i++) {
            pieData[0][i] = data[i].browserType;
            pieData[1][i] = data[i].amount;
        }

        generatePiechart('#browser-type', pieData);
    }).fail(function (reason) {
        console.log(reason);
    });
}

function isDateToday(date){
    var today = new Date();
    if(date.getDate() !== today.getDate())
        return false;
    if(date.getMonth() !== today.getMonth())
        return false;
    if(date.getFullYear() !== today.getFullYear())
        return false;

    return true;
}
