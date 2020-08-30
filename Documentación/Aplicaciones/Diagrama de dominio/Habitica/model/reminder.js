const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    startDate: { $type: Date },
    time: { $type: Date, },
    task: { type: String, ref: 'Task' },
});

module.exports = mongoose.model('Reminder', reminderSchema, 'reminders');
