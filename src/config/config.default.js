var config = module.exports = {};

config.env = 'dev';
config.host = '0.0.0.0';
config.port = 2050;

config.eventstoreConnection = process.env.EventStore_Link || 'tcp://eventstore:1113';
config.eventstoreUsername = process.env.EventStore_User || 'admin';
config.eventstorePassword = process.env.EventStore_Password || 'cicciomariano';
config.eventstoreConnectionSettings = '{'+config.eventstoreUsername+':'+config.eventstorePassword+'}';

config.elasticSearchLink = process.env.Elastic_Link || 'http://elasticsearch:9200';
config.elasticSearchIndexName = "diary-logs";
config.elasticSearchFlushInterval = 5000;

// logging
config.logAppender = "debug";
config.logLevel = "debug";