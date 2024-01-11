const { User } = require('../model/payMeModel')
const { Payment } = require('../model/payMeModel')
const { Request } = require('../model/payMeModel')
const { Bank } = require('../model/payMeModel')
const { Admin } = require('../model/payMeModel')
const bcrypt = require("bcrypt")
const passport = require("passport")
const session = require('express-session')

module.exports = {
    search: (req, res) => {
        User.find({ username: req.params.user })
            // check to make sure the username is not in use
            .then(found => {
                console.log('found', found)
                if (found.length) { // if found isnt an empty arr (meaning that found includes that user)
                    return res.json({ error: "Username already in use." })
                }
                else {
                    res.json(req.params.user)
                }
            })
            .catch(err => console.log('search caught err', err))
    },
    emailOrPhone: (req, res) => {
        User.find({ $or: [{ phonenumber: req.params.input }, { email: req.params.input }] })
            .then(found => {
                if (found.length) {
                    res.json({ error: 'taken' })
                    console.log('found', found)

                }
                else {
                    res.json({ success: 'not taken' })
                }
            })
            .catch(err => console.log('email or phone caught err'))
    },
    create: (req, res) => {
        const hash = bcrypt.hashSync(req.body.password, 10)
        const newUser = new User(req.body)
        newUser.password = hash
        newUser.admin = false

        User.create(newUser)
            .then(createdUser => {
                console.log(" user created", createdUser);
                return res.json(createdUser)
            })
            .catch(err => console.log('create user error', err))
    },
    signIn: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => { // use passport method - uses LocalStrategy we defined in passport.config.

            if (err) res.json({ msg: "Error", error: err }); // error? respond with standardized resposne.
            if (!user) res.json({ msg: "Error", error: "No such user exists." }) // user doesnt exist ?  respond with standardized response
            else { // successful logins will reach this point
                req.login(user, (err) => {
                    if (err) throw err;
                    else {
                        // res.redirect('/')
                        res.json({ msg: "Success", user: user }); // respond with standardized successful response so frontend can react accordling - get it? react? a ha ha 
                        console.log('request user', req.user)
                    }
                })
            }
        })(req, res, next)
    },
    auth: (req, res) => {
        if (!req.user) res.json({ msg: "Error", Error: "Unable to auth user." }); // if we dont have that - res with error msg.
        else {
            // console.log(req.user) /// otherwise - respond with the user obj (cookie) from our req.user
            res.json({ user: req.user })
        }
    },
    findFriends: (req, res) => {
        User.find({ $or: [{ username: req.params.input }, { email: req.params.input }, { phonenumber: req.params.input }] })
            .then(found => {
                if (found.length) {
                    return res.json(found)
                } else {
                    return res.json({ error: 'User Not Found ' })
                }
            })
            .catch(err => console.log('findFriends caught error', err))
    },
    addFriend: (req, res) => {
        console.log(req.user)
        User.findOneAndUpdate({ username: req.user.username }, { $push: { 'contacts': req.body.user, 'added': req.body.user }, $set: { 'createdAt': new Date() } }, { new: true })
            .then(updated => {
                res.json(updated)
                User.findOneAndUpdate({ _id: req.body.user }, { $push: { 'notifications': req.body.id }, $set: { 'createdAt': new Date() } })
                    .then(res => console.log(res))
                    .catch(err => console.log('addFriend caught err 1', err))
            })
            .catch(err => console.log('addFriend caught err 2', err))
    },
    addFriendOnProfile: (req, res) => {
        User.findOneAndUpdate({ username: req.params.user }, { $push: { 'contacts': req.body.user, 'added': req.body.user }, $set: { 'createdAt': new Date() } }, { new: true })
            .then(updated => {
                res.json(updated)
                User.findOneAndUpdate({ _id: req.params.contact }, { $push: { 'notifications': req.body.id }, $set: { 'createdAt': new Date() } })
                    .then(res => console.log(res))
                    .catch(err => console.log('addFriendOnProfile caught an error', err))
            })
    },
    acceptRequest: (req, res) => {
        console.log('req params accept', req.params)
        User.findByIdAndUpdate(req.user._id, { $push: { "contacts": req.params.contact, 'added': req.params.contact }, $pull: { 'notifications': req.params.contact } }, { new: true })
            .then(newFriend => {
                console.log('accept request success', newFriend)
                User.findById(req.user._id)
                    .populate(['notifications', 'payments', 'requests', 'added'])
                    .exec()
                    .then(foundUser => {
                        // console.log('nate found user', foundUser)
                        res.json({ activity: foundUser, newFriend })
                    })
                    .catch(err => console.log('nate error', err))

            })
            .catch(err => console.log('accept request err', err))
    },
    denyRequest: (req, res) => {
        User.findByIdAndUpdate(req.user._id, { $pull: { 'notifications': req.body.request } }, { new: true })
            .then(removed => {
                User.findByIdAndUpdate(req.body.request, { $pull: { 'contacts': req.user._id, 'added': req.user._id } }, { new: true })
                    .then(denied => {
                        // console.log('sesson id', req.user)
                        User.findOne({ _id: req.user._id })
                            .populate(['notifications', 'added', 'payments', 'requests'])
                            .exec()
                            .then(foundUser => {
                                // console.log('nate found user', foundUser)
                                res.json({ activity: foundUser, removed, denied })
                            })
                            .catch(err => console.log('nate error', err))
                    })
                    .catch(err => console.log('denied req err line 124', err))
                console.log('deny request success', removed)
                // res.json(removed)
            })
            .catch(err => console.log('deny request err', err))
    },
    getUserInfo: (req, res) => {
        console.log('getuserinfo ', req.user)
        User.findOne({ username: req.user.username })
            .then(found => res.json(found))
            .catch(err => console.log("getUserinfo caught error", err))
    },
    getContacts: (req, res) => {
        User.findOne({ _id: req.params._id }) // find the user who you need the ocntact of k by the id
            .populate('contacts') // populate the contacts field with the full documents
            // additional chained query methods here
            .exec((err, found) => {
                if (err) console.log('getContacts caught error', err)
                else res.json(found)
            }) // execute
    },
    addPhoto: (req, res) => {
        User.findOneAndUpdate({ _id: req.params.id }, { $set: { profilePic: req.body.picture } })
            .then(res => console.log(res))
            .catch(err => console.log('addPhoto caught err', err))
    },
    editBio: (req, res) => {
        User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            .then(updated => {
                console.log(req.body)
                res.json(updated)
            })
            .catch(err => console.log('editBio caught error', err))
    },
    editNumber: (req, res) => {
        User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            .then(updated => {
                console.log(req.body)
                res.json(updated)
            })
            .catch(err => console.log('editNumber caught error', err))
    },
    editEmail: (req, res) => {
        User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            .then(updated => {
                res.json(updated)
            })
            .catch(err => console.log('editEmail caught error', err))
    },
    editName: (req, res) => {
        User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            .then(updated => {
                res.json(updated)
            })
            .catch(err => console.log('editAddress caught error', err))
    },
    getUpdatedInfo: (req, res) => {
        User.findById(req.params.id)
            .then(found => res.json(found))
            .catch(err => console.log("getUpdatedInfo caught err", err))
    },
    handleCancel: (req, res) => {
        User.findById(req.params.id)
            .then(found => {
                console.log('found', found)
                res.json(found)
            })
            .catch(err => console.log('handleCancel caught error', err))
    },
    uploadProfilePic: (req, res) => {
        User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            .then(found => {
                console.log('uploadProfilePic success', found)
                res.json(found)
            })
            .catch(err => console.log('uploadProfilePic caught error', err))
    },
    getRecentActivity: (req, res) => {
        User.findOne({ _id: req.params.id })
            .populate(['notifications', 'payments', 'added', 'requests'])
            .exec()
            .then(user => {
                res.json(user)
            })
    },
    isLoggedIn: (req, res) => {
        if (!req.user.username.length) {
            res.json({ error: 'please login' })
        }
        if (req.user) {
            User.findOne({ username: req.user.username })
                .then(user => {
                    if (req.user)
                        res.json({ user: user })
                    else
                        res.json({ error: 'please login' })
                })
                .catch(err => console.log('isLoggedIn caught err', err))
        }
    },
    logout: (req, res) => {
        req.logout(() => console.log('logged out'))
        console.log(req.user)
        res.sendStatus(200)
    },
    viewContact: (req, res) => {
        console.log('req params id', req.params.id)
        User.findOne({ _id: req.params.id })
            .then(contact =>
                res.json(contact)
                // console.log('contact', contact)
            )
            .catch(err => console.log('viewContact caught errr', err))
    },
    deleteContact: (req, res) => {
        User.findOneAndUpdate({ _id: req.params.user }, { $pull: { 'added': req.params.contact, 'contacts': req.params.contact, 'notifications': req.params.contact } }, { new: true })
            .then(deleted => {
                console.log('updated contacts ', deleted.contacts)
                User.findOneAndUpdate({ _id: req.params.contact }, { $pull: { 'added': req.params.user, 'contacts': req.params.user, 'notifications': req.params.user } })
                    .then(removed => {
                        console.log('updated deleted contact contacts list', deleted.contacts)
                        res.json({ deleted: deleted, removed: removed })
                    })
                    .catch(err => console.log('delete contact 1 caught err', err))
            })
            .catch(err => console.log('delete contact 2 caught err', err))
    },
    enablePush: (req, res) => {
        User.findOneAndUpdate({ username: req.user.username }, { $set: { pushNotifications: true } })
            .then(push => {
                console.log(push)
                res.json(push)
            })
            .catch(err => console.log('enable push caught an err'))
    },
    disablePush: (req, res) => {
        User.findOneAndUpdate({ username: req.user.username }, { $set: { pushNotifications: false } })
            .then(push => {
                console.log(push)
                res.json(push)
            })
            .catch(err => console.log('disable push caught an err'))
    },
    getPushSettings: (req, res) => {
        User.findOne({ username: req.user.username })
            .then(user => {
                console.log('user', user)
                res.json(user)
            })
            .catch(err => console.log('getPushSettings caught an err', err))
    },
    enableSecurityLock: (req, res) => {
        User.findOneAndUpdate({ username: req.user.username }, { $set: { securityLock: true } }, { new: true })
            .then(locked => {
                console.log('locked', locked)
                res.json(locked)
            })
            .catch(err => console.log('enableSecurityLock err', err))
    },
    disableSecurityLock: (req, res) => {
        User.findOneAndUpdate({ username: req.user.username }, { $set: { securityLock: false } }, { new: true })
            .then(locked => {
                console.log('locked', locked)
                res.json(locked)
            })
            .catch(err => console.log('disableSecurityLock err', err))
    },
    enableFindMe: (req, res) => {
        User.findOneAndUpdate({ username: req.user.username }, { $set: { findMe: true } }, { new: true })
            .then(enabled => {
                console.log('enabled', enabled)
                res.json(enabled)
            })
            .catch(err => console.log('enableFindMe err', err))
    },
    disableFindMe: (req, res) => {
        User.findOneAndUpdate({ username: req.user.username }, { $set: { findMe: false } }, { new: true })
            .then(disabled => {
                console.log('disabled', disabled)
                res.json(disabled)
            })
            .catch(err => console.log('disableFindMe err', err))
    },
    enableGetRequest: (req, res) => {
        User.findOneAndUpdate({ username: req.user.username }, { $set: { getRequests: true } }, { new: true })
            .then(enabled => {
                console.log('enabled', enabled)
                res.json(enabled)
            })
            .catch(err => console.log('enableGetRequest err', err))
    },
    disableGetRequest: (req, res) => {
        User.findOneAndUpdate({ username: req.user.username }, { $set: { getRequests: false } }, { new: true })
            .then(diabled => {
                console.log('diabled', diabled)
                res.json(diabled)
            })
            .catch(err => console.log('disableGetRequest err', err))
    },
    getPrivacySettings: (req, res) => {
        User.findOne({ username: req.user.username })
            .then(settings => {
                console.log('settings', settings)
                res.json(settings)
            })
            .catch(err => console.log('getPrivacySettings err', err))
    },
    handleSecurityPin: (req, res) => {
        console.log('req  ', req.body)
        User.findOneAndUpdate({ username: req.user.username }, { $set: { securityPin: req.body.securityPin } }, { new: true })
            .then(pin => {
                console.log('pin', pin)
                res.json(pin)
            })
            .catch(err => console.log('handleSecurityPin err', err))
    },
    getPin: (req, res) => {
        User.findOne({ username: req.user.username })
            .then(user => {
                console.log('getPin res', user)
                res.json(user)
            })
            .catch(err => console.log('getPin err', err))
    },
    getLimits: (req, res) => {
        User.findOne({ username: req.user.username })
            .then(user => {
                res.json(user)
            })
            .catch(err => console.log('getLimts err', err))
    },
    // addCash: (req, res) => {
    //     Bank.findOneAndUpdate({ _id: req.params.account }, { $inc: { 'balance': parseFloat(-req.params.amount) } }, { runValidators: true })
    //         .then(bank => {
    //             User.findByIdAndUpdate(req.params.user, { $inc: { 'wallet': parseFloat(req.params.amount).toFixed(2), 'addCashLimit': parseFloat(-req.params.amount) } }, { new: true, runValidators: true })
    //                 .then(user => {
    //                     res.json({ user: user, bank: bank })
    //                 })
    //                 .catch(err => res.json({ msg: 'addCash error', error: err }))
    //         })
    //         .catch(err => console.log('addCash err', err))
    // },
    // cashOut: (req, res) => {
    //     User.findByIdAndUpdate(req.params.user, { $inc: { 'wallet': parseFloat(-req.params.amount) }, 'cashOutLimit': parseFloat(-req.params.amount) }, { new: true, runValidators: true })
    //         .then(user => {
    //             Bank.findByIdAndUpdate(req.params.account, { $inc: { 'balance': parseFloat(req.params.amount).toFixed(2) } }, { new: true })
    //                 .then(bank => {
    //                     console.log('bank update ', bank)
    //                     console.log('user update ', user)
    //                     res.json({ bank: bank, user: user })
    //                 })
    //                 .catch(err => console.log('addCash user wallet update err', err))
    //         })
    //         .catch(err => res.json({ msg: 'cashOut err', error: err }))
    // },
    // getBalance: (req, res) => {
    //     User.findOne({ _id: req.user._id })
    //         .populate('accounts')
    //         .exec((err, account) => {
    //             if (err) console.log('get balance err', err)
    //             else {
    //                 User.findOne({ _id: req.user._id })
    //                     .then(user => res.json({ user: user, account: account.accounts }))
    //                     .catch(err => console.log('find user getBalance err', err))
    //                 // res.json(account.accounts)
    //             }
    //         })
    // },
    fetchContacts: (req, res) => {
        User.findOne({ _id: req.user._id }) // find the user who you need the ocntact of k by the id
            .populate('contacts') // populate the contacts field with the full documents
            // additional chained query methods here
            .exec((err, found) => {
                if (err) console.log('getContacts caught error', err)
                else {
                    res.json(found)
                }
            })
    },
    selectRecipient: (req, res) => {
        User.findById(req.params.id)
            .then(user => res.json(user))
            .catch(err => console.log('selectRecipient err', err))
    },
    selectUser: (req, res) => {
        User.findById(req.params.id)
            .populate(['accounts', 'payments', 'requests'])
            .exec()
            .then(user => res.json(user))
            .catch(err => console.log('selectUser err', err))
    },
    updatePayment: (req, res) => {
        //////update the senders payment array then subtract the payment from the senders wallet
        Bank.findOneAndUpdate({ userId: req.body.sender }, { $inc: { 'balance': parseFloat(-req.body.amount) } })
            .then(paymentOne => {
                User.findByIdAndUpdate(req.body.sender, { $push: { 'payments': req.body.transaction }, $inc: { 'sendLimit': parseFloat(-req.body.amount) } }, { new: true })
                    .then(success => {
                        // console.log('successful update ', success)
                        Bank.findOneAndUpdate({ userId: req.body.receiver }, { $inc: { 'balance': parseFloat(req.body.amount) } })
                            .then(paymentTwo => {
                                User.findByIdAndUpdate(req.body.receiver, { $push: { 'payments': req.body.transaction } })
                                    .then(final => {
                                        // console.log('final res', final)
                                        res.json({ final: final, success: success })
                                    })
                                    .catch(err => console.log('updatePayment Boolean err', err))
                            })
                            .catch(err => console.log('updatePayment receiver err ', err))
                        ///// update the receivers payments array then add the payment to the recievers wallet
                    })
                    .catch(err => console.log('updatePayment sender err', err))

            })
            .catch(err => console.log('updatePayment err 1', err))
    },
    newPayment: (req, res) => {
        Payment.create(req.body)
            .then(payment => {
                console.log('payment success', payment)
                res.json(payment)
            })
            .catch(err => console.log('newPayment creation err', err))
    },
    newRequest: (req, res) => {
        Request.create(req.body)
            .then(request => {
                console.log('request success', request)
                res.json(request)
            })
            .catch(err => console.log('newRequest creation err', err))
    },
    updateRequest: (req, res) => {
        User.findByIdAndUpdate(req.body.sender, { $push: { 'requests': req.body.request } }, { new: true })
            .then(success => {
                console.log('successful update ', success)
                ///// update the recievers payments array then add the payment to the recievers wallet
                User.findByIdAndUpdate(req.body.reciever, { $push: { 'requests': req.body.request } })
                    .then(final => {
                        console.log(`successful payment request from ${success.username}`, final)
                        res.json({ final: final, success: success })
                    })
                    .catch(err => console.log('updatePayment Boolean err', err))
            })
            .catch(err => console.log('newPayment findOne err 2'))
    },
    findRecipient: (req, res) => {
        User.find({ $or: [{ phonenumber: req.params.user }, { email: req.params.user }, { username: req.params.user }] })
            .then(recipient => {
                if (recipient.length) return res.json(recipient)
                else return res.json({ error: 'error user not found' })
            })
            .catch(err => console.log('findRecipient err', err))
    },
    getContactData: (req, res) => {
        console.log(req.params.id, 'id')
        User.findOne({ _id: req.params.id })
            .then(contact => { res.json(contact) })
            .catch(err => console.log('getContactData err', err))
    },
    getSupportFetch: (req, res) => {
        User.findOne({ _id: req.user._id })
            .then(user => res.json(user))
            .catch(err => console.log('getSupportFetch err', err))
    },
    addBankSignUp: (req, res) => {
        console.log('addBank req body', req.body)
        Bank.create(req.body)
            .then(bank => {
                User.findOneAndUpdate({ username: req.params.user }, { $push: { 'accounts': bank._id } })
                    .then(user => res.json({ bank: bank, user: user }))
                    .catch(err => console.log('addBank update user err', err))
            })
            .catch(err => console.log('addBank err', err))
    },
    addBank: (req, res) => {
        console.log('addBank req body', req.body)
        Bank.create(req.body)
            .then(bank => {
                User.findOneAndUpdate({ _id: req.user._id }, { $push: { 'accounts': bank._id } })
                    .then(user => res.json({ bank: bank, user: user }))
                    .catch(err => console.log('addBank update user err', err))
            })
            .catch(err => console.log('addBank err', err))
    },
    loginFetch: (req, res) => {
        User.findById(req.user._id)
            .then(user => res.json(user))
            .catch(err => console.log('loginFetch err ', err))
    },
    getUsers: (req, res) => {
        User.find()
            .then(users => res.json(users))
            .catch(err => console.log('getUsers err', err))
    },
    restrictUser: (req, res) => {
        User.findByIdAndUpdate(req.params.user, { $set: { restricted: true } }, { new: true })
            .then(user => res.json(user))
            .catch(err => console.log('restrictUser err', err))
    },
    unrestrictUser: (req, res) => {
        User.findByIdAndUpdate(req.params.user, { $set: { restricted: false } }, { new: true })
            .then(user => res.json(user))
            .catch(err => console.log('restrictUser err', err))
    },
    addFlag: (req, res) => {
        User.findByIdAndUpdate(req.params.user, { $set: { flagged: true } }, { new: true })
            .then(user => res.json(user))
            .catch(err => console.log('restrictUser err', err))
    },
    removeFlag: (req, res) => {
        User.findByIdAndUpdate(req.params.user, { $set: { flagged: false } }, { new: true })
            .then(user => res.json(user))
            .catch(err => console.log('restrictUser err', err))
    },
    getBankInfo: (req, res) => {
        User.findOne({ _id: req.user._id }, { _id: 0, password: 0, securityPin: 0 })
            .populate('accounts')
            .exec((err, found) => {
                if (err) console.log('getContacts caught error', err)
                else {
                    res.json(found)
                }
            })
    }
}

/// now where ever this create API request ius actually being sent from - just make sure its a POST, and pass it the data so it sends/transfers the info through t he req.body - on the axios side.  follow?
//yeah i see what you mean i just didnt know cause i kept getting errors so idk if the path is right or what on the front end do i always use 8080 in the axios call?

// if thats what ur backend is running on- so it looks like in this case yess.