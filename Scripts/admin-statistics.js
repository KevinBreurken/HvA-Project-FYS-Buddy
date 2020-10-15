/**
 * //TODO: Create dummy metrics for statistics
 * 
 * //TODO: Component - Number Display
 * //TODO: Component - Pie chart Display
 * //TODO: Component - Top 10 Display
 * //TODO: Component - Pages list display
 */
var currentTimeSelection = "day";
/** Dropdown item */
var timeSelection = document.getElementById('time-dropdown');
$('select').on('change', function () {
    currentTimeSelection = this.value;
    renderStatistics();
});

renderStatistics();

function renderStatistics() {

    //Update number items
    const numberItems = document.getElementsByClassName('statistics-item-number');
    for (const item of numberItems) {
        item.innerHTML = renderNumberStatisticItem(item.getAttribute('name'), 100);
    }

    //Update list items
    const listItems = document.getElementsByClassName('statistics-item-list');
    for (const item of listItems) {
        item.innerHTML = renderListStatisticItem(item.getAttribute('name'), $(item).data('items'));

        $(item).find('button').click(function () {
            $(item.lastElementChild).toggle();
        });
    }

    //Update pie charts
    const pieItems = document.getElementsByClassName('statistics-item-piechart');
    for (const item of pieItems) {
        item.innerHTML = renderPieChartStatisticItem(item.getAttribute('name'));
        //Create a Chart.js pie chart
        var ctx = item.getElementsByClassName('statistics-item-piechart-chart')[0].getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: $(item).data('names'),
                datasets: [{
                    backgroundColor: pieChartColors,
                    data: $(item).data('values')
                }]
            }
        });
    }
}
