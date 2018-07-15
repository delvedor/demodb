# demodb

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  [![Build Status](https://travis-ci.org/delvedor/demodb.svg?branch=master)](https://travis-ci.org/delvedor/demodb)

You are about to give a workshop where you must show how to use a technology and you also need a database for demo purposes, everything is ready, your demo is working and the attendees just need to checkout the initial code.<br/>
*What could go wrong?*

### Everything!

Enter `demodb`.<br/>
`demodb` is a lightweight, native dependencies free, in memory database *(you can also save data to disk)*, built with [`fastify`](https://github.com/fastify/fastify) and [`lokijs`](https://github.com/techfort/LokiJS).<br/>
It exposes a nice HTTP API that you can easily consume from the browser or the server, it does not require authentication and can be run everywhere.


<a name="install"></a>
## Install
```
npm i demodb -g
```

<a name="usage"></a>
## Usage
```
demodb start test
```

### Client usage
```
npm i demodb
```
```js
const Demodb = require('demodb')
const demodb = new Demodb('http://localhost:8081')

const col = demodb.collection('users')
await col.insert({ winter: 'is coming', tag: 'got' })
const result = await col.findOne({ tag: 'got' })
```

#### Need help?
```
demodb help
```

## API

The entire API is expose via HTTP, the canonical url is: `/db/:collection/:command`. The collection part of the url is the collection name that you are using (like mongo!), the last part is the command you want to run.<br/>
The currently supported [`lokijs`](https://github.com/techfort/LokiJS) APIs are:

#### `find`
```js
{
  method: 'POST',
  url: '/db/:collection/find',
  body: { your query }
}
```
#### `findOne`
```js
{
  method: 'POST',
  url: '/db/:collection/findOne',
  body: { your query }
}
```
#### `insert`
```js
{
  method: 'POST',
  url: '/db/:collection/insert',
  body: { your query }
}
```
#### `update`
```js
{
  method: 'POST',
  url: '/db/:collection/update',
  body: { your query }
}
```
#### `remove`
```js
{
  method: 'POST',
  url: '/db/:collection/remove',
  body: { your query }
}
```

## Contributing
If you feel you can help in any way, be it with examples, extra testing, or new features please open a pull request or open an issue.


## License
**[MIT](https://github.com/delvedor/demodb/blob/master/LICENSE)**

Copyright © 2018 Tomas Della Vedova
