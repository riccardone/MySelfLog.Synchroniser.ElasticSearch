module.exports = DiaryEventModel;

function DiaryEventModel(obj, metadata) {
    var model = {      
        Id: metadata['$correlationId'],
        DiaryName: obj.Name,
        Applies: metadata.Applies,         
        Source: metadata['Source']
    };    
    return model;
}