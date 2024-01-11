import { useStateContext } from '../Provider/contextProvider'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 } from 'uuid'
import { TfiClose } from 'react-icons/tfi'
import { TiUserAddOutline } from 'react-icons/ti'
import { TiUserDeleteOutline } from 'react-icons/ti'

export default function Profile() {
    const { context, setContext, icon } = useStateContext()
    const [profile, setProfile] = useState({
        contact: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`http://localhost:8080/recent/${context.session}`)
            .then(res => {
                axios.get(`http://localhost:8080/fetchContactProfile/${context.contactProfile}`)
                    .then(res => {
                        console.log('fetchContact res', res)
                        setProfile(prev => ({
                            ...prev,
                            contact: [res.data]
                        }))
                    })
                    .finally(() => {
                        setLoading(false)
                        res.data.notifications.map((item) => item.request = true)
                        res.data.payments.map((item) => item.payment = true)
                        res.data.requests.map((item) => item.moneyRequest = true)
                        setContext(prev => ({
                            ...prev,
                            recentActivity: [...res.data.added].concat(...res.data.notifications).concat(...res.data.payments).concat(...res.data.requests).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                            fetching: false,
                            contacts: res.data.contacts
                        }))
                    })
                    .catch(err => console.error(err))
            })
            .catch(err => console.error(err))
    }, [context.fetching])
    const handleAddContact = () => {
        if (!context.contacts.includes(context.contactProfile))
            setContext(prev => ({
                ...prev,
                loading: true
            }))
        axios.put(`http://localhost:8080/addFriend/${context.payTag}/${context.contactProfile}`, { user: context.contactProfile, id: context.session })
            .then(res => {
                console.log('add res', res)
                setContext(prev => ({
                    ...prev,
                    confirmAdd: false,
                    userModal: false,
                    loading: false,
                    added: true,
                    contacts: res.data.contacts
                }))
            }
            )
            .catch(err => console.error('addContact error', err))
        console.log('handle add contact firing')
    }
    const handleCancelAdd = () => {
        setContext(prev => ({
            ...prev,
            confirmAdd: false,
        }))
    }
    const handleConfirmAdd = () => {
        setContext(prev => ({
            ...prev,
            confirmAdd: true,
        }))
    }
    const handleCancelDelete = () => {
        setContext(prev => ({
            ...prev,
            confirmDelete: false,
        }))
    }
    const deleteContact = () => {
        if (context.contacts.includes(context.contactProfile))
            axios({
                method: 'PUT',
                url: `http://localhost:8080/deleteContact/${context.session}/${context.contactProfile}`,
                // withCredentials: true

            }).then(res => {
                // console.log('delete contact response', res)
                setContext(prev => ({
                    ...prev,
                    confirmDelete: false,
                    added: false,
                    contacts: res.data.deleted.contacts
                }))
            }).catch(err => console.error('deleteContact caught an error', err))
    }
    const handlePrevious = () => {
        if (context.wasOnContacts) {
            setContext(prev => ({
                ...prev,
                contactPage: true,
                settings: true,
                userProfile: false,
                search: false,
                recent: false,
                viewProfile: false,
                support: false,
                privacy: false,
                linked: false,
                wallet: false,
                fetching: true,
                limits: false,
                transaction: false,
                requesting: false,
                sending: false,
                contactProfile: '',
                input: '',
                addCash: false,
                cashOut: false,
                confirmAdd: false,
                confirmDelete: false,
                personal: false,
                recipient: null,
                userNotFound: false,
                addBank: false,
                wasOnRecent: false,
            }))
        }
        if (context.wasOnRecent) {
            setContext(prev => ({
                ...prev,
                contactPage: false,
                settings: false,
                userProfile: false,
                search: false,
                recent: true,
                viewProfile: false,
                support: false,
                privacy: false,
                linked: false,
                wallet: false,
                fetching: true,
                limits: false,
                transaction: false,
                requesting: false,
                sending: false,
                contactProfile: '',
                input: '',
                addCash: false,
                cashOut: false,
                confirmAdd: false,
                confirmDelete: false,
                personal: false,
                recipient: null,
                userNotFound: false,
                addBank: false,
            }))
        }

        else {
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
                input: '',
                fetching: false,
                contactPage: false,
                confirmAdd: false,
                confirmDelete: false,
                addCash: false,
                cashOut: false,
                recipient: null,
                contactProfile: '',
                userNotFound: false,
                results: [],
                wasOnRecent: false
            }))

        }
    }
    const handleConfirmDelete = () => {
        setContext(prev => ({
            ...prev,
            confirmDelete: true,
        }))
    }
    const handleRequest = (e) => {
        let id = context.contactProfile
        axios.get(`http://localhost:8080/getContactOne/${id}`)
            .then(contact => {
                setContext(prev => ({
                    ...prev,
                    recipient: contact.data,
                    transaction: true,
                    requesting: true,
                    settings: false,
                    contactPage: false,
                    viewProfile: false,

                }))
            })
            .catch(err => console.log('handleRequest err', err))
        console.log('handleRequest fired')



    }
    const handleSend = (e) => {
        let id = context.contactProfile
        axios.get(`http://localhost:8080/getContactTwo/${id}`)
            .then(contact => {
                setContext(prev => ({
                    ...prev,
                    recipient: contact.data,
                    transaction: true,
                    sending: true,
                    settings: false,
                    contactPage: false,
                    viewProfile: false,
                }))
            })
            .catch(err => console.log('handleSend err', err))
    }
    return (

        <div className="contact" >
            {console.log('recent ', profile)}
            <div className="confirmAddTwo" style={{ display: context.confirmAdd ? 'flex' : 'none' }}>
                <p >This User Will Be Added To Your Contact List Are You Sure ?</p>
                <div className="confirmButtons">
                    <button onClick={() => handleAddContact()} style={{ borderRadius: '0 0  0 15px' }}>Yes</button>
                    <button onClick={() => handleCancelAdd()} style={{ borderRadius: '0 0 15px 0', borderLeft: 'solid 0.5px royalblue' }}>No</button>
                </div>
            </div>
            <div className="confirmDelete" style={{ display: context.confirmDelete ? 'flex' : 'none' }}>
                <p >This User Will Be Removed From Your Contact List Are You Sure ?</p>
                <div className="confirmButtons">
                    <button onClick={() => deleteContact()} style={{ borderRadius: '0 0  0 15px' }}>Yes</button>
                    <button onClick={() => handleCancelDelete()} style={{ borderRadius: '0 0 15px 0', borderLeft: 'solid 0.5px royalblue' }}>No</button>
                </div>
            </div>
            <button className='backToContacts' onClick={() => handlePrevious()}><TfiClose /></button>
            {profile.contact.length ? profile.contact.map((item) => <div className="contactProfile" key={v4()}>

                <div className="profilePic" style={{ padding: '2.5rem 0 0 0' }}>
                    <i className={`fa-sharp fa-${item.username[1]}`} style={{ color: 'white', border: 'inset 5px black', borderRadius: '50%', padding: '2rem', backgroundColor: 'royalblue', minWidth: '10vw' }}></i>
                </div>
                <div className="contactProfileInfo">
                    <h2 style={{ margin: '10px 0', fontWeight: '400', width: '100%', opacity: '0.65', color: 'black' }}>{item.username}</h2>
                    {item.bio ? <p style={{ margin: '10px 0' }}>{item.bio}</p> : null
                    }
                </div>
                <div className="features">
                    <button style={{ borderRadius: '10px 0 0 10px', border: 'solid 0.5px royalblue', }} onClick={() => handleRequest()}>Request</button>
                    <button style={{ borderRadius: '0 10px 10px 0', border: 'solid 0.5px royalblue', padding: '10px 15px 10px 15px' }} onClick={() => handleSend()}>Send</button>
                    {
                        context.contacts.includes(context.contactProfile) ?
                            <p style={{ color: 'royalblue', fontSize: '30px', textDecoration: 'underline', cursor: 'pointer', margin: '5px 0 0 0' }} onClick={() => handleConfirmDelete()}><TiUserDeleteOutline /></p>
                            :
                            <p style={{ color: 'royalblue', fontSize: '30px', textDecoration: 'underline', cursor: 'pointer', margin: '5px 0 0 0' }} onClick={() => handleConfirmAdd()}><TiUserAddOutline /></p>

                    }
                </div>
                <div className="transactions" style={{ overflow: 'auto', overflowX: 'hidden' }}>
                    <h2 className='header' style={{ backgroundColor: 'royalblue', margin: '0', fontWeight: '150', color: 'white', padding: '0 0 2px 0', position: 'sticky' }}> Recent Transactions <i className='fas fa-user-clock' style={{ color: 'white' }}></i></h2>


                    {context.recentActivity.length ? context.recentActivity.map((item) => item.recieverId === context.contactProfile || item.receiverId === context.contactProfile ? <div className='activity' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '5px 0 5px 5px', borderBottom: 'solid 1px gainsboro' }}>


                        <i className={`fa-sharp fa-${item.receiversName === context.payTag ? item.sendersName[1] : item.username ? item.username[1] : item.receiversName[1]}`} style={icon}></i>
                        {item.payment ?
                            <>
                                <div className="alerts" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <p style={{ fontSize: '18px', textAlign: 'left', color: 'royalblue', fontWeight: '575', margin: '0 0 0 2px' }}>{item.sendersName === context.payTag ? item.receiversName : item.sendersName}</p>
                                    <p style={{ margin: '0 0 0 2px', textAlign: 'left' }}>{item.userId === context.session ? `You sent ${item.receiversName} $${item.amount} ${item.note}` : `${item.sendersName} sent you $${item.amount} ${item.note} `}</p>

                                </div>
                            </>
                            :
                            item.moneyRequest ? <>
                                <div className="alerts" style={{ display: 'flex', flexDirection: 'column' }}>

                                    <p style={{ fontSize: '18px', textAlign: 'left', color: 'royalblue', fontWeight: '575', margin: '0 0 0 2px' }}>{item.sendersName === context.payTag ? item.receiversName : item.sendersName}</p>
                                    <p style={{ margin: '0 0 0 2px', textAlign: 'left' }}>{item.userId === context.session ? `You requested $${item.amount} from ${item.receiversName} ${item.note}` : `${item.sendersName} requested $${item.amount} from you ${item.note}`}</p>
                                </div>
                            </>
                                : null}

                    </div> : null) : <p>You have no transactions with this user</p>}


                </div>

            </div>) : null}

        </div>
    )
}