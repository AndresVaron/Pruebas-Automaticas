const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    type: {
        $type: String,
    },
    text: { $type: String, },
    notes: { $type: String, },
    alias: {
        $type: String,
    },
    tags: [{
        $type: String,
    }],
    value: {
        $type: Number,
    },
    priority: {
        $type: Number,
    },
    attribute: { $type: String, },
    userId: { type: String, ref: 'User', required: true, }, // When not set it belongs to a challenge
    challenge: {
        id: { type: String, ref: 'Challenge', }, // When set (and userId not set) it's the original task
        taskId: { type: String, ref: 'Task', }, // When not set but challenge.id defined it's the original task
        broken: { $type: String, enum: ['CHALLENGE_DELETED', 'TASK_DELETED', 'UNSUBSCRIBED', 'CHALLENGE_CLOSED', 'CHALLENGE_TASK_NOT_FOUND'] }, // CHALLENGE_TASK_NOT_FOUND comes from v3 migration
        winner: String, // user.profile.name of the winner
    },
    group: {
        id: { type: String, ref: 'Group', },
        broken: { $type: String, enum: ['GROUP_DELETED', 'TASK_DELETED', 'UNSUBSCRIBED'] },
        assignedUsers: [{ type: String, ref: 'User' }],
        assignedDate: { $type: Date },
        assigningUsername: { $type: String },
        taskId: { type: String, ref: 'Task', },
        approval: {
            required: { $type: Boolean, default: false },
            approved: { $type: Boolean, default: false },
            dateApproved: { $type: Date },
            approvingUser: { type: String, ref: 'User', },
            requested: { $type: Boolean, default: false },
            requestedDate: { $type: Date },
        },
        sharedCompletion: {
            $type: String
        },
        managerNotes: String,
    },
    byHabitica: { $type: Boolean, default: false }, // Flag of Tasks that were created by Habitica
});

module.exports = mongoose.model('Task', schema, 'tasks');