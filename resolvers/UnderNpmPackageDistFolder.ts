import {MiddlewareLogger} from "../core/logger";
import {IResolver} from "../core/resolver";
import * as configurator from "../core/config";
import {resolveWithExtensions} from "./helpers";

const config = configurator.get();

export class ResolverUnderNpmPackageDistFolder implements IResolver {
    get name() {
        return "underNpmPackageDistFolder";
    }

    resolve(fileName: string, logger: MiddlewareLogger): Promise<string> {
        return Promise.resolve().then(() => {
            if(fileName.indexOf("/")!=-1) {
                logger.log("SKIP underNpmPackageDistFolder lookup since " + fileName + " is not considered a file name");
                return Promise.resolve("");
            }

            const relPath = "node_modules/" + fileName + "/dist/" + fileName;
            return resolveWithExtensions(relPath, config.defaultExtensions, logger);
        });
    }
}
