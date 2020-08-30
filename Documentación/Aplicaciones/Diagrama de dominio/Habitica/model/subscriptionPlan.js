const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    planId: String,
    subscriptionId: String,
    owner: { type: String, ref: 'User' },
    quantity: { $type: Number, },
    paymentMethod: String, // enum: ['Paypal', 'Stripe', 'Gift', 'Amazon Payments', 'Google', '']}
    customerId: String, // Billing Agreement Id in case of Amazon Payments
    dateCreated: Date,
    dateTerminated: Date,
    dateUpdated: Date,
    extraMonths: { $type: Number },
    gemsBought: { $type: Number },
    mysteryItems: { $type: Array, },
    lastReminderDate: Date, // indicates the last time a subscription reminder was sent
    lastBillingDate: Date, // Used only for Amazon Payments to keep track of billing date
    additionalData: mongoose.Schema.Types.Mixed,
    nextPaymentProcessing: Date,
    nextBillingDate: Date, // Next time google will bill this user.
    consecutive: {
        count: { $type: Number, },
        offset: { $type: Number, },
        gemCapExtra: { $type: Number, },
        trinkets: { $type: Number, },
    },
});

module.exports = mongoose.model('SubscriptionPlan', schema, 'subscriptionPlans');
