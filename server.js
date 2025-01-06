const http = require('http');
const url = require('url');

const downloadDictionary = require('./downloadDictionary');
const loadDictionary = require('./loadDictionary');
const fillTemplate = require('./fillTemplate');

const dictionary = {
    current: null,
};

var dictionaryHandler = (request, response) => {
    var u = url.parse(request.url);

    if (u.pathname == '/readyz') {
        if (dictionary.current) {
            response.writeHead(200);
            response.end('OK');
        } else {
            response.writeHead(404);
            response.end('Not Loaded');
        }
        return;
    }

    if (u.pathname == '/mindmap') {
        response.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
        });
        fillTemplate((html) => response.end(html));
        return;
    }

    let key = '';
    if (u.pathname.length > 0) {
        key = u.pathname.slice(1);
    }
    const def = dictionary.current[key];
    if (!def) {
        response.writeHead(404);
        response.end(key + ' was not found');
        return;
    }
    response.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
    });
    response.end(JSON.stringify(def));
};

downloadDictionary(
    'https://raw.githubusercontent.com/asmalcev/web-glossary/refs/heads/dictionary/dictionary.json',
    'dictionary.json',
    (err) => {
        if (err) {
            console.log(err);
            return;
        }
        loadDictionary('dictionary.json', dictionary, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('ready to serve');
        });
    }
);

const server = http.createServer(dictionaryHandler);

server.listen(8080, (err) => {
    if (err) {
        return console.log('error starting server: ' + err);
    }

    console.log('server is listening on 8080');
});
