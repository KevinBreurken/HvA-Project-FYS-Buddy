var pieChartColors = [
    "#2ecc71",
    "#3498db",
    "#95a5a6",
    "#9b59b6",
    "#f1c40f",
    "#e74c3c",
    "#34495e"
];

function renderNumberStatisticItem(title, value) {
    const statItemElement = `
            <div class="statistics-item-number-title">${title}</div>
            <div class="statistics-item-number-value">${value}</div>
        `;
    return statItemElement;

}

function renderListStatisticItem(title, itemList) {
    const statListElement = `
    <button class="statistics-item-list-button">${title}</button>
    <div class="statistics-item-list-content">
        ${makeUL(itemList).innerHTML}
    </div>
    `;
    return statListElement;
}

function renderPieChartStatisticItem(title) {
    const pieItemElement = `
    <div>
    <div class="statistics-item-piechart-title">${title}</div>
    <canvas class="statistics-item-piechart-chart"></canvas>
     </div>
    `;
    return pieItemElement;
}

function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');
    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}