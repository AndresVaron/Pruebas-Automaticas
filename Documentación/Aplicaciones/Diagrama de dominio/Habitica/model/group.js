const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: { $type: String },
    summary: { $type: String },
    description: String,
    leader: {
        type: String, ref: 'User',
    },
    type: { $type: String, enum: ['guild', 'party'], },
    privacy: {
        $type: String, enum: ['private', 'public'],
    },
    chat: Array, // Used for backward compatibility, but messages aren't stored here
    bannedWordsAllowed: { $type: Boolean, required: false },
    leaderOnly: { // restrict group actions to leader (members can't do them)
        challenges: { $type: Boolean, default: false, },
        // invites: {$type: Boolean, default: false,},
        // Some group plans prevent members from getting gems
        getGems: { $type: Boolean, default: false },
    },
    memberCount: { $type: Number, },
    challengeCount: { $type: Number },
    balance: { $type: Number },
    logo: String,
    leaderMessage: String,
    quest: {
        key: String,
        active: { $type: Boolean, default: false },
        leader: { type: String, ref: 'User' },
        progress: {
            hp: Number,
            collect: {
                $type: mongoose.Schema.Types.Mixed,
            }, // {feather: 5, ingot: 3}
        },

        // Shows boolean for each party-member who has accepted the quest.
        // Eg {UUID: true, UUID: false}. Once all users click
        // 'Accept', the quest begins.
        // If a false user waits too long, probably a good sign to prod them or boot them.
        // TODO when booting user, remove from .joined and check again if we can now start the quest
        members: {
            $type: mongoose.Schema.Types.Mixed,
        },
        extra: {
            $type: mongoose.Schema.Types.Mixed,
        },
    },
    tasksOrder: {
        habits: [{ type: String, ref: 'Task' }],
        dailys: [{ type: String, ref: 'Task' }],
        todos: [{ type: String, ref: 'Task' }],
        rewards: [{ type: String, ref: 'Task' }],
    },
    purchased: {
        plan: {
            type: String, ref: 'SubscriptionPlan'
        },
    },
    managers: {
        $type: mongoose.Schema.Types.Mixed,
    },
    categories: [{
        slug: { $type: String },
        name: { $type: String },
    }],
});

module.exports = mongoose.model('Group', schema, 'groups');
