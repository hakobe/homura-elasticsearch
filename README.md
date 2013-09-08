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

