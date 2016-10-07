const configurator = require("./config");
const promiseHelpers = require("./promiseHelpers");
const fsHelpers = require("./fsHelpers");
const resolvers = require("./resolvers");

function setup(app) {
    if(!app) {
        throw new Error("SystemJS middleware setup must recieve a reference to express application instance");
    }

    app.get('/systemjs/locate', function(req, res) {
        const path = req.query.path;
        const resolver = new resolvers.Resolver();

        if(!path) {n
            return resolver.resolveBootstrapper().then(js => {
                res.write(js);
                res.end();
            });
        }

        promiseHelpers.or([
            () => resolver.resolveWithExtensions(path),
            () => resolver.resolveUnderNodeModules(path),
            () => resolver.resolveUnderNpmPackageDistFolder(path),
            () => resolver.resolveNpmPackage(path),
            () => resolver.resolveSystemJSPlugin(path),
            () => resolver.resolveMain(path),
        ]).then(path => {
            res.json({
                path: path || "",
                log: resolver.logEntries,
            }).end();
        }).catch(function(err) {
            console.error(err);

            res.json({
                err: err,
                log: resolver.logEntries,
            }).end();
        });
    });
}

function config(c) {
    configurator(c);
}

module.exports = {
    setup: setup,
    config: config,
};
