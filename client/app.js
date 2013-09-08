var Config = {
    apiUrl : process.argv[2],
    index  : process.argv[3],
};

var request = require('request');
var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.errorHandler());

function formatResult(rawResult) {
    if ( !(rawResult && rawResult.hits && rawResult.hits.hits) ) {
        return;
    }
    var hits = rawResult.hits.hits;
    return hits.map(function(hit) { return hit._source });
}

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/api/search', function(req, res) {
    var content = req.query.content || '';
    var target = req.query.target || '';
    var sort = req.query.sort || 1;
    var page = req.query.page || 1;

    var json = {
        from : (page - 1) * 20,
        size : 20,
    };

    if (sort && sort === 'timestamp') {
        json.sort = [
            { "timestamp" : "desc" },
        ];
    }

    var filters = [{ terms : { event : ["privmsg", "notice"] }, }];
    if (target) {
        filters.push( { term  : { target : target }, } );
    }

    json.query = {
        filtered : {
            filter : {
                and : filters,
            },
        },
    };

    if (content) {
        json.query.filtered.query = { match : { content : content } };
    }

    request.post(
        [ Config.apiUrl, Config.index, 'message', '_search'].join('/'),
        { json : json }, 
        function(error, response, body) {
            if (error) {
                console.log(error);
            }
            res.json({ results : formatResult(body) });
        }
    );
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
