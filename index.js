"use strict";
var index_1 = require("./resolvers/index");
var logger_1 = require("./core/logger");
var configurator = require("./core/config");
exports.resolvers = new index_1.ResolverCollection("global", [
    //
    //  app/main ==> app/main.js
    //
    new index_1.ResolverDefaultExtensions(),
    //
    //  rxjs/Subject ==> node_module/rxjs/Subject.js
    //
    new index_1.ResolverUnderNodeModulesFolder(),
    //
    //  jquery ==> node_modules/jquery/dist/jquery.js
    //
    new index_1.ResolverUnderNpmPackageDistFolder(),
    //
    //  redux ==> node_modules/redux/package.json ==> node_modules/redux/index.js
    //
    new index_1.ResolverNpmPackage(),
    //
    //  text ==> node_modules/systemjs-plugin-text
    //
    new index_1.ResolverSystemJSPlugin(),
    //
    //  XXX ==> XXX
    //
    new index_1.ResolverNull(),
]);
function setup(app) {
    if (!app) {
        throw new Error("SystemJS middleware setup must receive a reference to an express application instance");
    }
    console.log("The following resolvers are installed");
    for (var _i = 0, _a = exports.resolvers.resolvers; _i < _a.length; _i++) {
        var resolver = _a[_i];
        console.log("    " + resolver.name);
    }
    app.get('/systemjs/locate', function (req, res) {
        var path = req.query.path;
        var logger = new logger_1.MiddlewareLogger();
        exports.resolvers.resolve(path, logger)
            .then(function (path) {
            res.json({
                path: path,
                log: logger.logs,
            }).end();
        })
            .catch(function (err) {
            console.error(err);
            res.json({
                err: err,
                log: logger.logs,
            }).end();
        });
    });
}
exports.setup = setup;
function config(c) {
    configurator.set(c);
}
exports.config = config;
