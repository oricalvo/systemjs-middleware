const path = require("path");

const config = {
    basePath: path.join(__dirname, ".."),
    defaultExtensions: ["", "js"],
};

module.exports = function getSetConfig(c) {
    if(c!==undefined) {
        for(let key in config) {
            if(c.hasOwnProperty(key)) {
                config[key] = c[key];
            }
        }
    }

    return config;
}
