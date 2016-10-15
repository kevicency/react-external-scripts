# react-external-scripts

A server-side utility component that allows you to add external scripts to
your server-side render based on what components get rendered.

Client-side updates are currently not supported.

Built with [React Side Effect](https://github.com/gaearon/react-side-effect).

## Installation
```
npm install --save react-external-scripts
```

## Example

Let's say you want to render (parts) of your web app as an Outlook Add-In.

### Client-Side

Wrap those parts in an `AddInContainer` that adds the `office.js` and dependencies
as external scripts.

```jsx
import ExternalScripts from 'react-external-scripts'

export default const AddInContainer = ({ children}) => (
  <ExternalScripts scripts=[{
    'https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.6/zepto.min.js', // or
    { url: 'https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js', async: true, defer: false }
  }]>
    { children }
 </ExternalScripts>
)
```

### Server-Side

This example uses [koa@2](http://koajs.com/) and implements the server-side rendering
of external scripts as a koa-middleware.

Use `ExternalScripts.rewind()` to collect all external scripts rendered in components

```js
  app.use(async function externalScripts(ctx, next) {
    await next()

    const scripts = ExternalScripts.rewind()

    if (scripts.length > 0 && ctx.body && ctx.body.indexOf) {
      const idx = ctx.body.indexOf('</head>')

      ctx.body = [
        ctx.body.substr(0, idx),
        scripts.map(script => {
          const asyncAttr = script.async ? ' async' : ''
          const deferAttr = script.defer ? ' defer' : ''

          return `<script type="text/javascript" src="${script.url}"${asyncAttr}${deferAttr}></script>`
        }).join(''),
        ctx.body.substr(idx)
      ].join('')
    }
  })
```

## API

```ts
export interface IScriptDefinition {
    url: String;
    async?: boolean;
    defer?: boolean;
};

export interface IExternalScriptsProps {
    children?: React.ReactNode;
    scripts?: Array<string | IScriptDefinition>;
};

declare var ExternalScripts: React.ComponentClass<IExternalScriptsProps> & {
  rewind() : Array<string | IScriptDefinition>
};
export default ExternalScripts;
```

## License
This project is licensed under the terms of the [MIT License](https://github.com/kmees/react-external-scripts/blob/master/LICENSE)