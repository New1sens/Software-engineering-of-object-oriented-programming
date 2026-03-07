require('fs')
    .readFileSync('./files/data_1.csv', 'utf8')
    .split(/\r\n|\n/)
    .filter(line => line)
    .slice(1, )
    .map(elm => +elm.split(' ')[1]);
    


    // \r\n
    // \n
    // __filename
    // 1 100

