var elasticsearch = require('elasticsearch');
var busModule = require('./bus');
var logger = require('log4js').getLogger('indexer');
var cfg = require('./config');

var eventBus = busModule();
var _docsReady = [];
var _diaryEventDocsReady = [];
var _client;
var _interval;
var _elasticDocTypeForLogs = "diaryLog";

function Indexer(link) {
    init();
    subscribeMe();
}

function subscribeMe(){
    eventBus.subscribe("diaryEventReceived", (doc) => {
        if(!_diaryEventDocsReady){
            _diaryEventDocsReady = [];
        }
        _diaryEventDocsReady.push(doc);
    });
    eventBus.subscribe(_elasticDocTypeForLogs + "Received", (doc) => {
        if(!_docsReady){
            _docsReady = [];
        }
        _docsReady.push(doc);
    });
}

function init() {
    _client = new elasticsearch.Client({
        host: cfg.elasticSearchLink,
        log: 'trace'
    });
    initIndex("diary-events", putMappingsForDiaryEvents)
        .then((response) => {
            return initIndex(cfg.elasticSearchIndexName, putMappings);
        }).then((response) => {
            _interval = setInterval(function () {
                _docsReady = flusher(_docsReady, cfg.elasticSearchIndexName, _elasticDocTypeForLogs);
                _diaryEventDocsReady = flusher(_diaryEventDocsReady, "diary-events", "diaryEvent");
            }, cfg.elasticSearchFlushInterval);
        }).catch((error) => {
            logger.error(error);
        })
}

function initIndex(indexName, mappingFunc) {
    return _client.indices.exists({ index: indexName })
        .then(function (indexExists) {
            if (!indexExists) {
                return _client.indices.create({ index: indexName })
                    .then(function (response) {
                        logger.info("Index '" + indexName + "' created");
                        return mappingFunc();
                    });
            }
        });
}

function handleDiaryEvent(doc) {
    _diaryEventDocsReady.push(doc);
}

function flusher(docs, indexName, docType) {
    if (docs && docs.length > 0) {
        indexDocuments(docs, indexName, docType).then(function (resp) {
            if (resp.errors) {
                logger.error("bulk operation on '" + indexName + "' index completed with errors");
                return docs;
            } else {
                logger.info("stored or refreshed " + docs.length + " documents in '" + indexName + "' index");
                return [];
            }
        });
    } else {
        return docs;
    }
}

var stopIndexer = function () {
    clearInterval(_interval);
}

function putMappingsForDiaryEvents() {
    return _client.indices.putMapping({
        "index": "diary-events",
        "type": "diaryEvent",
        "body": {
            "diaryEvent": {
                "properties": {
                    "Id": {
                        "type": "text"
                    },
                    "DiaryName": {
                        "type": "text"
                    },
                    "Applies": {
                        "type": "date"
                        //"format": "MM/dd/yyyy HH:mm:ss||yyyyMMdd'T'HHmmssZ||yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis",
                        //"ignore_malformed": true
                    },
                    "Source": {
                        "type": "text"
                    }
                }
            }
        }
    });
}

function putMappings() {
    return _client.indices.putMapping({
        "index": cfg.elasticSearchIndexName,
        "type": _elasticDocTypeForLogs,
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
                        "type": "date"
                        //"format": "MM/dd/yyyy HH:mm:ss||yyyyMMdd'T'HHmmssZ||yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis",
                        //"ignore_malformed": true
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

function indexDocuments(documents, indexName, docType) {
    var br = [];
    function create_bulk(bulk_request) {
        var obj

        for (i = 0; i < documents.length; i++) {
            obj = documents[i]
            bulk_request.push({ index: { _index: indexName, _type: docType, _id: obj.Id } });
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

// function indexDocument(doc, docType, indexName) {
//     return _client.index({
//         index: indexName,
//         type: docType,
//         id: doc.Id,
//         body: doc
//     });
//     //   , function (error, response) {

//     //   });
// }

module.exports = Indexer;