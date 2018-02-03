var moment = require('moment');

module.exports = DiaryLogModel;

function DiaryLogModel(obj, metadata, id) {

    var logDate = moment(metadata.Applies);

    var defaultState = {
        Id: id,
        Value: '',
        Mmolvalue: '',
        SlowTerapy: '',
        FastTerapy: '',
        Calories: '',
        Message: '',
        LogType: metadata.LogType,
        LogDate: logDate.toISOString(),
        Source: '',
        CorrelationId: metadata['$correlationId']
    };

    if (metadata.LogType === 'Terapy' && obj.IsSlow) {
        defaultState.SlowTerapy = obj.Value;
        defaultState.LogType = "Slow-Terapy";
    }

    if (metadata.LogType === 'Terapy' && !obj.IsSlow) {
        defaultState.FastTerapy = obj.Value;
        defaultState.LogType = "Fast-Terapy";
    }

    if (obj.hasOwnProperty('Source'))
        defaultState.Source = obj.Source;

    if (obj.hasOwnProperty('SecurityLink'))
        defaultState.SecurityLink = obj.SecurityLink;

    if (obj.hasOwnProperty('MmolValue'))
        defaultState.Mmolvalue = obj.MmolValue;

    if (obj.hasOwnProperty('Value') && metadata.LogType === 'Blood-Sugar')
        defaultState.Value = obj.Value;

    if (obj.hasOwnProperty('Message'))
        defaultState.Message = obj.Message;

    if (obj.hasOwnProperty('Calories'))
        defaultState.Calories = obj.Calories;

    if (obj.hasOwnProperty('Calories') && metadata.LogType !== 'Calories')
        defaultState.LogType = 'Calories';

    return defaultState;
}