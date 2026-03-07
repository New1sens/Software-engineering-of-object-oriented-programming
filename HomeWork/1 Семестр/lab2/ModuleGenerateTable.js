// moduleGenerateTable.js
const { getDistribution, toPercentage } = require('./task_02_module');

const checkValues = [10**2, 10**4, 10**6, 10**8];

const generateTableHTML = () => {
    const results = Array.from(
        { length: 10 },
        () => new Array(checkValues.length)
    );

    checkValues.forEach((amount, i) => {
        const numbers = getDistribution(amount);
        Object.keys(numbers).forEach(key => {
            let per = toPercentage(numbers[key], amount / 10);
            results[key][i] = per.toFixed(2);
        });
    });

    // Сборка HTML-таблицы
    let html = '<table border="1" style="border-collapse: collapse; margin: 20px;">';
    html += '<tr><th>№</th>';
    checkValues.forEach(val => html += `<th>${val}</th>`);
    html += '</tr>';

    results.forEach((row, index) => {
        html += `<tr><td>${index}</td>`;
        row.forEach(cell => html += `<td style="padding: 5px;">${cell}</td>`);
        html += '</tr>';
    });

    html += '</table>';
    return html;
};

module.exports = { generateTableHTML };
