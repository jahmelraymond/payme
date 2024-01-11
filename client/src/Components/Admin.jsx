import Logo from '../Logo/PayMeLogo.png'
import { useStateContext } from '../Provider/contextProvider'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaUserLock } from 'react-icons/fa'
import { TbFlagQuestion } from 'react-icons/tb'
import { TbReportAnalytics } from 'react-icons/tb'
import { FaUserGroup } from 'react-icons/fa6'
import { AiFillLock } from 'react-icons/ai'
import { AiFillUnlock } from 'react-icons/ai'
import { AiFillHome } from 'react-icons/ai'
import { AiFillFlag } from 'react-icons/ai'
import { AiOutlineFlag } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import Search from '../Logo/searchIcon.png'
import { v4 } from 'uuid'



export default function Admin() {
    useEffect(() => {
        axios.get('http://localhost:8080/getUsers')
            .then(users => {
                setState(prev => ({
                    ...prev,
                    users: users.data.filter((item) => item.admin !== true),
                    flagged: users.data.filter((item) => item.flagged === true),
                    restricted: users.data.filter((item) => item.restricted === true),
                    viewUsers: true,
                    viewRestricted: false,
                    viewFlagged: false,
                    userSelected: false,
                }))
            })
            .finally(() => {
                setLoading(false)
                localStorage.setItem('users', JSON.stringify(state.users))
                localStorage.setItem('flagged', JSON.stringify(state.flagged))
                localStorage.setItem('restricted', JSON.stringify(state.restricted))
            })
            .catch(err => console.log('getUsers fetch err', err))
    }, [])
    const [state, setState] = useState({
        panel: false,
        users: [],
        flagged: [],
        restricted: [],
        user: [],
        transactions: [],
        line: false,
        viewFlagged: false,
        viewRestricted: false,
        viewUsers: false,
        userSelected: false,
        flagAdded: false,
        flaggedRemoved: false,
        lockAdded: false,
        lockRemoved: false
    })
    const { context, setContext } = useStateContext()
    const nav = useNavigate()
    const [loading, setLoading] = useState(true)
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
                localStorage.clear()
                console.log(sessionStorage.clear())
            })
            .catch(err => console.error('handleLogout caught error ', err))



    }
    const handleUsers = () => {
        setContext(prev => ({ ...prev, adminPanel: false }))
        setState(prev => ({
            ...prev,
            viewFlagged: false,
            viewRestricted: false,
            viewUsers: true,
            userSelected: false,
            user: []
        }))
    }
    const handleFlagged = () => {
        setContext(prev => ({ ...prev, adminPanel: false }))
        setState(prev => ({
            ...prev,
            viewFlagged: true,
            viewRestricted: false,
            viewUsers: false,
            userSelected: false,
            user: []
        }))
    }
    const handleRestricted = () => {
        setContext(prev => ({ ...prev, adminPanel: false }))
        setState(prev => ({
            ...prev,
            viewFlagged: false,
            viewRestricted: true,
            viewUsers: false,
            userSelected: false,
            user: []
        }))
    }
    const handleReports = () => setContext(prev => ({ ...prev, adminPanel: false }))
    const toggleLine = () => setState(prev => ({ ...prev, line: true }))
    const untoggleLine = () => setState(prev => ({ ...prev, line: false }))
    const findUser = (e) => {
        let user = e.target.value
        if (state.viewUsers) {
            setState(prev => ({
                ...prev,
                users: user ? [...prev.users].filter((item) => item.username.includes(user)) : JSON.parse(localStorage.getItem('users'))
            }))
        }
        else if (state.viewFlagged) {
            setState(prev => ({
                ...prev,
                flagged: user ? [...prev.flagged].filter((item) => item.username.includes(user)) : JSON.parse(localStorage.getItem('flagged'))
            }))
        }
        else if (state.viewRestricted) {
            setState(prev => ({
                ...prev,
                restricted: user ? [...prev.restricted].filter((item) => item.username.includes(user)) : JSON.parse(localStorage.getItem('restricted'))
            }))
        }


    }
    const selectUser = (e) => {
        let user = e.target.id
        axios.get(`http://localhost:8080/selectUser/${user}`)
            .then(user => {
                console.log('user', user.data)
                setState(prev => ({
                    ...prev,
                    userSelected: true,
                    user: [user.data],
                    viewUsers: false,
                    viewRestricted: false,
                    viewFlagged: false,
                    transactions: [...user.data.payments].concat(...user.data.requests).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                }))
            })
            .catch(err => console.log('selectUser err', err))
    }
    const addFlag = (e) => {
        let user = e.target.id
        axios.put(`http://localhost:8080/addFlag/${user}`)
            .then(user => {
                axios.get('http://localhost:8080/getUsers')
                    .then(users => {
                        setState(prev => ({
                            ...prev,
                            users: users.data.filter((item) => item.admin !== true),
                            flagged: users.data.filter((item) => item.flagged === true),
                            restricted: users.data.filter((item) => item.restricted === true),
                            user: [user.data]
                        }))
                    })
                    .finally(() => {
                        setLoading(false)
                        localStorage.setItem('users', JSON.stringify(state.users))
                        localStorage.setItem('flagged', JSON.stringify(state.flagged))
                        localStorage.setItem('restricted', JSON.stringify(state.restricted))
                    })
                    .catch(err => console.log('getUsers fetch err', err))
            })
            .catch(err => console.log('flagUser err', err))
    }
    const removeFlag = (e) => {
        let user = e.target.id
        axios.put(`http://localhost:8080/removeFlag/${user}`)
            .then(user => {
                axios.get('http://localhost:8080/getUsers')
                    .then(users => {
                        setState(prev => ({
                            ...prev,
                            users: users.data.filter((item) => item.admin !== true),
                            flagged: users.data.filter((item) => item.flagged === true),
                            restricted: users.data.filter((item) => item.restricted === true),
                            user: [user.data]
                        }))
                    })
                    .finally(() => {
                        setLoading(false)
                        localStorage.setItem('users', JSON.stringify(state.users))
                        localStorage.setItem('flagged', JSON.stringify(state.flagged))
                        localStorage.setItem('restricted', JSON.stringify(state.restricted))
                    })
                    .catch(err => console.log('getUsers fetch err', err))
            })
            .catch(err => console.log('removeFlag err', err))

    }
    const restrictUser = (e) => {
        let user = e.target.id
        axios.put(`http://localhost:8080/restrictUser/${user}`)
            .then(user => {
                axios.get('http://localhost:8080/getUsers')
                    .then(users => {
                        setState(prev => ({
                            ...prev,
                            users: users.data.filter((item) => item.admin !== true),
                            flagged: users.data.filter((item) => item.flagged === true),
                            restricted: users.data.filter((item) => item.restricted === true),
                            user: [user.data]
                        }))
                    })
                    .finally(() => {
                        setLoading(false)
                        localStorage.setItem('users', JSON.stringify(state.users))
                        localStorage.setItem('flagged', JSON.stringify(state.flagged))
                        localStorage.setItem('restricted', JSON.stringify(state.restricted))
                    })
                    .catch(err => console.log('getUsers fetch err', err))
            })
            .catch(err => console.log('flagUser err', err))
    }
    const unrestrictUser = (e) => {
        let user = e.target.id
        axios.put(`http://localhost:8080/unrestrictUser/${user}`)
            .then(user => {
                axios.get('http://localhost:8080/getUsers')
                    .then(users => {
                        setState(prev => ({
                            ...prev,
                            users: users.data.filter((item) => item.admin !== true),
                            flagged: users.data.filter((item) => item.flagged === true),
                            restricted: users.data.filter((item) => item.restricted === true),
                            user: [user.data]
                        }))
                    })
                    .finally(() => {
                        setLoading(false)
                        localStorage.setItem('users', JSON.stringify(state.users))
                        localStorage.setItem('flagged', JSON.stringify(state.flagged))
                        localStorage.setItem('restricted', JSON.stringify(state.restricted))
                    })
                    .catch(err => console.log('getUsers fetch err', err))
            })
            .catch(err => console.log('unrestrictUser err', err))
    }


    return (
        <>
            {console.log('state', state)}
            <div className="topNav" style={{ order: '1', zIndex: '1', maxHeight: '40px' }} >

                <div className="logo">
                    <h3><img src={Logo} className='appLogo' alt="app Logo" /></h3>

                    <GiHamburgerMenu style={{ position: 'absolute', right: '10px', color: 'white', fontSize: '22px' }} onClick={() => setContext(prev => ({ ...prev, adminPanel: !prev.adminPanel }))} />

                </div>

            </div>
            <div
                className="adminPanel"
                style={{ width: context.adminPanel ? '50%' : '0', position: 'absolute', zIndex: '2', transition: '0.2s', padding: '0', height: '100%', borderRight: context.adminPanel ? 'solid 0.5px royalblue' : 'none', backgroundColor: 'gainsboro', boxShadow: '2px 2px 15px black' }}
            >

                <div
                    className="userName"
                    style={{ display: context.adminPanel ? 'flex' : 'none', backgroundColor: 'gainsboro' }}
                >
                    <i
                        className={`fa-sharp fa-${context.payTag[1]}`}
                        style={{ color: 'white', backgroundColor: 'royalblue', borderRadius: '50%', padding: '20px', border: 'inset 5px black', textAlign: 'center', boxShadow: '2px 2px 10px black' }}
                    ></i>

                    {context.fullname ?
                        <h2 style={{ fontSize: '5.5vw', margin: '0.25rem 0 0 0', padding: '0 5px 0 5px' }}>{context.fullname}</h2> : null}

                    <p style={{ fontSize: context.paytag.length > 12 ? '18px' : '30px', opacity: '0.7', margin: '0.2rem 0 0 0' }}>{context.payTag}</p>
                </div>
                <div className="actions" style={{ display: context.adminPanel ? 'flex' : 'none', flexDirection: 'column' }}>

                    <div className="users" style={{ display: 'flex', borderBottom: 'solid 0.5px royalblue', width: '100%', cursor: 'pointer' }} onClick={() => handleUsers()}>

                        <FaUserGroup style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }} />

                        <p style={{ margin: 'auto' }}>Users</p>

                    </div>

                    <div className="flagged" style={{ display: 'flex', borderBottom: 'solid 0.5px royalblue', width: '100%', cursor: 'pointer' }} onClick={() => handleFlagged()}>

                        <TbFlagQuestion style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }} />

                        <p style={{ margin: 'auto' }}>Flagged</p>

                    </div>

                    <div className="restricted" style={{ display: 'flex', borderBottom: 'solid 0.5px royalblue', width: '100%', cursor: 'pointer' }} onClick={() => handleRestricted()}>

                        < FaUserLock style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }} />

                        <p style={{ margin: 'auto' }}>Restricted</p>

                    </div>

                    <div className="reports" style={{ display: 'flex', borderBottom: 'solid 0.5px royalblue', width: '100%', cursor: 'pointer' }} onClick={() => handleReports()}>

                        < TbReportAnalytics style={{ fontSize: '8vw', color: 'royalblue', padding: '10px' }} />

                        <p style={{ margin: 'auto' }}>Reports</p>

                    </div>

                </div>

                <div className="logout" style={{ display: context.adminPanel ? 'flex' : 'none', position: 'absolute', bottom: '0' }}>

                    <button onClick={() => {
                        handleLogOut()
                        nav('/')
                    }
                    } >Sign Out</button>
                </div>

            </div>

            <div className="admin" style={{ display: 'flex', flexDirection: 'column', padding: '5px', order: '2' }} onClick={() => setContext(prev => ({ ...prev, adminPanel: false }))}>

                < AiFillHome style={{ fontSize: '24px', color: 'royalblue', cursor: 'pointer', display: state.userSelected ? 'block' : 'none', alignSelf: 'flex-end' }} onClick={() => handleUsers()} />

                <h2 style={{ textAlign: 'center', color: 'royalblue', margin: '5px 0 10px 0' }}>{state.viewFlagged ? 'Flagged' : state.viewRestricted ? 'Restricted' : 'Users'}</h2>
                <div className="inputContainers" style={{ width: '99%', margin: '0 0 1.5rem 0', display: state.userSelected ? 'none' : 'flex' }}>

                    <input type="text" placeholder='@username' id='findUser' onChange={(e) => findUser(e)} onFocus={() => toggleLine()} onBlur={() => untoggleLine()} style={{ borderRadius: '5px ', width: "99%", padding: '10px 0 10px 0', backgroundImage: `url(${Search})`, backgroundRepeat: 'no-repeat' }} />

                    <div className="underline" style={{ width: state.line ? '100%' : '0' }} ></div>

                </div>
                {state.viewFlagged ? state.flagged.map((item) => <div className="user" id={item._id} style={{ borderBottom: 'solid 0.5px gainsboro', borderRadius: '10px', boxShadow: '2px 2px 15px black', display: 'flex', alignItems: 'center', padding: '5px', cursor: 'pointer', margin: '0 0 5px 0', flexDirection: 'column' }} onClick={(e) => selectUser(e)} key={v4()}>

                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '600', color: 'royalblue', flex: '0.4', padding: '0' }} id={item._id}>{item.username}</p>

                    <p id={item._id} style={{ flex: '0.6', margin: '0 0 5px 0' }}>Joined : <span id={item._id} style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.joined}</span></p>

                </div>) : null}
                {state.viewRestricted ? state.restricted.map((item) => <div className="user" id={item._id} style={{ borderBottom: 'solid 0.5px gainsboro', borderRadius: '10px', boxShadow: '2px 2px 15px black', display: 'flex', alignItems: 'center', padding: '5px', cursor: 'pointer', margin: '0 0 5px 0', flexDirection: 'column' }} onClick={(e) => selectUser(e)} key={v4()}>

                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '600', color: 'royalblue', flex: '0.4', padding: '0' }} id={item._id}>{item.username}</p>

                    <p id={item._id} style={{ flex: '0.6', margin: '0 0 5px 0' }}>Joined : <span id={item._id} style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.joined}</span></p>

                </div>) : null}
                {state.viewUsers ? state.users.map((item) => <div className="user" id={item._id} style={{ borderBottom: 'solid 0.5px gainsboro', borderRadius: '10px', boxShadow: '2px 2px 15px black', display: 'flex', alignItems: 'center', padding: '5px', cursor: 'pointer', margin: '0 0 5px 0', flexDirection: 'column' }} onClick={(e) => selectUser(e)} key={v4()}>

                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '600', color: 'royalblue', flex: '0.4', padding: '0' }} id={item._id}>{item.username}</p>

                    <p id={item._id} style={{ flex: '0.6', margin: '0 0 5px 0' }}>Joined : <span id={item._id} style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.joined}</span></p>

                </div>
                ) : null}
                {state.userSelected ? state.user.map((item) => <div className="profile" style={{ borderRadius: '5px', margin: '10px 0 0 0', justifyContent: 'center', alignItems: 'center', }} id={item._id} key={v4()}>

                    <p>Username : <span style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }}>{item.username}</span></p>

                    <p>Full Name : <span style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }}>{item.fullname}</span></p>

                    <p>Join date : <span style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }}>{item.joined}</span></p>

                    <p>{item.restricted ?

                        <>
                            <span>Unlock Account : </span> <i className='fa-solid fa-lock-open' style={{ fontSize: '20px', color: 'royalblue', cursor: 'pointer' }} id={item._id} onClick={(e) => unrestrictUser(e)}></i>
                        </>
                        :
                        <>
                            <span>Lock Account : </span> <i className='fa-solid fa-lock' style={{ fontSize: '20px', color: 'royalblue', cursor: 'pointer' }} id={item._id} onClick={(e) => restrictUser(e)}></i>
                        </>

                    }</p>
                    <p>{item.flagged ?
                        <>
                            <span>Remove Flag : </span> <i id={item._id} className='fa-regular fa-flag' style={{ fontSize: '20px', color: 'royalblue', cursor: 'pointer' }} onClick={(e) => removeFlag(e)}></i>
                        </>
                        :
                        <>
                            <span>Flag User : </span> <i className='fa-solid fa-flag' style={{ fontSize: '20px', color: 'royalblue', cursor: 'pointer' }} id={item._id} onClick={(e) => addFlag(e)}></i>
                        </>

                    }</p>
                    <p>Add Cash Limit : <span style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }}>{item.addCashLimit}</span></p>

                    <p>Cash Out Limit : <span style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }}>{item.cashOutLimit}</span></p>

                    <p>Send Cash Limit : <span style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }}>{item.sendLimit}</span></p>
                </div>
                ) : null}
                <div className="transactions" style={{ display: state.userSelected ? 'flex' : 'none', flexDirection: 'column', margin: '2rem 0 0 0' }}>

                    <h2
                        className='header'
                        style={{ backgroundColor: 'royalblue', margin: '0', fontWeight: '300', color: 'white', padding: '0 0 2px 0', position: 'sticky', textAlign: 'center', fontSize: '20px' }}>
                        Activity
                    </h2>

                    {state.userSelected ? state.transactions.map((item) =>
                        item.paymentBool ?
                            <div className="transaction" style={{ borderBottom: 'solid 2.5px gainsboro' }} key={v4()}>

                                <p>{state.user[0].username === item.sendersName ?
                                    <>
                                        <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.sendersName}</span> sent <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.receiversName}</span> $<span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.amount}</span> on <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{`${new Date(item.createdAt).toDateString()} at ${new Date(item.createdAt).toLocaleTimeString()}`}</span>
                                    </>

                                    : <>
                                        <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.receiversName}</span> received $<span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.amount}</span> from <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.sendersName} </span> on <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{`${new Date(item.createdAt).toDateString()} at ${new Date(item.createdAt).toLocaleTimeString()}`}</span>
                                    </>
                                }</p>
                            </div>

                            : item.requestBool ? <div className="transaction" style={{ borderBottom: 'solid 2.5px gainsboro' }} key={v4()}>

                                <p>{state.user[0].username === item.sendersName ?
                                    <>
                                        <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.sendersName}</span> requested <span style={{ fontWeight: '600', fontStyle: 'italic' }}>${item.amount} from</span> <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.receiversName}</span> on <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{`${new Date(item.createdAt).toDateString()} at ${new Date(item.createdAt).toLocaleTimeString()}`}</span>
                                    </>

                                    :
                                    <>
                                        <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.sendersName}</span> requested $<span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.amount}</span> from <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{item.receiversName}</span> on <span style={{ fontWeight: '600', fontStyle: 'italic' }}>{`${new Date(item.createdAt).toDateString()} at ${new Date(item.createdAt).toLocaleTimeString()}`}</span>
                                    </>

                                }</p>
                            </div> : null
                    ) : null}

                </div>



            </div>
        </>
    )
}