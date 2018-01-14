var config = require('./config.default');

config.env = 'test';
config.host = 'localhost';
config.port = 2050;

config.eventstoreConnection = 'tcp://eventstoretest:1113';
config.eventstoreConnectionSettings = {"admin":"changeit"};
config.listenFrom = "dataacquisition-input";
config.eventType = "RawErmsMessageReceived";
config.category = "claims";
config.domain = "claims";
config.aggregateBaseName = "claim";

config.elasticSearchLink = "localhost:9200";
config.elasticSearchIndexName = "dataacquisition-erms-";
config.elasticSearchFlushInterval = 5000;

// logging
config.logAppender = "info";
config.logLevel = "info";

module.exports = config;