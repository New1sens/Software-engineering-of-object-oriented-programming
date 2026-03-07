const { readFileSync } = require('fs');
const PORT = 8080;

const readDataCsv = (filename) => {
    let arr = readFileSync(filename, 'utf8')
        .split(/\r\n|\n/)
        .filter(line => line)
        .slice(1, )
        .map(elm => +elm.split(' ')[1]);
    return arr;
}

module.exports = {
    readDataCsv
}
