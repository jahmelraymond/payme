const mongoose = require('mongoose')

const Schema = mongoose.Schema

const newUser = new Schema({
    username: { type: String, unique: true, required: true, maxLength: 15 },
    password: { type: String, required: true },
    fullname: { type: String },
    phonenumber: { type: String },
    email: { type: String },
    joined: { type: String, required: true },
    contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    bio: { type: String },
    notifications: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    added: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    pushNotifications: Boolean,
    securityLock: Boolean,
    findMe: Boolean,
    getRequests: Boolean,
    securityPin: { type: Number, max: 4, min: 4 },
    createdAt: Date,
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    requests: [{ type: Schema.Types.ObjectId, ref: "Request" }],
    accounts: [{ type: Schema.Types.ObjectId, ref: "Bank" }],
    restricted: { type: Boolean },
    admin: { type: Boolean },
    permissions: { addUser: false, deleteUser: false, restrictUser: false, flagUser: false },
    flagged: Boolean

})
const newPayment = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, required: true },
    amount: { type: Number, required: true },
    note: String,
    received: Boolean,
    sent: Boolean,
    sendersName: { type: String, required: true },
    receiversName: { type: String, required: true },
    paymentBool: { type: Boolean, required: true }
})
const newRequest = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, required: true },
    amount: { type: Number, required: true },
    note: String,
    received: Boolean,
    sent: Boolean,
    sendersName: { type: String, required: true },
    receiversName: { type: String, required: true },
    requestBool: { type: Boolean, required: true }

})
const newBank = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bankName: { type: String, required: true },
    cardHolder: { type: String, required: true },
    bankCardNumber: { type: String, required: true },
    cvv: { type: String, required: true },
    exp: { type: String, required: true },
    zip: { type: String, required: true },
    accountNumber: { type: String, required: true },
    routingNumber: { type: String, required: true },
    balance: { type: Number, required: true, min: 0 }
})


const User = mongoose.model("User", newUser)
const Payment = mongoose.model("Payment", newPayment)
const Request = mongoose.model("Request", newRequest)
const Bank = mongoose.model("Bank", newBank)



module.exports = { User, Payment, Request, Bank }