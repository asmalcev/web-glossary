const fs = require('fs');
const createMermaid = require('./createMermaid');

const html = fs.readFileSync('index_template.html', 'utf8');

createMermaid((mermaid) => {
    fs.writeFileSync('docs/index.html', html.replace('{{diagram}}', mermaid));
});
