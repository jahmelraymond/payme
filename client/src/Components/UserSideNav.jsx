import { useStateContext } from '../Provider/contextProvider'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiSupport } from 'react-icons/bi'
import { MdOutlineSecurityUpdate } from 'react-icons/md'
import { BiSolidCameraPlus } from 'react-icons/bi'
import { MdAccountCircle } from 'react-icons/md'


export default function SideNav() {
    const [content, setContent] = useState({
        pic: ''
    })
    const { context, setContext } = useStateContext()
    useEffect(() => {
        if (content.pic)
            axios.put(`http://localhost:8080/updatePic/${context.session}`, { profilePic: content.pic })
                .then(res => {
                    setContext(prev => ({ ...prev, profilePic: res.data.profilePic }))
                })
                .catch(err => console.error(err))
    }, [content.pic, context.session, setContext])
    const nav = useNavigate()

   

    const handleContacts = () => {
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
            myAccount: false,
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

    // const handleEditProfile = () => {
    //     setContext(prev => ({
    //         ...prev,
    //         contactPage: false,
    //         settings: true,
    //         userProfile: false,
    //         search: false,
    //         personal: true,
    //         fetching: true,
    //         limts: false,
    //         myAccount: false,
    //         support: false,
    //         recent: false,
    //         transaction: false,
    //         requesting: false,
    //         sending: false,
    //         contactProfile: '',
    //         input: '',
    //         addCash: false,
    //         cashOut: false,
    //         recipient: null,
    //         userNotFound: false,
    //         addBank: false



    //     }))
    // }

    const handleLogOut = () => {
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/logout',
            withCredentials: true,

        })
            .then(res => {
            }).finally(() => {
                setContext(prev => ({
                    signedIn: false,
                    contactInfo: false,
                    codeMatch: false,
                    phoneOrEmail: false,
                    codeHeader: false,
                    cardHeader: false,
                    userHeader: false,
                    passwordHeader: false,
                    usernameTaken: false,
                    usernamePicked: false,
                    authenticate: false,
                    matched: false,
                    userProfile: false,
                    search: false,
                    recent: false,
                    send: false,
                    logIn: true,
                    userNotFound: false,
                    confirmAdd: false,
                    contactPage: false,
                    settings: false,
                    usernotFound: false,
                    userFound: false,
                    personal: false,
                    input: '',
                    phone: '',
                    email: '',
                    code: '',
                    confirmCode: '',
                    payTag: '',
                    fullname: '',
                    password: '',
                    verifyPassord: '',
                    searchKey: '',
                    contacts: [],
                    results: [],
                    recentActivity: [],
                    find: 'Find Your Friends',
                    session: '',
                    profilePic: '',
                    bio: ''
                }))
                console.log(sessionStorage.clear())
            })
            .catch(err => console.error('handleLogout caught error ', err))



    }

    const handleAlerts = () => {
        if (!context.alerts) {

            setContext(prev => ({
                ...prev,
                alerts: true,
                contactPage: false,
                personal: false,
                privacy: false,
                linked: false,
                settings: true,
                userProfile: false,
                search: false,
                recent: false,
                support: false,
                myAccount: false,
                limits: false,
                transaction: false,
                requesting: false,
                sending: false,
                input: '',
                contactProfile: '',
                fetching: true,
                recipient: null,
                userNotFound: false,
                addBank: false

            }))
        }
        else {
            setContext(prev => ({
                ...prev,
                alerts: true,
                contactPage: false,
                personal: false,
                privacy: false,
                linked: false,
                settings: true,
                userProfile: false,
                search: false,
                recent: false,
                support: false,
                myAccount: false,
                limits: false,
                transaction: false,
                requesting: false,
                sending: false,
                input: '',
                contactProfile: '',
                recipient: null,
                userNotFound: false,
                addBank: false

            }))
        }
    }
    const handlePrivacy = () => {
        if (!context.privacy)
            setContext(prev => ({
                ...prev,
                alerts: false,
                contactPage: false,
                personal: false,
                privacy: true,
                linked: false,
                settings: true,
                userProfile: false,
                search: false,
                recent: false,
                myAccount: false,
                fetching: true,
                transaction: false,
                requesting: false,
                sending: false,
                input: '',
                contactProfile: '',
                recipient: null,
                userNotFound: false,
                addBank: false

            }))
        else {
            setContext(prev => ({
                ...prev,
                alerts: false,
                contactPage: false,
                personal: false,
                privacy: true,
                linked: false,
                settings: true,
                userProfile: false,
                search: false,
                recent: false,
                myAccount: false,
                transaction: false,
                requesting: false,
                sending: false,
                input: '',
                contactProfile: '',
                recipient: null,
                userNotFound: false,
                addBank: false

            }))

        }
    }
    const handleSupport = () => {
        setContext(prev => ({
            ...prev,
            alerts: false,
            contactPage: false,
            personal: false,
            privacy: false,
            linked: false,
            settings: true,
            userProfile: false,
            search: false,
            support: true,
            recent: false,
            myAccount: false,
            limits: false,
            transaction: false,
            requesting: false,
            sending: false,
            contactProfile: '',
            input: '',
            recipient: null,
            userNotFound: false,
            addBank: false

        }))
    }
    const handleLimits = () => {
        setContext(prev => ({
            ...prev,
            alerts: false,
            contactPage: false,
            personal: false,
            privacy: false,
            linked: false,
            settings: true,
            userProfile: false,
            search: false,
            support: false,
            recent: false,
            limits: true,
            transaction: false,
            requesting: false,
            sending: false,
            contactProfile: '',
            input: '',
            recipient: null,
            userNotFound: false,
            addBank: false,
            myAccount: false


        }))
    }
    const handleAccount = () => {
        setContext(prev => ({
            ...prev,
            alerts: false,
            contactPage: false,
            personal: true,
            privacy: false,
            linked: false,
            settings: true,
            userProfile: false,
            search: false,
            support: false,
            recent: false,
            limits: false,
            transaction: false,
            requesting: false,
            sending: false,
            contactProfile: '',
            input: '',
            recipient: null,
            userNotFound: false,
            addBank: false,
            wasOnContacts: false,
            wasOnRecent: false
        }))
    }
    return (
        <div className="userSideNav" style={{ width: context.userProfile ? '50%' : '0', borderRight: context.userProfile ? 'solid royalblue 0.5px' : 'none', boxShadow: '2px 2px 10px royalblue' }}>

            <div className="userName" style={{ display: context.userProfile ? 'flex' : 'none' }}>
                {context.profilePic ? <img src={context.profilePic} alt="" style={{ borderRadius: '50%', border: 'inset 5px black' }} /> :
                    <i className={`fa-sharp fa-${context.payTag[1]}`} style={{ color: 'white', backgroundColor: 'royalblue', borderRadius: '50%', padding: '20px', border: 'inset 5px black', textAlign: 'center', boxShadow: '2px 2px 10px black' }}></i>
                }
                {/* <label htmlFor="upload" style={{ fontSize: '5vw', color: 'royalblue' }}>
                    <BiSolidCameraPlus style={{ fontSize: '20px' }} />
                    <input type="file" name="sampleFile" id="upload"
                        style={{
                            position: 'absolute',
                            visibility: 'hidden'
                        }}
                        onChange={(e) => handleUpload(e)} />
                </label> */}
                {context.fullname ?  <h2 onClick={() => console.log('full name' , context.fullanme)} style={{ fontSize: context.fullname.length < 10 ? "20px": '5.5vw' ,margin: '0.25rem 0 0 0', padding: '0 5px 0 5px', color: 'royalblue' }}>{context.fullname}</h2> : null}
                <p style={{ fontSize: '5vw', opacity: '0.7', margin: '0.2rem 0 0 0', color: 'royalblue' }}>{context.payTag}</p>


            </div>
            <div className="settings" style={{ display: context.userProfile ? 'grid' : 'none' }}

            >   <div className="contacts" onClick={() => handleAccount()}>
                    <MdAccountCircle style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }} />
                    <p>My Account</p>
                </div>
                <div className="contacts" onClick={() => handleContacts()}>
                    <i className='fas fa-users' style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }}></i>
                    <p>Contacts</p>
                </div>
                {/* <div className="personal" onClick={() => handleEditProfile()}>
                    <i className='fas fa-user-edit' style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }}></i>
                    <p>Personal</p>
                </div> */}

                {/* <div className="limits" onClick={() => handleLimits()}>
                    <i className='fas fa-money-check' style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }}></i>
                    <p>Limits</p>
                </div> */}

                <div className="support" onClick={() => handleSupport()}>
                    <i className='fa-solid fa-headset' style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }}></i>
                    <p>Support</p>
                </div>
                <div className="privacy" onClick={() => handlePrivacy()}>
                    <i className='fas fa-user-lock' style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }}></i>
                    <p>Privacy & Security</p>
                </div>
                <div className="notifications" onClick={() => handleAlerts()} style={{ border: 'none' }}>
                    <i className='fas fa-bell' style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }}></i>
                    <p>Notifications</p>
                </div>
            </div>
            <div className="logout" style={{ display: context.userProfile ? 'flex' : 'none', maxHeight: '60px' }}>
                <button onClick={() => {
                    handleLogOut()
                    nav('/')
                }
                } >Sign Out</button>
            </div>
        </div>
    )
}