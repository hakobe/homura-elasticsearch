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

## Search Interface

```
$ cd homura_workingdir/node_modules/homura-elasticsearch
$ node client/app.js http://localhost:9200 homura
```

Access to http://localhost:3000
