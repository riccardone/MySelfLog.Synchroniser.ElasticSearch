var logger = require('log4js').getLogger('service');
var indexerEventsModule = require('./indexer');
var indexerLogsModule = require('./indexer');

var busModule = require('./bus');
var eventBus = busModule();

var lastPosition = null;
var resolveLinkTos = false;
var mapperInstance;
var connection;
var subscription;
var indexer;

function Service(mapper) {
    mapperInstance = mapper;    
    indexer = new indexerLogsModule('http://elasticsearch:9200', 'diary-logs', 'diaryLog', 5000);    
}

function start(conn, credentials) {
    connection = conn;
    subscription = connection.subscribeToAllFrom(lastPosition, resolveLinkTos, eventAppeard, liveProcessingStarted, subscriptionDropped, credentials);
}

var handlers = {
    'DiaryCreatedV1': handleDiaryCreatedV1,
    'FoodLoggedV1': handleFoodLoggedV1,
    'GlucoseLoggedV1': handleGlucoseLoggedV1,
    'TerapyLoggedV1': handleTerapyLoggedV1
};

function handleDiaryCreatedV1(data, metadata) {
    var diaryEvent = mapperInstance.toDiaryEventModel(data, metadata);    
    eventBus.publish("diaryEventReceived", diaryEvent);    
}

function handleFoodLoggedV1(data, metadata) {    
    var diaryLog = mapperInstance.toDiaryLogModel(data, metadata, "Food");    
    eventBus.publish("diaryLogReceived", diaryLog);    
}

function handleGlucoseLoggedV1(data, metadata) {    
    var diaryLog = mapperInstance.toDiaryLogModel(data, metadata, "Blood-Sugar");
    eventBus.publish("diaryLogReceived", diaryLog);
}

function handleTerapyLoggedV1(data, metadata) {    
    var diaryLog = mapperInstance.toDiaryLogModel(data, metadata, "Terapy");
    eventBus.publish("diaryLogReceived", diaryLog);
}

var handle = function (type, data, metadata) {
    handlers[type](data, metadata);
}

//TODO find a way to make this not public but accessible from tests
function processEvent(eventType, data, metadata) {
    handle(eventType, data, metadata);
}

const eventAppeard = (sub, event) => {
    if (isSystemEvent(event.event.eventType)) return;
    if (!handlerFound(event.event.eventType)) return;
    var data = deserialiseEventToString(event.event.data);
    var metadata = deserialiseEventToString(event.event.metadata);    

    processEvent(event.event.eventType, data, metadata);
}

function deserialiseEventToString(buffer) {
    return buffer.toString('utf-8');
}

const liveProcessingStarted = () => {
    logger.info("Diary Indexing Service LiveProcessingStarted! Listening for new events.")
}

const subscriptionDropped = (subscription, reason, error) =>
    logger.info(error ? error : "Subscription dropped.")

function isSystemEvent(eventType) {
    return eventType[0] == "$"
}

function handlerFound(eventType) {
    return handlers[eventType] !== undefined
}

Service.prototype.start = start;
Service.prototype.processEvent = processEvent;
module.exports = Service;