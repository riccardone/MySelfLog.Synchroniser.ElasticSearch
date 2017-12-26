module.exports = DiaryEventModel;

function DiaryEventModel(obj, metadata) {

    var defaultState = {      
        SecurityLink: '',
        CreatedAt: metadata.Applies, // TODO fix Evento with applies and reverses metadata fields!
        CorrelationId: metadata['$correlationId']
    };

    if (obj.hasOwnProperty('SecurityLink'))
        defaultState.SecurityLink = obj.SecurityLink;    

    return defaultState;
}