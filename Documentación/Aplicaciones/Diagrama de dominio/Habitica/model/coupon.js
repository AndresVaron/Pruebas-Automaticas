const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    event: { $type: String, enum: ['wondercon', 'google_6mo'] },
    user: { type: String, ref: 'User' },
});

module.exports = mongoose.model('Coupon', schema, 'coupons');
