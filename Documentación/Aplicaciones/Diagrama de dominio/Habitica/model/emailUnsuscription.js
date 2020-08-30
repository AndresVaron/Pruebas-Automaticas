const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {
        $type: String,
    }
}
);
module.exports = mongoose.model('EmailUnsuscription', schema, 'emailUnsuscriptions');
