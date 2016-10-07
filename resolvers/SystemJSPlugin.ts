import {MiddlewareLogger} from "../core/logger";
import {IResolver} from "../core/resolver";
import {ResolverNpmPackage} from "./NpmPackage";

export class ResolverSystemJSPlugin implements IResolver{
    get name() {
        return "systemJSPlugin";
    }

    resolve(pluginShortName: string, logger: MiddlewareLogger): Promise<string> {
        return Promise.resolve().then(() => {
            if(pluginShortName.indexOf("/")!=-1) {
                logger.log("SKIP systemJSPlugin lookup since " + pluginShortName + " is not considered a valid systemjs plugin name");
                return "";
            }

            const packageName = "systemjs-plugin-" + pluginShortName;
            return new ResolverNpmPackage().resolve(packageName,logger);
        });
    }
}
