/**
 * //TODO: Create dummy metrics for statistics
 * 
 * //TODO: Component - Number Display
 * //TODO: Component - Pie chart Display
 * //TODO: Component - Top 10 Display
 * //TODO: Component - Pages list display
 */
var currentTimeSelection = "day";

/**
 * Container for all the statistic groups.
 */
class StatisticsWindow {
    groups = [
        new StatisticGroup("Traffic"),
        new StatisticGroup("Users"),
        new StatisticGroup("Matching"),
        new StatisticGroup("Pages")
    ];

    createdList = null;
    render() {
        const renderHook = document.getElementById('statistics-window');
        renderHook.innerHTML = ""; //Clear the HTML located in the window element.
        for (const group of this.groups) {
            this.createdList = group.render();
            renderHook.append(this.createdList);
        }
    }
}

/**
 * Container for a group of statistics.
 * Placed within a StatisticsWindow.
 */
class StatisticGroup {
    constructor(title) {
        this.title = title;
    }

    render() {
        const statGroupElement = document.createElement('div');
        statGroupElement.className = 'statistics-group';
        statGroupElement.innerHTML = `<h1>${this.title}</h1><p>asf</p`;

        return statGroupElement;
    }
}

/** Dropdown item */
var timeSelection = document.getElementById('time-dropdown');
$('select').on('change', function () {
    currentTimeSelection = this.value;
    statisticWindow.render(); //Redraw the statisticsWindow.
});

const statisticWindow = new StatisticsWindow();
statisticWindow.render();