const fs = require('fs');
const createMermaid = require('./createMermaid');

const fillTemplate = (callback) =>
    createMermaid((mermaid) =>
        callback(
            fs
                .readFileSync('index_template.html', 'utf8')
                .replace('{{diagram}}', mermaid)
        )
    );

module.exports = fillTemplate;
