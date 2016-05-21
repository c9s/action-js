Action JS
==============================

The powerful javascript library for connecting form components with backend protocols.

## Build

    composer install
    typings install
    npm install
    webpack

## Development

    webpack-dev-server --config webpack.server.config.js

Setup `action-js` virtual host for running ActionKit in PHP.

## Backlog: TypeScript Migration Steps

### Install Prerequisite

Install typescript

    sudo npm install typescript -g

Install typings (tsd was deprecated)

    sudo npm install typings -g

Install types for jquery, mocha

    typings install dt~jquery --global --save
    typings install dt~mocha --global --save

Rename all files from *.js to *.ts

    fsrename -match ".js" -replace ".ts"

Create tsconfig.json file for typescript compiler

    {
      "compilerOptions": {
        "target": "es5",
        "sourceMap": true,
        "outDir": "build/"
      },
      "exclude": ["node_modules"],
      "files": [
        "typings/index.d.ts",
        "src/entry.ts"
      ]
    }

Install `ts-loader` for webpack

    npm install ts-loader --save

Define ts-loader in webpack.config.js:

    module: {
      loaders: [{
          test: /\.(js|jsx)$/,
          loaders: ['babel'],
          exclude: [nodeModulesPath]
      }, { test: /\.tsx?$/, loader: 'ts-loader' }],
    } ... 


### Fixing Type Errors

1. Export symbols to window:

        (<any>window).myFunc

2. Migrate to ES6 class

3. Add property names to class definition.

        class Action {

            actionName: string;

            plugins: Array<Object>;

            formEl: any;

            options: ActionSettings;

            ...

        }

4. Use JQueryAjaxSettings to ajaxSettings property

        class ... {
            ajaxSettings: JQueryAjaxSettings;
        }

5. Cast element from getElementById function call to HTMLElement types, e.g.

        var i = <HTMLIFrameElement>document.getElementById(id);

6. Fix AIM, the onComplete property setting. Change

        i.onComplete = c.onComplete;

to:

        i['onComplete'] = c.onComplete;

7. Functions return jQuery Deferred should be defined with `JQueryDeferred<T>` in the prototype:

        var doSubmit = (payload): JQueryDeferred<any> => {
            ...
        };

8. Abstract config structure into interface (quality depends on how you define
   the types):

        interface ActionSettings {
            plugins?: Array<ActionPlugin>;

            confirm?: string;

            disableInput?: boolean;

            onSubmit? ():any;

            beforeSubmit? ():any;

            beforeUpload? ():any;
        }



