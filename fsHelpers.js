const fs = require('fs');

function fileExists(filePath) {
    return new Promise(function (resolve, reject) {
        fs.stat(filePath, function (err, stats) {
            if (err) {
                if (err.code == "ENOENT") {
                    resolve(false);
                }
                else {
                    reject(err);
                }
            }
            else {
                resolve(stats.isFile());
            }
        });
    });
}

function readJson(filePath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if(err) {
                reject(err);
                return;
            }

            resolve(JSON.parse(data));
        });
    });
}

function readFileContent(filePath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, content) {
            if(err) {
                reject(err);
                return;
            }

            resolve(content);
        });
    });
}

module.exports = {
    fileExists: fileExists,
    readJson: readJson,
    readFileContent: readFileContent,
};
