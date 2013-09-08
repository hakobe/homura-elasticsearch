# homura-elasticsearch

This is a plugin module for [homura](http://github.com/hakobe/homura) to index IRC events to [ElasticSearch](http://www.elasticsearch.org/)

## Install

```
$ cd homura_workingdir
$ npm install homura-elasticsearch
```

## Config

Write module setting to `config.json` of your homur.

```
{
    ...
    "modules" : [
        {
            "name" : "homura-elasticsearch",
            "apiUrl" : "",
            "index"  : "homura"
        }
    ],
    ...
}

```

## Client

```
$ cd homura_workingdir/node_modules/homura-elasticsearch
$ node client/app.js http://localhost:9200 homura
```

Access to http://localhost:3000

![sample](http://cdn-ak.f.st-hatena.com/images/fotolife/h/hakobe932/20130909/20130909081040.gif)

## Author
- @hakobe

## License

Licensed under the MIT License
