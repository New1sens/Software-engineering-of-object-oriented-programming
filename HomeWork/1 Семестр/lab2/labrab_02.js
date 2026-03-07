// labrab_02.js
const http = require('http');
const { readDataCsv } = require('./moduleReadData');
const { generateTableHTML } = require('./ModuleGenerateTable'); // <-- Новый импорт
const [ HOST, PORT ] = [ 'localhost', 3000 ];

const onEvent = (req, res) => {
    let params = req.url.split('/');
    if ((params.length > 1) && (params.at(-1) !== 'favicon.ico')) {
        let filename = params.at(-1);

        if (filename === 'table') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(generateTableHTML()); // <-- Используйте новый модуль
            return res.end();
        }

        console.log(filename);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(
            readDataCsv(`./files/${filename}`)
                .map(num => String(num))
                .join('<br>')
        );
        res.write('<br> = = = = = =');
    }
    res.end();
};

const server = http.createServer(onEvent);
server.listen(PORT, () => console.log(`http://${HOST}:${PORT}/`));
