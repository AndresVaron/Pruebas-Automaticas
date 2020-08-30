const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    type: {
        $type: String,
    },
    data: {
        $type: mongoose.Schema.Types.Mixed,
    },
    seen: {
        $type: Boolean,
    },
});

module.exports = mongoose.model('UserNotification', schema, 'userNotifications');
