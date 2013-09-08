'use strict';

var request = require('request');

function ElasticSearch(options, homura, logger) {
    this.apiUrl = options.apiUrl || 'http://localhost:9200';
    this.index  = options.index || 'homura';
    this.logger = logger;

    this.setupMapping();
}

ElasticSearch.prototype.tagForLog = function() {
    return 'homura.module.elasticsearch(' + this.apiUrl + '/' + this.index + ')';
};

ElasticSearch.prototype.handleIrcClient = function( ircClient, bouncer ) {
    ircClient.on( 'mode', (function(message) {
        if (message.params[0].match( '[' + ircClient.isupport.config.CHANTYPES + ']' )) { // only channel
            this.indexMessage( bouncer.name, 'mode', message.nick, message.params[0] );
        }
    }).bind(this) );

    ircClient.on( 'kick', (function(message) {
        this.indexMessage( bouncer.name, 'kick', message.nick, message.params[0], message.params[1]);
    }).bind(this) );

    ircClient.on( 'quit', (function(message) {
        Object.keys(ircClient.channels).forEach( (function(channelName) {
            this.indexMessage( bouncer.name, 'quit', message.nick, null, message.params[0]);
        }).bind(this) );
    }).bind(this) );

    ircClient.on( 'join', (function(message) {
        this.indexMessage( bouncer.name, 'join', message.nick, message.params[0]);
    }).bind(this) );

    ircClient.on( 'part', (function(message) {
        this.indexMessage( bouncer.name, 'part', message.nick, message.params[0]);
    }).bind(this) );

    ircClient.on( 'nick', (function(message) {
        Object.keys(ircClient.channels).forEach( (function(channelName) {
            this.indexMessage( bouncer.name, 'nick', message.nick, null, message.params[1]);
        }).bind(this) );
    }).bind(this) );

    ircClient.on( 'topic', (function(message) {
        this.indexMessage( bouncer.name, 'topic', message.nick, message.params[0], message.params[1]);
    }).bind(this) );

    ircClient.on( 'privmsg', (function(message) {
        this.indexMessage( bouncer.name, 'privmsg', message.nick, message.params[0], message.params[1]);
    }).bind(this) );

    ircClient.on( 'notice', (function(message) {
        this.indexMessage( bouncer.name, 'notice', message.nick, message.params[0], message.params[1]);
    }).bind(this) );
};

ElasticSearch.prototype.handleUserSession = function( userSession, bouncer ) {
    userSession.on( 'privmsg', (function(message) {
        this.indexMessage( bouncer.name, 'privmsg', userSession.nick, message.params[0], message.params[1]);
    }).bind(this) );
    userSession.on( 'notice', (function(message) {
        this.indexMessage( bouncer.name, 'notice', userSession.nick, message.params[0], message.params[1]);
    }).bind(this) );
};

ElasticSearch.prototype.setupMapping = function() {
    var mapping = {
        "message" : {
            "_timestamp" : { "enabled" : true, "path" : "timestamp" },
            "properties" : {
                "bouncer_name" : { "type" : "string", "index" : "not_analyzed" },
                "event"     : { "type" : "string", "index" : "not_analyzed" },
                "author"    : { "type" : "string", "index" : "not_analyzed" },
                "target"    : { "type" : "string", "index" : "not_analyzed" },
                "content"   : { "type" : "string" },
                "timestamp" : { "type" : "date" },
            }
        }
    };
    request.put([this.apiUrl, this.index, 'message', '_mapping'].join('/') , { json : mapping }, (function(error, res, body) {
        if (error) {
            this.logger.error( this.tagForLog(), 'Document mapping sending error:' + error);
        }
        else {
            this.logger.debug( this.tagForLog(), 'Document mapping has been sent' );
        }
    }).bind(this));
};

ElasticSearch.prototype.indexMessage = function( bouncerName, event, author, target, content ) {
    var doc = {
        bouncer_name : bouncerName,
        event        : event,
        timestamp    : new Date().getTime(),
    };
    if (author) {
        doc.author = author;
    }
    if (target) {
        doc.target = target;
    }
    if (content) {
        doc.content = content;
    }
    request.post([this.apiUrl, this.index, 'message'].join('/') , { json : doc }, (function(error, res, body) {
        if (error) {
            this.logger.error( this.tagForLog(), 'Indexing error:' + error);
        }
        else {
            this.logger.debug( this.tagForLog(), 'Message has been sent' );
        }
    }).bind(this));
};


module.exports = ElasticSearch;
