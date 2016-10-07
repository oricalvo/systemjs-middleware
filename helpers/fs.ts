const fs = require('fs');

export function fileExists(filePath) {
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

export function readJson(filePath): Promise<any> {
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

export function readFileContent(filePath) {
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
