import {MiddlewareLogger} from "../core/logger";

export interface IResolver {
    name: string;
    resolve(path: string, logger: MiddlewareLogger): Promise<string>;
}

export class ResolverNull implements IResolver {
    get name() {
        return "null";
    }

    resolve(location: string, logger: MiddlewareLogger) {
        logger.log(location);

        return Promise.resolve(location);
    }
}

