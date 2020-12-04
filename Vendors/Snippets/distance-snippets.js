/**
 * snippet from:
 * https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
 * */
function getDistanceFromLatLonInKm(firstLocation, secondLocation) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(secondLocation[0] - firstLocation[0]);  // deg2rad below
    var dLon = deg2rad(secondLocation[1] - firstLocation[1]);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(firstLocation[0])) * Math.cos(deg2rad(secondLocation[0])) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}