const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    subject: String,
    message: String,
    createdAt: Date,
});

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
