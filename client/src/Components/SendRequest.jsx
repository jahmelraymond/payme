
import { useStateContext } from '../Provider/contextProvider'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { GiPayMoney } from 'react-icons/gi'
import { GiReceiveMoney } from 'react-icons/gi'


export default function SendReq() {
    const [isLoading, setIsLoading] = useState(true)
    const { context, setContext } = useStateContext()
    const handleSelectContact = () => {

    }
    useEffect(() => {
        axios.get(`http://localhost:8080/contactsFetch`, { withCredentials: true })
            .then(friends => {
                console.log('friends res', friends)
                if (context.recipient) {
                    setContext(prev => ({
                        ...prev,
                        contacts: friends.data.contacts,
                        fetching: false,
                        pin: friends.data.securityPin ? true : false
                    }))
                    setRecipient(context.recipient)
                } else {
                    setContext(prev => ({
                        ...prev,
                        contacts: friends.data.contacts,
                        fetching: false,
                        pin: friends.data.securityPin ? true : false

                    }))

                }
            })
            .finally(() => setIsLoading(false))
            .catch(err => console.log('get contacts fetch err', err))
    }, [])

    const [recipient, setRecipient] = useState(null)
    const [success, setSuccess] = useState(null)
    const [user, setUser] = useState('')
    const [confirm, setConfirm] = useState(false)
    const [note, setNote] = useState('')
    const [pin, setPin] = useState('')
    const [state, setState] = useState({
        pinLine: false
    })
    const handleNotes = (e) => {
        let note = e.target.value
        setNote(note)

    }
    const handleCancel = () => {
        setContext(prev => ({
            ...prev,
            requesting: false,
            sending: false,
            input: '',
            transaction: false,
            recipient: null,
            enterPin: false
        }))
    }
    const handleSelectRecipient = (e) => {
        let id = e.target.id
        axios.get(`http://localhost:8080/selectRecipient/${id}`)
            .then(user => {
                // console.log('user data', user)
                setRecipient(user.data)
            })
            .catch(err => console.log('handleSelectRecipient err', err))
    }
    const handlePayment = () => {
        if (context.pin) {
            setContext(prev => ({
                ...prev,
                fetching: true
            }))
            axios.get('http://localhost:8080/getPin', { withCredentials: true })
                .then(pinNum => {
                    if (pinNum.data.securityPin === parseInt(pin)) {
                        axios.post('http://localhost:8080/newPayment', { userId: context.session, receiverId: recipient._id, amount: parseFloat(context.input).toFixed(2), sent: true, recieved: false, createdAt: new Date(), sendersName: context.payTag, receiversName: recipient.username, profilePic: recipient.profilePic, sendersProfilePic: context.profilePic, note: note, paymentBool: true })
                            .then(payment => {
                                axios.put('http://localhost:8080/updatePayment', { sender: context.session, receiver: recipient._id, transaction: payment.data._id, amount: parseFloat(context.input).toFixed(2) })
                                    .then(success => {
                                        console.log('successful update', success)
                                        setContext(prev => ({
                                            ...prev,
                                            transaction: false,
                                            sending: false,
                                            fetching: true,
                                            recent: true,
                                            input: '',
                                            enterPin: false,
                                            incorrectPin: false
                                        }))
                                    })
                                    .catch(err => console.log('updatePayment err ', err))

                            })
                            .catch(err => console.log('handlePayment err', err))
                    }
                    else {
                        setContext(prev => ({
                            ...prev,
                            incorrectPin: true
                        }))
                    }
                })
                .catch(err => console.log('getPin err', err))
            console.log('handlePayment fired')
        }
        if (context.pin && context.requesting) {

            setConfirm(false)
            // if (parseFloat(context.accountBalance) - parseFloat(context.input) > 0)


            axios.post('http://localhost:8080/newRequest', { userId: context.session, receiverId: recipient._id, amount: parseFloat(context.input).toFixed(2), sent: true, received: false, createdAt: new Date(), sendersName: context.payTag, receiversName: recipient.username, profilePic: recipient.profilePic, sendersProfilePic: context.profilePic, note: note, requestBool: true })
                .then(request => {
                    axios.put('http://localhost:8080/updateRequest', { sender: context.session, receiver: recipient._id, request: request.data._id, amount: parseFloat(context.input).toFixed(2) })
                        .then(success => {
                            console.log('successful update', success)
                            setConfirm(false)
                            setContext(prev => ({
                                ...prev,
                                transaction: false,
                                requesting: false,
                                recent: true,
                                fetching: true,
                                input: '',
                                enterPin: false
                            }))

                        })
                        .catch(err => console.log('updatePayment err ', err))

                })
                .catch(err => console.log('handlePayment err', err))

            console.log('pin and requesting condition')
        } else if (!context.pin) {
            if (context.sending) {

                axios.post('http://localhost:8080/newPayment', { userId: context.session, receiverId: recipient._id, amount: parseFloat(context.input).toFixed(2), sent: true, recieved: false, createdAt: new Date(), sendersName: context.payTag, receiversName: recipient.username, profilePic: recipient.profilePic, sendersProfilePic: context.profilePic, note: note, paymentBool: true })
                    .then(payment => {
                        axios.put('http://localhost:8080/updatePayment', { sender: context.session, receiver: recipient._id, transaction: payment.data._id, amount: parseFloat(context.input).toFixed(2) })
                            .then(success => {
                                console.log('successful update', success)
                                setConfirm(false)
                                setContext(prev => ({
                                    ...prev,
                                    transaction: false,
                                    sending: false,
                                    fetching: true,
                                    recent: true,
                                    input: '',
                                    enterPin: false
                                }))
                            })
                            .catch(err => console.log('updatePayment err ', err))

                    })
                    .catch(err => console.log('handlePayment err', err))
            }
            else if (context.requesting) {
                setConfirm(false)
                // if (parseFloat(context.accountBalance) - parseFloat(context.input) > 0)


                axios.post('http://localhost:8080/newRequest', { userId: context.session, receiverId: recipient._id, amount: parseFloat(context.input).toFixed(2), sent: true, received: false, createdAt: new Date(), sendersName: context.payTag, receiversName: recipient.username, profilePic: recipient.profilePic, sendersProfilePic: context.profilePic, note: note, requestBool: true })
                    .then(request => {
                        axios.put('http://localhost:8080/updateRequest', { sender: context.session, receiver: recipient._id, request: request.data._id, amount: parseFloat(context.input).toFixed(2) })
                            .then(success => {
                                console.log('successful update', success)
                                setConfirm(false)
                                setContext(prev => ({
                                    ...prev,
                                    transaction: false,
                                    requesting: false,
                                    recent: true,
                                    fetching: true,
                                    input: '',
                                    enterPin: false
                                }))

                            })
                            .catch(err => console.log('updatePayment err ', err))

                    })
                    .catch(err => console.log('handlePayment err', err))
            }
        }
    }
    const handleFindRecipient = (e) => {
        let user = e.target.value
        setUser(user)
        axios.get(`http://localhost:8080/findRecipient/${user}`)
            .then(user => {
                if (user.data.error) return
                else {
                    console.log('user found', user)
                    setRecipient(user.data[0])
                }
            }
            )
            .catch(err => console.log('handleFindRecipient err', err))
    }

    const removeRecipient = () => {
        setRecipient(null)
        setUser('')
    }
    const toggleConfirmModal = () => {
        if (recipient)
            setConfirm(true)
    }
    const toggleKeyPad = () => {
        setContext(prev => ({
            ...prev,
            recent: false,
            search: false,
            userProfile: false,
            settings: false,
            viewProfile: false,
            wallet: false,
            transaction: false,
            requesting: false,
            sending: false,
        }))
    }
    const togglePinPad = () => {
        if (context.pin && !context.requesting) {
            setContext(prev => ({
                ...prev,
                enterPin: true
            }))
            setConfirm(false)
        }
        else {
            handlePayment()
        }
    }
    const handlePin = (e) => {
        setPin(e.target.value)
        setContext(prev => ({
            ...prev,
            incorrectPin: false
        }))
    }
    const toggleLine = (e) => {
        if (e.target.name === 'pin')
            setState(prev => ({
                ...prev,
                pinLine: true
            }))

    }
    const unToggleLine = (e) => {
        if (e.target.name === 'pin')
            setState(prev => ({
                ...prev,
                pinLine: false
            }))

    }
    return (

        <>
            {console.log('pin', pin)}
            <div className="addPin" style={{ display: context.enterPin ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%', position: 'absolute', backgroundColor: 'white', zIndex: '2', height: '100%' }}>
                <h3>Please Enter A Security Pin</h3>
                <div className="signInContainers">
                    <label htmlFor="pin" style={{ color: state.pinLine ? 'royalblue' : 'black', alignSelf: 'flex-start', padding: '0 0 0 5px' }}>Enter Pin</label>
                    <input type="password" onChange={(e) => handlePin(e)} name='pin' onFocus={(e) => toggleLine(e)} onBlur={(e) => unToggleLine(e)} style={{ padding: '15px 0 15px 10px', borderRadius: '10px', width: '100%', textAlign: 'left' }} maxLength="4" placeholder='Enter Pin' />
                    <div className="underline" style={{ width: state.pinLine ? '100%' : '0' }}></div>
                </div>
                <p style={{ color: 'red', display: context.incorrectPin ? 'flex' : 'none' }}>Incorrect Pin Please Enter Pin Associated With This Account</p>
                <div className="container" style={{ display: 'flex', width: '100%' }}>
                    <button onClick={(e) => handleCancel(e)} style={{ margin: '10px 0 0 0 ', padding: '10px', backgroundColor: 'royalblue', color: 'white', fontSize: '20px', border: 'none', borderRadius: '10px', flex: '1' }}>Cancel</button>
                    <button onClick={() => handlePayment()} style={{ margin: '10px 0 0 0 ', padding: '10px', backgroundColor: 'royalblue', color: 'white', fontSize: '20px', border: 'none', borderRadius: '10px', flex: '1' }}>Submit</button>

                </div>
            </div>
            <div className="confirmAction" style={{ display: confirm && recipient ? 'flex' : 'none', borderRadius: '10px', border: 'solid 0.5px royalblue', flexDirection: 'column', backgroundColor: 'gainsboro', zIndex: '3' }}>
                <div className="text" style={{ display: 'flex', padding: '5px', borderBottom: 'solid 0.5px royalblue' }}>
                    {
                        context.sending && recipient ?
                            <p style={{ fontSize: '18px' }}>{context.input.includes('.') ? `Are you sure you want to send ${recipient ? recipient.username : null} $${context.input}` : `Are you sure you want to send ${recipient ? recipient.username : null} $${context.input}.00`}</p> :
                            <p style={{ fontSize: '18px' }}>{
                                context.input.includes('.') ? `Are you sure you want to request $${context.input} from ${recipient ? recipient.username : null}` : `Are you sure you want to request $${context.input}.00 from ${recipient ? recipient.username : null}`} </p>
                    }
                </div>
                <div className="buttons" style={{ display: 'flex', justifyContent: 'center' }}>

                    <button style={{ border: 'none', color: 'royalblue', width: '100%', fontSize: '24px', borderRadius: ' 0 0 0 10px', backgroundColor: 'transparent' }} onClick={() => handleCancel()}>Cancel</button>

                    <button style={{ border: 'none', color: 'royalblue', width: '100%', backgroundColor: 'transparent', fontSize: '24px', borderLeft: 'solid 0.5px royalblue', borderRadius: '0 0 10px 0' }} onClick={context.requesting ? () => handlePayment() : () => togglePinPad()}>Yes</button>

                </div>
            </div>
            {
                context.fetching ? <div className='loader'></div> : <>

                    < p style={{ color: 'royalblue', fontSize: '18px', cursor: 'pointer', margin: '10px 0  0 0', position: 'absolute', left: '10px' }} onClick={() => handleCancel()}>Cancel</p>


                    <p style={{ fontSize: '20px', cursor: 'pointer', margin: '8px 0 0 0', position: 'absolute', right: '10px', borderRadius: '10px', backgroundColor: 'royalblue', color: 'white', padding: '5px 15px', fontWeight: '350' }} onClick={() => toggleConfirmModal()}>{context.requesting ? "Request" : 'Pay'}</p>


                    <div className="inputContainers" style={{ flexDirection: 'row', width: '99%', alignItems: 'center', justifyContent: 'center' }}>
                        <strong>
                            <p style={{ fontSize: '24px', cursor: 'pointer', margin: '10px 0 8px 0' }} onClick={() => toggleKeyPad()}>{context.input.includes('.') ? `$${context.input}` : !context.input ? '$0' : `$${context.input}`}</p>

                        </strong>

                    </div>
                    <div className="inputContainers" style={{ flexDirection: 'row', width: '99%', alignItems: 'center', justifyContent: 'flex-start', maxHeight: '31px' }}>

                        <label htmlFor="to" style={{ margin: '0 10px 0 0', color: 'royalblue', fontSize: '16px', fontWeight: '500', }}>To</label>

                        <input type="text" name="to" id="" onChange={(e) => handleFindRecipient(e)} placeholder='Name, Email, Phone' style={{ display: recipient ? 'none' : 'block' }} value={user} />

                        <div className="recipient" style={{ display: recipient ? 'flex' : 'none' }}>
                            <div className="user" style={{ borderRadius: '10px', backgroundColor: 'gainsboro', color: 'royalblue', display: 'flex' }}>

                                <p style={{ margin: '5px 0 5px 5px' }} >{recipient ? recipient.username : null}</p>

                                <p style={{ position: 'relative', fontSize: '18px', top: '3.5px', margin: '0', padding: '0 5px 5px 5px' }} onClick={() => removeRecipient()}><i className="fa-regular fa-circle-xmark"></i></p>

                            </div>
                        </div>

                    </div>

                    {/* <div className="inputContainers" style={{ flexDirection: 'row', width: '99%', alignItems: 'center', justifyContent: 'flex-start', margin: '0 0 1rem 0' }}>

                        <label htmlFor="notes" style={{ margin: '0 10px 0 0', color: 'royalblue', fontSize: '16px', fontWeight: '500' }}>Note</label>

                        <input type="text" name="notes" id="" onChange={(e) => handleNotes(e)} placeholder='Optional' />
                    </div> */}
                    <p style={{ color: 'royalblue', margin: '10px 0 10px 5px', opacity: '0.7', alignSelf: 'flex-start', fontSize: '16px' }}>CONTACTS</p>
                    <div className="contactList" style={{ width: '99%', overflowX: 'hidden', padding: '5px' }}>



                        {!isLoading ? context.contacts.map((item) => (
                            <>
                                <div className="contactResult1" id={item._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', cursor: 'pointer', border: 'solid 1px black' }} onClick={(e) => handleSelectRecipient(e)} key={v4()}>
                                    {

                                        <i className={`fa-sharp fa-${item.username[1]}`} style={{ color: "white", fontSize: '6vw', backgroundColor: 'royalblue', borderRadius: '50%', border: 'inset black 5px' }} id={item._id} onClick={(e) => handleSelectRecipient(e)}></i>
                                    }


                                    <p style={{ margin: '0', fontWeight: '600', color: 'royalblue' }} id={item._id} onClick={(e) => handleSelectRecipient(e)}>{item.username}</p>

                                </div>
                            </>
                        )) : null}
                    </div>

                </>
            }
        </>
    )
}