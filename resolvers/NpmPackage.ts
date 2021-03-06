import * as path from "path";
import {MiddlewareLogger} from "../core/logger";
import * as configurator from "../core/config";
import {IResolver} from "../core/resolver";
import {fileExists, readJson} from "../helpers/fs";
import {resolveWithExtensions} from "./helpers";

const config = configurator.get();

export class ResolverNpmPackage implements IResolver {
    get name() {
        return "NpmPackage";
    }

    resolve(packageName: string, logger: MiddlewareLogger): Promise<string> {
        const packageJson = path.join(config.basePath, "node_modules/" + packageName + "/package.json");
        return fileExists(packageJson).then((exists) => {
            if(!exists) {
                logger.log("SKIP NpmPackage lookup since package.json: " + packageJson + " was not found");
                return "";
            }

            return readJson(packageJson).then((json) => {
                if(!json.main) {
                    logger.log("SKIP NpmPackage lookup since package.json has main attribute");
                    return "";
                }

                const relPath = "node_modules/" + packageName + "/" + json.main;
                return resolveWithExtensions(relPath, ["", "js"], logger);
            });
        });
    }
}
