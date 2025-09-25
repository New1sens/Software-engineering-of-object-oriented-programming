const http = require('http');  // commonJS
const HOST = 'localhost';
const PORT = 3000;

const onEvent = (req, res) => {
    // http://localhost:3000/filename
    let paramsReq = req.url.split('/');
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(
        paramsReq
            .map((elm,ind) => `${ind} ${elm}`)
            .join('<br>')
    );
    res.write('<br> = = = = = =');
    res.end();
}

const server = http
    .createServer(onEvent);

server
    .listen(PORT, () => {
        console.log(`http://${HOST}:${PORT}/`);
    }); // Ctrl+C to stop


// /filename/data.csv
// switch (paramsReq[1]) {}