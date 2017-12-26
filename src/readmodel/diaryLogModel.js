module.exports = DiaryLogModel;

function DiaryLogModel(obj, metadata, id) {

    var defaultState = {
        Id: id,
        Value: '',
        Mmolvalue: '',
        SlowTerapy: '',
        FastTerapy: '',
        Calories: '',
        Message: '',        
        LogType: metadata.LogType,
        LogDate: metadata.Applies, 
        Source: '',
        CorrelationId: metadata['$correlationId']
    };

    if (obj.hasOwnProperty('Source'))
        defaultState.Source = obj.Source;

    if (obj.hasOwnProperty('SecurityLink'))
        defaultState.SecurityLink = obj.SecurityLink;

    if (obj.hasOwnProperty('MmolValue'))
        defaultState.Mmolvalue = obj.MmolValue;

    if (obj.hasOwnProperty('Value'))
        defaultState.Value = obj.Value;

    if (obj.hasOwnProperty('Message'))
        defaultState.message = obj.Message;

    if (obj.hasOwnProperty('Calories'))
        defaultState.Calories = obj.Calories;

    return defaultState;
}