import mongoose from 'mongoose';

const querySchema = mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    subject : String,
    message: String,
    createdAt: Date,
})


const Query = mongoose.model('Query',querySchema);

export default Query;