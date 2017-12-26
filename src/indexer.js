var elasticsearch = require('elasticsearch');
var busModule = require('./bus');
var logger = require('log4js').getLogger('indexer');
var cfg = require('./config');

var eventBus = busModule();
var _docsReady = [];
var _docsForSanctionsReady = [];
var _docType, _link, _interval, _client;
var _indexName;

function Indexer(link, indexName, docType, flushInterval) {
    _indexName = indexName;
    _docType = docType;
    eventBus.subscribe(_docType + "Received", (doc) => {
        _docsReady.push(doc);
    });
    _link = link;
    _client = new elasticsearch.Client({
        host: _link,
        log: 'trace'
    });
    initIndex(_indexName);
    _interval = setInterval(flushDocuments, flushInterval);
}

function initIndex(indexName) {
    _client.indices.exists({ index: indexName }).then(function (indexExists) {
        if (!indexExists) {
            _client.indices.create({ index: indexName }).then(function (response) {
                console.log("Index '" + indexName + "' created");
            }, function (error) {
                console.log(error.message);
            });
        }
    }, function (error) {
        console.log(error.message);
    });
}

function flushDocuments() {
    if (_docsReady.length > 0) {
        putMappings().then(function (response) {
            indexDocuments(_docsReady).then(function (resp) {
                if (resp.errors) {
                    logger.error("bulk operation completed with errors");
                } else {
                    logger.info("stored or refreshed " + _docsReady.length + " documents in '" + _indexName + "' index");
                    _docsReady = [];
                }
            })
        });
    }
}

var stopIndexer = function () {
    clearInterval(interval);
}

function putMappings() {
    return _client.indices.putMapping({
        "index": _indexName,
        "type": "diaryLog",
        "body": {
            "diaryLog": {
                "properties": {
                    "Id": {
                        "type": "text"
                    },
                    "Value": {
                        "type": "integer"
                    },
                    "Mmolvalue": {
                        "type": "double"
                    },
                    "SlowTerapy": {
                        "type": "integer"
                    },
                    "FastTerapy": {
                        "type": "integer"
                    },
                    "Calories": {
                        "type": "integer"
                    },
                    "Message": {
                        "type": "text"
                    },
                    "LogDate": {
                        "type": "date",
                        "format": "MM/dd/yyyy HH:mm:ss||yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis",
                        "ignore_malformed": true
                    },
                    "Source": {
                        "type": "text"
                    },
                    "CorrelationId": {
                        "type": "text"
                    }
                }
            }
        }
    });
}

function indexDocuments(documents) {
    var br = [];
    function create_bulk(bulk_request) {
        var obj

        for (i = 0; i < documents.length; i++) {
            obj = documents[i]
            bulk_request.push({ index: { _index: _indexName, _type: _docType, _id: obj.Id } });
            bulk_request.push(obj);
        }
        return bulk_request;
    };
    create_bulk(br);
    // Standard function of ElasticSearch to use bulk command
    return _client.bulk(
        {
            body: br
        });
}

module.exports = Indexer;