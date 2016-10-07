const path = require("path");

export interface Configuration {
    basePath: string,
    defaultExtensions: string[],
}

const config: Configuration = {
    basePath: path.join(__dirname, ".."),
    defaultExtensions: ["", "js"],
};

export function get() : Configuration {
    return config;
}

export function set(c: Configuration) {
    for(let key in config) {
        if(c.hasOwnProperty(key)) {
            config[key] = c[key];
        }
    }

    return config;
}
