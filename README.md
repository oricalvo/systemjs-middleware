## SystemJS Middleware

SystemJS Middleware allows for easier configuration of systemjs module loader by enhancing your NodeJS server

systemjs is a client side library which has no access to the file system. As such, it is unable to enforce sophisticated module resolution logic

For example, assuming you just installed redux by running

```
npm install redux
```

And you try to import redux by running

```
require("redux");
```

Or

```
import * as redux from redux;
```

At runtime, systemjs is not able to resolve the module named "redux". You can configure it manually using System.config but this
is a tedius work

As alternative, you can install ***systemjs-middleware***

systemjs-middleware offers express middleware enhancement and a small client side enhancement

After configuring both, you will be able to require("redux") or any other npm package without reverting to manual configuration

## Installation

```
npm install systemjs-middleware
```

Then, you should apply the express middleware

```
const basePath = path.join(__dirname, "..");
const app = express();

systemjsMiddleware.config({
    basePath: basePath
});
systemjsMiddleware.setup(app);
```

basePath should point to the location were static files are served

Next, add the systemjs.middleware.js to the index.html

```
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    <script src="node_modules/systemjs-middleware/systemjs.middleware.js"></script>
```

And use System as usuall to import the main file

```
    System.import('app/main').catch(function(err){
        console.error(err);
    });
```

At runtime when systemjs tries to resolve a module location it contacts the middleware which runs through a list
of locations and looks for the requested module

You may take a look at the [sample](https://github.com/oricalvo/systemjs-middleware/tree/master/sample) folder which
demonstrates how **systemjs-middleware** can be configured into an existing SPA

## License

MIT
