const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    summary: { type: String },
    description: String,
    official: { type: Boolean, default: false },
    leader: {
        type: String, ref: 'User', required: true,
    },
    group: {
        type: String, ref: 'Group', required: true,
    },
    memberCount: { type: Number, default: 0 },
    prize: { type: Number, default: 0, min: 0 },
    categories: [{
        slug: { type: String },
        name: { type: String },
    }],
});

module.exports = mongoose.model('Challenge', schema, 'challenges');


