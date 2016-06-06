Action JS
==============================

The powerful javascript library for connecting form components with backend protocols.


## USAGE

To initialize a form with Action:

    var a = Action.form(document.getElementById('formSimple'))

After the form is initialized, when user clicks on the submit button, the form
submittion will be transformed into an AJAX call to the backend.

Adding plugin:

    a.plug(new ActionBootstrapHighlight)

    a.plug(new ActionMsgbox({
        container: $('#msgContainer')
    }));

### PLUGINS

Currently, there are few plugins you can plug into the action.

- ActionBootstrapHighlight - a plugin that automatically highlights the fields by the
  validation result sent from server side ActionKit.

- ActionGrowler - a plugin that pop-up the action result in MacGrowl-style
  message.

- ActionMsgbox - a plugin that renders the action result in the message box on
  the top of the form.


## BUILD

    composer install
    typings install
    npm install
    webpack

## DEVELOPMENT

Start webpack-dev-server

    webpack-dev-server --config webpack.server.config.js

Setup `action-js.dev` virtual host for running ActionKit in PHP.

## BACKLOG: TypeScript Migration Steps

### Install Prerequisite

Install typescript

    sudo npm install typescript -g
    sudo npm link typescript

Install typings (tsd was deprecated)

    sudo npm install typings -g
    sudo link typings

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

    npm install ts-loader --save-dev

Define ts-loader in webpack.config.js:

    module: {
      loaders: [{
          test: /\.(js|jsx)$/,
          loaders: ['babel'],
          exclude: [nodeModulesPath]
      }, { test: /\.tsx?$/, loader: 'ts-loader' }],
    } ... 


### Fixing Type Errors

Export symbols to window:

```javascript
(<any>window).myFunc
```

Migrate old prototype based class to ES6 class

Add property names to class definition.

```javascript
class Action {

    actionName: string;

    plugins: Array<Object>;

    formEl: any;

    options: ActionSettings;

    ...

}
```

Use JQueryAjaxSettings to ajaxSettings property

```javascript
class ... {
    ajaxSettings: JQueryAjaxSettings;
}
```

Cast element from getElementById function call to HTMLElement types, e.g.

```javascript
var i = <HTMLIFrameElement>document.getElementById(id);
```

Fix AIM, the onComplete property setting. Change

```javascript
i.onComplete = c.onComplete;
```

to:

```javascript
i['onComplete'] = c.onComplete;
```

Functions return jQuery Deferred should be defined with `JQueryDeferred<T>` in the prototype:

```javascript
var doSubmit = (payload): JQueryDeferred<any> => {
    ...
};
```

Abstract config structure into interface (quality depends on how you define
   the types):

```javascript
interface ActionSettings {

    // optional property
    plugins?: Array<ActionPlugin>;

    confirm?: string;

    disableInput?: boolean;

    // optional function
    onSubmit? ():any;

    beforeSubmit? ():any;

    beforeUpload? ():any;
}
```



