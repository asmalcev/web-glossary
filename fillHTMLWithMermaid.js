const fs = require('fs');
const fillTemplate = require('./fillTemplate');

fillTemplate((html) => fs.writeFileSync('docs/index.html', html));
