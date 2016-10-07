import {MiddlewareLogger} from "../core/logger";
import * as configurator from "../core/config";
import {fileExists} from "../helpers/fs";
import {or} from "../helpers/promise";
import * as path from "path";

const config = configurator.get();

export function resolveFile(location: string, logger: MiddlewareLogger) {
    const filePath = path.join(config.basePath, location);

    return fileExists(filePath)
        .then(exists => {
            if(exists) {
                logger.log("FOUND " + filePath);
                return location;
            }
            else {
                logger.log(filePath);
                return "";
            }
        })
        .catch(err => {
            logger.log("ERROR " + err.message);
            throw err;
        });
}

export function resolveWithExtensions(location: string, extensions: string[], logger: MiddlewareLogger) {
    extensions = extensions || config.defaultExtensions;

    const funcs = [];

    for(let ext of extensions) {
        let locationWithExt = location + (ext ? ("." + ext) : "");
        funcs.push(() => resolveFile(locationWithExt, logger));
    }

    return or(funcs);
}

export function resolveFiles(locations: string[], logger: MiddlewareLogger) {
    const funcs = [];

    for(let location of locations) {
        funcs.push(() => resolveWithExtensions(location, config.defaultExtensions, logger));
    }

    return or(funcs);
}
