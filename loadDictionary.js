const fs = require('fs');

const loadDictionary = (file, dictionary, callback) => {
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        dictionary.current = JSON.parse(data);
        callback();
    });
};

module.exports = loadDictionary;
