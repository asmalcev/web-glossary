const fs = require('fs');
const https = require('https');

const downloadDictionary = (url, file, callback) => {
    var stream = fs.createWriteStream(file);
    https
        .get(url, function (res) {
            res.pipe(stream);
            stream.on('finish', function () {
                stream.close(callback);
                console.log('dictionary downloaded');
            });
        })
        .on('error', function (err) {
            fs.unlink(file);
            if (callback) cb(err.message);
        });
};

module.exports = downloadDictionary;