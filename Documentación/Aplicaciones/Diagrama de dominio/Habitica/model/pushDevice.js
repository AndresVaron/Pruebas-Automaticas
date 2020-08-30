const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    regId: { $type: String, },
    type: { $type: String, enum: ['ios', 'android'] },
});

module.exports = mongoose.model('PushDevice', schema, 'pushDevices');
