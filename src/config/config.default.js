var config = module.exports = {};

config.env = 'dev';
config.host = '0.0.0.0';
config.port = 2050;

config.eventstoreConnection = 'tcp://eventstore:1113';
config.eventstoreUsername = 'admin';
config.eventstorePassword = 'changeit';
config.eventstoreConnectionSettings = {"admin":"changeit"};

config.elasticSearchLink = "http://elasticsearch:9200";
config.elasticSearchIndexName = "diary-logs";
config.elasticSearchFlushInterval = 5000;

// logging
config.logAppender = "debug";
config.logLevel = "debug";