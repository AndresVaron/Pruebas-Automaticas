const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    type: {
        $type: String,

    },
    label: {
        $type: String,
    },
    url: {
        $type: String,
    },
    enabled: { $type: Boolean, },
    failures: { $type: Number, },
    lastFailureAt: { $type: Date },
    options: {
        type: mongoose.Schema.Types.Mixed,
    },
    user: { type: String, ref: 'User' }
});

module.exports = mongoose.model('Webhook', schema, 'webhooks');
