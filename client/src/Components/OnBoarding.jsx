import { useStateContext } from '../Provider/contextProvider'
import NotTaken from '../Logo/nottaken.png'
import Taken from '../Logo/usertaken.png'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'


export default function OnBoarding() {


    const { context, setContext } = useStateContext()

    const [line, setLines] = useState({
        usernameLine: false,
        passwordLine: false,
        selectUsernameLine: false,
        enterpassLine: false,
        repeatPassLine: false,
    })
    const [info, setInfo] = useState({
        bankName: '',
        cardHolder: '',
        dcn: '',
        cvv: '',
        exp: '',
        zip: '',
        routing: '',
        account: '',
    })
    const nav = useNavigate()

    const verifySignIn = () => {
        return axios({
            method: "POST",
            url: `http://localhost:8080/signin/`,
            withCredentials: true,
            data: { username: context.payTag, password: context.password }
        })

            .then(res => {
                if (res.data.error) {
                    setContext(prev => ({
                        ...prev,
                        usernotFound: true
                    }))
                    return null;
                } else {
                    setContext(prev => ({
                        ...prev,
                        signedIn: true,
                        authenticate: false,
                        session: res.data.user._id
                    }))
                    return res.data.user
                }
            })
            .catch(err => console.error('verifySignin error', err))
    }
    const signIn = async () => {

        let validUser = await verifySignIn();

        if (validUser) {
            // do success login
            nav(`/profile/${validUser._id}`)
        } else {
            //do errors on login
            console.error("invalid attempt made")
        }

    }


    const handleRegistered = (e) => {
        if (context.password === context.verifyPassord) {


            axios({
                method: "POST",
                url: 'http://localhost:8080/register',
                data: {
                    username: context.payTag,
                    password: context.password,
                    fullname: info.cardHolder,
                    phonenumber: context.phone,
                    email: context.email ? context.email : context.shipemail,
                    contacts: [],
                    bio: '',
                    joined: new Date().toDateString(),
                    cardbalance: 0,
                    // wallet: 0,
                    // profilePic: {},
                    pushNotifications: false,
                    securityLock: false,
                    findMe: false,
                    getRequests: false,
                    // businessAccount: false,
                    // sendLimit: 2500,
                    // recieveLimit: "Unlimited",
                    // addCashLimit: 2500,
                    // cashOutLimit: 25000,
                    sentAt: new Date(),
                    restricted: false,
                    permissions: { addUser: false, deleteUser: false, restrictUser: false, flagUser: false },
                    admin: false,
                    flagged: false,
                }
            })
                .then(res => {
                    console.log('created res', res)
                    axios.post(`http://localhost:8080/addBankSignUp/${res.data.username}`, {
                        userId: res.data._id,
                        bankName: info.bankName,
                        cardHolder: info.cardHolder,
                        bankCardNumber: info.dcn,
                        cvv: info.cvv,
                        exp: info.exp,
                        zip: info.zip,
                        accountNumber: info.account,
                        routingNumber: info.routing,
                        balance: Math.floor(Math.random() * 3000)
                    })
                        .then(bank => {
                            console.log('addBank success res', bank)
                            setContext(prev => ({
                                ...prev,
                                signedUp: true,
                                authenticate: true,
                                passwordHeader: false,
                                usernamePicked: false,
                                cardHeader: false,
                                phone: res.data.phonenumber,
                                email: res.data.email,
                                payTag: res.data.username,
                                fullname: info.cardHolder,
                                address: res.data.address,
                                passwordsDontMatch: false,
                                pushAlerts: false,
                                // profilePic: res.data.profilePic,

                            }))
                        })
                        .catch(err => console.log('addBank err ', err))

                })
                .catch(err => console.error('handleRegistred error', err))
        } else {
            setContext(prev => ({
                ...prev,
                passwordsDontMatch: true
            }))
        }
    }
    const handleUserName = (e) => {
        let user = e.target.value
        axios({
            method: "GET",
            url: `http://localhost:8080/get/${user}`,

        })
            .then(res => {
                if (res.data.error) {
                    setContext(prev => ({
                        ...prev,
                        usernameTaken: true
                    }))
                }
                else {
                    setContext(prev => ({
                        ...prev,
                        usernameTaken: false,
                        payTag: user
                    }))
                }
            })
            .catch(err => console.error('handleUsername error', err))
    }
    const handleUserPicked = (e) => {
        setContext(prev => ({ ...prev, usernamePicked: true, userHeader: false, passwordHeader: true }))
    }
    const handlePassword = (e) =>
        setContext(prev => ({ ...prev, password: e.target.value }))
    const handleVerifyPassword = (e) => {

        setContext(prev => ({ ...prev, verifyPassord: e.target.value }))
        if (e.target.value === context.password) {
            setContext(prev => ({ ...prev, matched: true, passwordsDontMatch: false }))
        }
        // else {
        //     setContext(prev => ({ ...prev, matched: false, passwordsDontMatch: true }))
        // }
    }
    const handlePasswordSignIn = (e) =>
        setContext(prev => ({ ...prev, password: e.target.value }))
    const handleUsernameSignIn = (e) =>
        setContext(prev => ({ ...prev, payTag: e.target.value }))
    const toggleLines = (e) => {
        if (e.target.name === 'bank') setLines(prev => ({ ...prev, bankNameLine: true }))
        if (e.target.name === 'name') setLines(prev => ({ ...prev, cardholderLine: true }))
        if (e.target.name === 'dcn') setLines(prev => ({ ...prev, dcnLine: true }))
        if (e.target.name === 'cvv') setLines(prev => ({ ...prev, cvvLine: true }))
        if (e.target.name === 'exp') setLines(prev => ({ ...prev, expLine: true }))
        if (e.target.name === 'zip') setLines(prev => ({ ...prev, zipLine: true }))
        if (e.target.name === 'accountnum') setLines(prev => ({ ...prev, accountLine: true }))
        if (e.target.name === 'routingnum') setLines(prev => ({ ...prev, routingLine: true }))
        if (e.target.name === 'enterpassword') setLines(prev => ({ ...prev, enterpassLine: true }))
        if (e.target.name === 'repeatpassword') setLines(prev => ({ ...prev, repeatPassLine: true }))
        if (e.target.name === 'username') {
            setLines(prev => ({ ...prev, usernameLine: true }))
            e.target.value = '@'
        }
        if (e.target.name === 'password') setLines(prev => ({ ...prev, passwordLine: true }))
        if (e.target.name === 'select') {
            setLines(prev => ({ ...prev, selectUsernameLine: true }))
            e.target.value = '@'
        }

    }
    const untoggleLines = (e) => {
        if (e.target.name === 'bank') setLines(prev => ({ ...prev, bankNameLine: false }))
        if (e.target.name === 'name') setLines(prev => ({ ...prev, cardholderLine: false }))
        if (e.target.name === 'dcn') setLines(prev => ({ ...prev, dcnLine: false }))
        if (e.target.name === 'cvv') setLines(prev => ({ ...prev, cvvLine: false }))
        if (e.target.name === 'exp') setLines(prev => ({ ...prev, expLine: false }))
        if (e.target.name === 'zip') setLines(prev => ({ ...prev, zipLine: false }))
        if (e.target.name === 'accountnum') setLines(prev => ({ ...prev, accountLine: false }))
        if (e.target.name === 'routingnum') setLines(prev => ({ ...prev, routingLine: false }))
        if (e.target.name === 'enterpassword') setLines(prev => ({ ...prev, enterpassLine: false }))
        if (e.target.name === 'repeatpassword') setLines(prev => ({ ...prev, repeatPassLine: false }))
        if (e.target.name === 'username') setLines(prev => ({ ...prev, usernameLine: false }))
        if (e.target.name === 'password') setLines(prev => ({ ...prev, passwordLine: false }))
        if (e.target.name === 'select') setLines(prev => ({ ...prev, selectUsernameLine: false }))
    }
    const handleBankName = (e) => {
        setInfo(prev => ({
            ...prev,
            bankName: e.target.value
        }))
    }
    const handleCardHolder = (e) => {
        setInfo(prev => ({
            ...prev,
            cardHolder: e.target.value
        }))
    }
    const handleDcn = (e) => {
        setInfo(prev => ({
            ...prev,
            dcn: e.target.value
        }))
    }
    const handleCvv = (e) => {
        setInfo(prev => ({
            ...prev,
            cvv: e.target.value
        }))
    }
    const handleExp = (e) => {
        setInfo(prev => ({
            ...prev,
            exp: e.target.value
        }))
    }
    const handleZip = (e) => {
        setInfo(prev => ({
            ...prev,
            zip: e.target.value
        }))
    }
    const handleAccount = (e) => {
        setInfo(prev => ({
            ...prev,
            account: e.target.value
        }))
    }
    const handleRouting = (e) => {
        setInfo(prev => ({
            ...prev,
            routing: e.target.value
        }))
    }
    const handleBankInfo = (e) => {
        setContext(prev => ({
            ...prev,
            userHeader: true,
            addBank: false,

        }))
    }
    return (<>
        {console.log(context)}

        {context.addBank ? <>
            <div className="addBank" style={{ justifyContent: 'center', display: 'flex', width: '100%', overflowX: 'hidden', flexDirection: 'column' }} >
                <label htmlFor="number" style={{ color: line.bankNameLine ? 'royalblue' : 'black', textAlign: 'left' }}>Institutions Name</label>

                <div className="signInContainers">
                    <input type="text" name="bank" id="bank" placeholder='e.g Wells Fargo' onChange={(e) => handleBankName(e)} required maxLength='19' onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                    <div className="underline" style={{ width: line.bankNameLine ? '100%' : '0' }}></div>

                </div>
                {/* <p style={{ display: context.invalidCard ? "block" : 'none', margin: '5px', color: 'red' }}>Invalid Card Number</p> */}
                <label htmlFor="name" style={{ color: line.cardholderLine ? 'royalblue' : 'black', textAlign: 'left' }}>Cardholder Name</label>

                <div className="signInContainers">
                    <input type="text" name="name" id="name" placeholder='John Doe' onChange={(e) => handleCardHolder(e)} maxLength='30' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                    <div className="underline" style={{ width: line.cardholderLine ? '100%' : '0' }}></div>
                </div>

                {/* <p style={{ display: context.invalidName ? "block" : 'none', margin: '5px', color: 'red' }}>Invalid Cardholder Name</p> */}
                <label htmlFor="dcn" style={{ color: line.dcnLine ? 'royalblue' : 'black', textAlign: 'left' }}>Debit Card Number</label>

                <div className="signInContainers">
                    <input type="text" name="dcn" id="dcn" placeholder='1234-5678-9101-1123' onChange={(e) => handleDcn(e)} required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                    <div className="underline" style={{ width: line.dcnLine ? '100%' : '0' }}></div>
                </div>

                {/* <p style={{ display: context.invalidExp ? "block" : 'none', margin: '5px', color: 'red' }}>Invalid Card Exp</p> */}
                <label htmlFor="cvv" style={{ color: line.cvvLine ? 'royalblue' : 'black', textAlign: 'left' }}>CVV</label>

                <div className="signInContainers">
                    <input type="text" name="cvv" id="cvv" placeholder='123' onChange={(e) => handleCvv(e)} maxLength='3' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                    <div className="underline" style={{ width: line.cvvLine ? '100%' : '0' }}></div>
                </div>

                <p style={{ display: context.invalidCvv ? "block" : 'none', margin: '5px', color: 'red' }}>Invalid Card Cvv</p>
                <label htmlFor="zip" style={{ color: line.expLine ? 'royalblue' : 'black', textAlign: 'left' }}>EXP</label>

                <div className="signInContainers">
                    <input type="text" name="exp" id="exp" placeholder='08/24' onChange={(e) => handleExp(e)} maxLength='5' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                    <div className="underline" style={{ width: line.expLine ? '100%' : '0' }}></div>
                </div>
                <label htmlFor="zip" style={{ color: line.zipLine ? 'royalblue' : 'black', textAlign: 'left' }}>Postal Code</label>

                <div className="signInContainers">
                    <input type="text" name="zip" id="zip" placeholder='85712' onChange={(e) => handleZip(e)} maxLength='5' pattern='[0-9]{5}' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                    <div className="underline" style={{ width: line.zipLine ? '100%' : '0' }}></div>
                </div>
                <label htmlFor="accountnum" style={{ color: line.accountLine ? 'royalblue' : 'black', textAlign: 'left' }}>Account Number</label>

                <div className="signInContainers">
                    <input type="text" name="accountnum" id="accountnum" placeholder='1512025885' onChange={(e) => handleAccount(e)} maxLength='12' pattern='[0-9]{12}' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                    <div className="underline" style={{ width: line.accountLine ? '100%' : '0' }}></div>
                </div>
                <label htmlFor="routingnum" style={{ color: line.routingLine ? 'royalblue' : 'black', textAlign: 'left' }}>Routing Number</label>

                <div className="signInContainers">
                    <input type="text" name="routingnum" id="routingnum" placeholder='1512025885' onChange={(e) => handleRouting(e)} maxLength='9' pattern='[0-9]{9}' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                    <div className="underline" style={{ width: line.routingLine ? '100%' : '0' }}></div>
                </div>
                <p style={{ display: context.invalidZip ? "block" : 'none', margin: '5px', color: 'red' }}>Invalid Card Postal Code</p>
                <div className="opt" style={{ display: 'flex', justifyContent: 'center' }}>
                    {/* <button className='next' onClick={() => handleCancel()}>Cancel</button> */}
                    <button className='next' onClick={(e) => handleBankInfo(e)}>Next</button>
                </div>
            </div>
        </>
            : context.usernamePicked ? (
                <div className="addPassword">

                    <div className="signInContainers">
                        <input type="password" onChange={(e) => handlePassword(e)} style={{ display: context.authenticate ? 'none' : 'block', paddingInlineStart: '10px' }} placeholder='Password' value={context.password} name='enterpassword' onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                        <div className="underline" style={{ width: line.enterpassLine ? "100%" : '0' }}></div>

                    </div>
                    {/* <p>Please Enter Your Password Again</p> */}
                    <div className="signInContainers">
                        <input type="password" onChange={(e) => handleVerifyPassword(e)} placeholder='Repeat Password' style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', paddingInlineStart: '10px' }} name='repeatpassword' onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                        <div className="underline" style={{ width: line.repeatPassLine ? "100%" : '0' }}></div>
                    </div>
                    <button className='next' onClick={(e) => handleRegistered(e)}>Next</button>
                </div>
            )
                : context.authenticate ? (
                    <div className="signIn">
                        <label htmlFor="username" style={{ color: line.usernameLine ? "royalblue" : 'black', padding: '0 0 0 10px' }}> Username </label>

                        <div className="signInContainers">
                            <input type="text" onChange={(e) => handleUsernameSignIn(e)} placeholder='Username' name='username' onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} value={context.payTag} style={{ paddingInlineStart: '10px' }} />
                            <div className="underline" style={{ width: line.usernameLine ? "100%" : '0' }}></div>
                        </div>

                        <p style={{ display: context.usernotFound ? 'block' : 'none', color: 'red' }}>Wrong username or password please try again</p>
                        <label htmlFor="password" style={{ color: line.passwordLine ? "royalblue" : 'black', padding: '0 0 0 10px' }}> Password</label>

                        <div className="signInContainers">
                            <input type="password" onChange={(e) => handlePasswordSignIn(e)} placeholder='Password' name='password' onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} style={{ paddingInlineStart: '10px' }} />
                            <div className="underline" style={{ width: line.passwordLine ? "100%" : '0' }}></div>
                        </div>

                        <button className='next' onClick={() => signIn()}>Sign In</button>
                        {console.log('context', context)}
                    </div>
                )
                    :
                    (
                        <div className="selectUserName">

                            <div className="signInContainers">
                                <input type="text" onChange={(e) => handleUserName(e)} placeholder='PayTag' style={{ backgroundImage: context.usernameTaken ? `url(${Taken})` : `url(${NotTaken})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', width: '90%', padding: '10px' }} name='select' onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                                <div className="underline" style={{ width: line.selectUsernameLine ? '100%' : '0', opacity: line.selectUsernameLine ? '1' : '0' }}></div>
                            </div>

                            <p style={{ display: context.usernameTaken ? "block" : 'none', margin: '5px', color: 'red' }}>@Paytag already in use please enter a unique username</p>
                            <button onClick={(e) => handleUserPicked(e)} className='next'>Next</button>
                        </div>
                    )

        }
    </>
    )
}