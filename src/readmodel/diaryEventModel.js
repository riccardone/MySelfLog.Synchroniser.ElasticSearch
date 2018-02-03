var moment = require('moment');

module.exports = DiaryEventModel;

function DiaryEventModel(obj, metadata) {

    var applies = moment(metadata.Applies);

    var model = {      
        Id: metadata['$correlationId'],
        DiaryName: obj.Name,
        Applies: applies.toISOString(),         
        Source: metadata['Source']
    };    
    return model;
}