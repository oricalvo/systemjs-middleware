import * as configurator from "../core/config";
import {IResolver} from "../core/resolver";
import {MiddlewareLogger} from "../core/logger";
import {resolveWithExtensions} from "./helpers";

const config = configurator.get();

export class ResolverDefaultExtensions implements IResolver {
    get name() {
        return "defaultExtensions";
    }

    resolve(location: string, logger: MiddlewareLogger) {
        return resolveWithExtensions(location, config.defaultExtensions, logger);
    }
}
