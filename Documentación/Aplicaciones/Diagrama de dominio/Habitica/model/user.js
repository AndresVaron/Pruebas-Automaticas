const mongoose = require('mongoose');

const NestedSchema = new mongoose.Schema({
    name: String
});

const schema = new mongoose.Schema({
    apiToken: {
        $type: String
    },
    auth: NestedSchema,
    // We want to know *every* time an object updates.
    // Mongoose uses __v to designate when an object contains arrays which
    // have been updated (http://goo.gl/gQLz41), but we want *every* update
    migration: String,
    achievements: NestedSchema,
    backer: NestedSchema,
    contributor: NestedSchema,
    balance: { $type: Number, },
    purchased: NestedSchema,
    flags: NestedSchema,
    history: NestedSchema,
    items: NestedSchema,
    lastCron: { $type: Date, },
    _cronSignature: { $type: String, }, // Private property used to avoid double cron
    newMessages: {
        $type: mongoose.Schema.Types.Mixed,
    },
    challenges: [NestedSchema],
    invitations: NestedSchema,
    guilds: [NestedSchema],
    party: NestedSchema,
    preferences: NestedSchema,
    profile: NestedSchema,
    stats: NestedSchema,
    notifications: [NestedSchema],
    tags: [NestedSchema],
    inbox: NestedSchema,
    tasksOrder: {
        habits: [NestedSchema],
        dailys: [NestedSchema],
        todos: [NestedSchema],
        rewards: [NestedSchema],
    },
    extra: {
        $type: mongoose.Schema.Types.Mixed,
    },
    pushDevices: [NestedSchema],
    _ABtests: {
        $type: mongoose.Schema.Types.Mixed,
    },
    webhooks: [NestedSchema],
    loginIncentives: { $type: Number, },
    invitesSent: { $type: Number, },
    pinnedItems: [NestedSchema],
    pinnedItemsOrder: [{ $type: String }],
    unpinnedItems: [NestedSchema],
    secret: {
        text: String,
    },
});

module.exports = mongoose.model('User', schema, 'users');
