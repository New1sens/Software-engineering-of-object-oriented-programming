const fs = require('fs');
const input = fs.readFileSync('sem_02_labrab_01.csv', 'utf8').trim().split('\n');

input.forEach((line, i) => {
    const numbs = line.split(' ').map(Number);

    const dict = {};
    numbs.forEach(n => dict[n] = (dict[n] || 0) + 1);

    let repeatedNumbers = [];
    const uniqueNumbers = [];

    for (let k in dict) {
        if (dict[k] === 2) repeatedNumbers.push(Number(k)); 
        if (dict[k] === 1) uniqueNumbers.push(Number(k)); 
    }

    if (repeatedNumbers.length !== 2) return;

    const sumRepeated = repeatedNumbers.reduce((sum, num) => sum + num, 0);
    const sumUnique = uniqueNumbers.reduce((sum, num) => sum + num, 0);

    if (sumRepeated < sumUnique) {
        console.log(i + 1, line);  
    }
});