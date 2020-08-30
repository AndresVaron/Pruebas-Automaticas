const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    timestamp: Date,
    text: String,
    unformattedText: String,
    info: { $type: mongoose.Schema.Types.Mixed },
    user: String, // profile name (unfortunately)
    username: String,
    contributor: { $type: mongoose.Schema.Types.Mixed },
    backer: { $type: mongoose.Schema.Types.Mixed },
    uuid: String, // sender uuid
    userStyles: { $type: mongoose.Schema.Types.Mixed },
    flags: { $type: mongoose.Schema.Types.Mixed, default: {} },
    flagCount: { $type: Number, default: 0 },
    likes: { $type: mongoose.Schema.Types.Mixed },
    client: String,
    _meta: { $type: mongoose.Schema.Types.Mixed },
    groupId: { type: String, ref: 'Group' },
});

module.exports = mongoose.model('Chat', schema, 'chats');