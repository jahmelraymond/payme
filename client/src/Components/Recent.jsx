import { useStateContext } from '../Provider/contextProvider'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { v4 } from 'uuid'
import { FaUsers } from 'react-icons/fa6'
import { BiSolidContact } from 'react-icons/bi'

export default function Recent() {
    const { context, setContext, alert, username, icon, } = useStateContext()
    const [fetching, setIsFetching] = useState(true)
    useEffect(() => {
        axios.get(`http://localhost:8080/recent/${context.session}`)
            .then(res => {
                // console.log('recent res', res)
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
            .finally(() => setIsFetching(false))
            .catch(err => console.error(err))
    }, [context.fetching])
    const acceptReq = (e) => {
        let id = e.target.id
        // console.log(e, 'id')
        if (!context.contacts.includes(id)) {
            setContext(prev => ({
                ...prev,
                fetching: true
            }))
            axios.put(`http://localhost:8080/accept/${id}`, { contact: id }, { withCredentials: true })
                .then(res => {
                    res.data.activity.notifications.map((item) => item.request = true)
                    res.data.activity.payments.map((item) => item.payment = true)
                    res.data.activity.requests.map((item) => item.moneyRequest = true)
                    res.data.activity.notifications.map((item) => item.createdAt = new Date())
                    setContext(prev => ({
                        ...prev,
                        recentActivity: [...res.data.activity.added].concat(...res.data.activity.notifications).concat(...res.data.activity.payments).concat(...res.data.activity.requests).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                        fetching: false
                    }))
                })
                .catch(err => console.log('accept req err ', err))
            console.log('accept req fired')
        }

    }
    const denyReq = (e) => {
        setContext(prev => ({
            ...prev,
            fetching: true
        }))
        let id = e.target.id
        axios.put(`http://localhost:8080/deny/${id}`, { request: id }, { withCredentials: true })
            .then(res => {
                console.log('deny res', res)
                res.data.activity.notifications.map((item) => item.request = true)
                res.data.activity.payments.map((item) => item.payment = true)
                res.data.activity.requests.map((item) => item.moneyRequest = true)
                setContext(prev => ({
                    ...prev,
                    recentActivity: [...res.data.activity.added].concat(...res.data.activity.notifications).concat(...res.data.activity.payments).concat(...res.data.activity.requests).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                    fetching: false
                }))
            })
            .catch(err => console.log('deny req err ', err))
        console.log('id ', id)
    }
    const handleViewProfile = (e) => {
        let id = e.target.id
        setContext(prev => ({
            ...prev,
            contactProfile: id,
            viewProfile: true,
            contactPage: false,
            recent: false,
            settings: false,
            search: false,
            wasOnContacts: false,
            wasOnRecent: true,
        }))
    }
    return (
        <div className="recent" style={{ width: '100%' }}>


            <h2 style={{ margin: '0', color: 'royalblue', fontWeight: '350', position: 'sticky', top: '0', fontSize: '5vw', backgroundColor: 'white' }}>Recent Activity <i className='fas fa-user-clock' style={{ color: 'royalblue' }}></i></h2>

            {context.fetching ? <div className="loader"></div> : !fetching ? context.recentActivity.map((item) =>

                <div className="alert" style={alert} key={v4()} id={!item.receiverId ? item._id : item.receiverId}>

                    {

                        <i onClick={(e) => handleViewProfile(e)} id={!item.receiverId ? item._id : item.receiverId} className={`fa-sharp fa-${item.receiversName === context.payTag ? item.sendersName[1].toLowerCase() : item.username ? item.username[1].toLowerCase() : item.receiversName[1].toLowerCase()}`} ></i>
                    }

                    <div style={{ flex: item.request ? '3' : '1.63', fontSize: '16px', fontWeight: '500', margin: '0', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        {item.request ?
                            <>
                                <div className="info" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <p id={!item.receiverId ? item._id : item.receiverId} onClick={(e) => handleViewProfile(e)} style={{ textAlign: 'left', color: 'royalblue', fontWeight: '575', margin: '0 0 0 10px', fontSize: '5vw' }}>{item.username} </p>
                                    <p style={{ margin: '0 0 0 10px', textAlign: 'left', fontSize: '4vw' }}>Sent You A Friend Request</p>
                                </div>

                            </>
                            : item.payment ?
                                <>
                                    <div className="info" style={{ display: 'flex', flexDirection: 'column' }}>


                                        <p style={{ margin: '0 0 0 10px', textAlign: 'left', fontSize: '5vw' }}>{item.userId === context.session ? <>You sent <span id={!item.receiverId ? item._id : item.receiverId} style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }} onClick={(e) => handleViewProfile(e)}>{item.receiversName}</span> <span style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }}>${item.amount}</span> </> : <> <span id={!item.receiverId ? item._id : item.receiverId} style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }} onClick={(e) => handleViewProfile(e)}>{item.sendersName}</span> sent you <span style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }}>${item.amount}</span></>}</p>
                                        <span style={{ fontSize: '14px', color: 'royalblue', display: 'flex', flexDirection: 'column', margin: '0 0 0 10px' }}>{`${new Date(item.createdAt).toDateString()} at ${new Date(item.createdAt).toLocaleTimeString()}`}</span>
                                    </div>
                                </>
                                :
                                item.moneyRequest ? <>

                                    <div className="info" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <p style={{ margin: '0 0 0 10px', textAlign: 'left', fontSize: '5vw' }}>{item.userId === context.session ? <>You requested <span style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }}>${item.amount}</span> from <span id={!item.receiverId ? item._id : item.receiverId} style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }} onClick={(e) => handleViewProfile(e)}>{item.receiversName}</span></> : <><span id={!item.receiverId ? item._id : item.receiverId} style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }} onClick={(e) => handleViewProfile(e)}>{item.sendersName}</span> requested <span style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }}>${item.amount}</span> from you</>}</p>
                                        <span style={{ fontSize: '14px', color: 'royalblue', display: 'flex', flexDirection: 'column', margin: '0 0 0 10px' }}>{`${new Date(item.createdAt).toDateString()} at ${new Date(item.createdAt).toLocaleTimeString()}`}</span>
                                    </div>
                                </>
                                    :
                                    <>

                                        <div className="info" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <p style={{ margin: '0 0 0 11px', fontSize: '5vw', textAlign: 'left' }}>You added <span id={!item.receiverId ? item._id : item.receiverId} style={{ fontWeight: '600', fontStyle: 'italic', color: 'royalblue' }} onClick={(e) => handleViewProfile(e)}>{item.username}</span></p>
                                            <span style={{ fontSize: '14px', color: 'royalblue', display: 'flex', flexDirection: 'column', margin: '0 0  0 10px' }}>{`${new Date(item.createdAt).toDateString()} at ${new Date(item.createdAt).toLocaleTimeString()}`}</span>
                                        </div>

                                    </>}</div>
                    <div className="recentContainer" style={{ height: '100%', alignItems: 'center', display: item.request ? 'flex' : 'none' }}>
                        <button style={{ flex: '0.75', backgroundColor: 'royalblue', borderRight: 'solid 0.5px white', color: 'white', fontSize: '16px', borderRadius: '10px 0 0 10px', display: item.request ? 'block' : 'none', }} onClick={(e) => denyReq(e)} id={!item.receiverId ? item._id : item.receiverId}><i id={!item.receiverId ? item._id : item.receiverId} style={{ border: 'none', padding: '0' }} className="fa-regular fa-circle-xmark"></i></button>


                        <button style={{ flex: '0.75', backgroundColor: "royalblue", color: 'white', fontSize: '16px', borderRadius: '0 10px 10px 0', display: item.request ? 'block' : 'none', padding: '10px', fontWeight: '400' }} onClick={(e) => acceptReq(e)} id={!item.receiverId ? item._id : item.receiverId}><i style={{ border: 'none', padding: '0' }} id={!item.receiverId ? item._id : item.receiverId} className="fa-regular fa-circle-check"></i></button>
                    </div>


                </div>





            ) : null}
        </div>
    )
}