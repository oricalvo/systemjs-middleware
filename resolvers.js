const path = require('path');
const config = require("./config")();
const promiseHelpers = require("./promiseHelpers");
const fsHelpers = require("./fsHelpers");

class Resolver {
    constructor() {
        this.logEntries = [];
    }

    log(path, promise) {
        return promise.then(resolved => {
            this.logEntries.push(path);

            return resolved;
        });
    }

    resolveBootstrapper() {
        const filePath = path.join(config.basePath, "node_modules/systemjs/dist/system.src.js");

        return fsHelpers.readFileContent(filePath);
    }

    resolveAsIs(relPath) {
        const filePath = path.join(config.basePath, relPath);

        return this.log(relPath, fsHelpers.fileExists(filePath).then(exists=>(exists ? relPath : "")));
    }


    resolveUnderNodeModules(relPath) {
        return this.resolveWithExtensions("node_modules/" + relPath);
    }

    resolveWithExtensions(relPath, extensions) {
        extensions = extensions || config.defaultExtensions;

        const funcs = [];

        for(let ext of extensions) {
            let withExt = (ext ? relPath + "." + ext : relPath);
            funcs.push(() => this.resolveAsIs(withExt));
        }

        return promiseHelpers.or(funcs);
    }

    resolveFiles(files) {
        const funcs = [];

        for(let file of files) {
            funcs.push(() => this.resolveWithExtensions(file));
        }

        return promiseHelpers.or(funcs);
    }

    resolveUnderNpmPackageDistFolder(fileName) {
        return Promise.resolve().then(() => {
            if(fileName.indexOf("/")!=-1) {
                return Promise.resolve(false);
            }

            const relPath = "node_modules/" + fileName + "/dist/" + fileName;
            return this.resolveWithExtensions(relPath);
        });
    }

    resolveNpmPackage(packageName) {
        const packageJson = path.join(config.basePath, "node_modules/" + packageName + "/package.json");
        return fsHelpers.fileExists(packageJson).then((exists) => {
            if(!exists) {
                return "";
            }

            return fsHelpers.readJson(packageJson).then((json) => {
                if (json.main) {
                    const relPath = "node_modules/" + packageName + "/" + json.main;
                    return this.resolveWithExtensions(relPath, ["", "js"]);
                }
                else {
                    return "";
                }
            });
        });
    }

    resolveSystemJSPlugin(relPath) {
        return Promise.resolve().then(() => {
            if(relPath.indexOf("/")!=-1) {
                return "";
            }

            const packageName = relPath;

            return this.resolveNpmPackage("systemjs-plugin-" + packageName);
        });
    }

    resolveMain(path) {
        return Promise.resolve().then(() => {
            if(path!="__main__") {
                return "";
            }

            return this.resolveFiles(["main", "app/main"]);
        });
    }
}

module.exports = {
    // resolveAsIs: resolveAsIs,
    // resolveUnderNodeModules: resolveUnderNodeModules,
    // resolveWithExtensions: resolveWithExtensions,
    // resolveUnderNpmPackageDistFolder: resolveUnderNpmPackageDistFolder,
    // resolveNpmPackage: resolveNpmPackage,
    // resolveSystemJSPlugin: resolveSystemJSPlugin,
    Resolver: Resolver,
};
