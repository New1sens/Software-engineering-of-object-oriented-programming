const { getDistribution, toPercentage } = require('./task_02_module.js');


const checkValues = [10**2, 10**4, 10**6, 10**8];

const results = Array.from(
    { length: 10 },
    () => new Array(checkValues.length) // так будут разные
);

checkValues.forEach((amount, i) => {
    const numbers = getDistribution(amount);
    Object.keys(numbers).forEach(key => {
        let per = toPercentage(numbers[key], amount/10);
        results[key][i] = per.toFixed(2);
    });
});

results.forEach( (elm, ind) => {
    console.log(`${ind}${'\t\t'}${elm.join('\t\t')}`);
});
