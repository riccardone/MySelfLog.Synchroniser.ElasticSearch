var config = module.exports = {};

config.env = 'dev';
config.host = 'localhost';
config.port = 2050;

config.eventstoreConnection = 'tcp://localhost:1113';
config.eventstoreUsername = 'admin';
config.eventstorePassword = 'changeit';
config.eventstoreConnectionSettings = {"admin":"changeit"};

config.elasticSearchLink = "http://localhost:9200";
config.elasticSearchIndexName = "diary-logs";
config.elasticSearchFlushInterval = 5000;

// logging
config.logAppender = "debug";
config.logLevel = "debug";