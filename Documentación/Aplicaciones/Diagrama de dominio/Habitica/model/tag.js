const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: { $type: String },
    challenge: { type: String, ref: 'Challenge' },
    group: { type: String, ref: 'Group' },
});

module.exports = mongoose.model('Tag', schema, 'tags');
