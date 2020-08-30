const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    consumed: { $type: Boolean, },
    userId: { type: String, ref: 'User', }
});

module.exports = mongoose.model('IapPurchaseReceipt', schema, 'iapPurchaseReceipts');
