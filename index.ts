import {
    ResolverCollection, ResolverUnderNpmPackageDistFolder, ResolverNpmPackage,
    ResolverSystemJSPlugin, ResolverDefaultExtensions, ResolverNull, ResolverUnderNodeModulesFolder
} from "./resolvers/index";
import {MiddlewareLogger} from "./core/logger";
import * as configurator from "./core/config";

export const resolvers = new ResolverCollection("global", [
    //
    //  app/main ==> app/main.js
    //
    new ResolverDefaultExtensions(),

    //
    //  rxjs/Subject ==> node_module/rxjs/Subject.js
    //
    new ResolverUnderNodeModulesFolder(),

    //
    //  jquery ==> node_modules/jquery/dist/jquery.js
    //
    new ResolverUnderNpmPackageDistFolder(),

    //
    //  redux ==> node_modules/redux/package.json ==> node_modules/redux/index.js
    //
    new ResolverNpmPackage(),

    //
    //  text ==> node_modules/systemjs-plugin-text
    //
    new ResolverSystemJSPlugin(),

    //
    //  XXX ==> XXX
    //
    new ResolverNull(),
]);

export function setup(app) {
    if(!app) {
        throw new Error("SystemJS middleware setup must receive a reference to an express application instance");
    }

    console.log("The following resolvers are installed");
    for(let resolver of resolvers.resolvers) {
        console.log("    " + resolver.name);
    }

    app.get('/systemjs/locate', function(req, res) {
        const path = req.query.path;
        const logger = new MiddlewareLogger();

        resolvers.resolve(path, logger)
            .then(path => {
                res.json({
                    path: path,
                    log: logger.logs,
                }).end();
            })
            .catch(function(err) {
                console.error(err);

                res.json({
                    err: err,
                    log: logger.logs,
                }).end();
            });
    });
}

export function config(c) {
    configurator.set(c);
}
