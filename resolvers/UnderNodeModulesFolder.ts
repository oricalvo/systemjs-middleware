import {MiddlewareLogger} from "../core/logger";
import {IResolver} from "../core/resolver";
import * as configurator from "../core/config";
import {resolveWithExtensions} from "./helpers";

const config = configurator.get();

export class ResolverUnderNodeModulesFolder implements IResolver {
    get name() {
        return "underNodeModulesFolder";
    }

    resolve(location: string, logger: MiddlewareLogger) {
        return resolveWithExtensions("node_modules/" + location, config.defaultExtensions, logger);
    }
}
