const Controller = require('../controller/payMeController')


module.exports = app => {
    app.get('/get/:user', Controller.search)
    app.post('/register', Controller.create)
    app.post('/signin', Controller.signIn)
    app.get('/user/auth', Controller.auth)
    app.get('/find/:input', Controller.findFriends)
    app.put('/add/:user', Controller.addFriend)
    app.put('/addFriend/:user/:contact', Controller.addFriendOnProfile)
    app.get('/user/:info', Controller.getUserInfo)
    app.get('/search', Controller.getUserInfo)
    app.get("/user/contact/:_id", Controller.getContacts)
    app.put('/bio/:id', Controller.editBio)
    app.put('/phone/:id', Controller.editNumber)
    app.put('/email/:id', Controller.editEmail)
    app.put('/name/:id', Controller.editName)
    app.get('/update/:id', Controller.getUpdatedInfo)
    app.get('/cancel/:id', Controller.handleCancel)
    app.put('/updatePic/:id', Controller.uploadProfilePic)
    app.get('/recent/:id', Controller.getRecentActivity)
    app.get('/refresh', Controller.isLoggedIn)
    app.put('/logout', Controller.logout)
    app.get('/fetchContactProfile/:id', Controller.viewContact)
    app.get('/phoneOrEmail/:input', Controller.emailOrPhone)
    app.put('/deleteContact/:user/:contact', Controller.deleteContact)
    app.put('/enablePush', Controller.enablePush)
    app.put('/disablePush', Controller.disablePush)
    app.get('/getPushSettings', Controller.getPushSettings)
    app.get('/securitySettings', Controller.getPrivacySettings)
    app.put('/enableSecurityLock', Controller.enableSecurityLock)
    app.put('/disableSecurityLock', Controller.disableSecurityLock)
    app.put('/enableFindMe', Controller.enableFindMe)
    app.put('/disableFindMe', Controller.disableFindMe)
    app.put('/enableGetRequest', Controller.enableGetRequest)
    app.put('/disableGetRequest', Controller.disableGetRequest)
    app.put('/updatePin', Controller.handleSecurityPin)
    app.get('/getPin', Controller.getPin)
    app.get('/limits', Controller.getLimits)
    app.put('/accept/:contact', Controller.acceptRequest)
    app.put('/deny/:request', Controller.denyRequest)
    // app.put('/addCash/:amount/:user/:account', Controller.addCash)
    // app.get('/getBalance', Controller.getBalance)
    // app.put('/cashOut/:user/:amount/:account', Controller.cashOut)
    app.get('/contactsFetch', Controller.fetchContacts)
    app.get('/selectRecipient/:id', Controller.selectRecipient)
    app.get('/selectUser/:id', Controller.selectUser)
    app.post('/newPayment', Controller.newPayment)
    app.post('/newRequest', Controller.newRequest)
    app.put('/updatePayment', Controller.updatePayment)
    app.put('/updateRequest', Controller.updateRequest)
    app.get('/findRecipient/:user', Controller.findRecipient)
    app.get('/getContactOne/:id', Controller.getContactData)
    app.get('/getContactTwo/:id', Controller.getContactData)
    app.get('/supportFetch', Controller.getSupportFetch)
    app.post('/addBank', Controller.addBank)
    app.post('/addBankSignUp/:user', Controller.addBankSignUp)
    app.get('/loggedIn', Controller.loginFetch)
    app.get('/getUsers', Controller.getUsers)
    app.put('/restrictUser/:user', Controller.restrictUser)
    app.put('/unrestrictUser/:user', Controller.unrestrictUser)
    app.put('/addFlag/:user', Controller.addFlag)
    app.put('/removeFlag/:user', Controller.removeFlag)
    app.get('/getPin', Controller.getPin)
    app.get('/getbankinfo', Controller.getBankInfo)
}