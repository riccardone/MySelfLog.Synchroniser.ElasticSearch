var config = require('./config.default');

config.env = 'prod';
config.host = 'localhost';
config.port = 2050;

config.eventstoreConnection = 'tcp://admin:changeit@eventstore:1113';
config.eventstoreUsername = 'admin';
config.eventstorePassword = 'changeit';
config.eventstoreConnectionSettings = {"admin":"changeit"};

config.elasticSearchLink = "http://elasticsearch:9200";
config.elasticSearchIndexName = "diary-logs";
config.elasticSearchFlushInterval = 5000;

// logging
config.logAppender = "error";
config.logLevel = "error";

module.exports = config;