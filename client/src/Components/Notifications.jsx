import { useStateContext } from '../Provider/contextProvider'
import axios from 'axios'
import { useEffect } from 'react'
import { MdNotificationsActive } from 'react-icons/md'
import { MdNotificationsOff } from 'react-icons/md'
export default function Notifications() {

    const { context, setContext } = useStateContext()
    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:8080/getPushSettings',
            withCredentials: true
        }).then(res => {
            setContext(prev => ({
                ...prev,
                pushAlerts: res.data.pushNotifications,
                fetching: false,
            }))
        })
    }, [context.pushAlerts])
    const handlePush = (e) => {

        axios({
            method: 'PUT',
            url: 'http://localhost:8080/enablePush',
            withCredentials: true,
            data: { pushNotifications: true }
        })
            .then(res => {
                setContext(prev => ({
                    ...prev,
                    pushAlerts: true
                }))
            })
            .catch(err => console.log('handlePush caught an err', err))

    }
    const handleTurnOffPush = (e) => {
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/disablePush',
            withCredentials: true,
            data: { pushNotifications: false }
        })
            .then(res => {
                setContext(prev => ({
                    ...prev,
                    pushAlerts: false
                }))
            })
            .catch(err => console.log('handlePush caught an err', err))



    }
    const handlePushNotifications = (e) => {

        ///would have to be falsy for the  first condition to work but its the opposite and idk if i will run into issues in the future because of this but its good for now i guess
        if (e.target.checked) handlePush(e)
        else handleTurnOffPush(e)
    }
    return (
        <>
            <h2 style={{ color: "royalblue", margin: '0 0 5px 0', letterSpacing: '1px', fontWeight: '350', fontFamily: 'sans-serif', fontSize: '5vw' }}> Push Notifications {context.pushAlerts ? <MdNotificationsActive style={{ margin: '10px 0 0 0' }} /> : <MdNotificationsOff style={{ padding: '10px 0 0 0' }} />}</h2>
            {context.fetching ? <div className="loader"></div> :

                <div className="alerts" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="pushAlerts" style={{ display: 'flex', justifyContent: 'flex-start' }}>

                        <label class="switch">
                            <input type="checkbox" className='push' onChange={(e) => handlePushNotifications(e)} checked={context.pushAlerts ? true : false} />
                            <span class="slider round"></span>
                        </label>
                        <p style={{ fontSize: '20px', fontWeight: "600" }}>{context.pushAlerts ? 'ON' : 'OFF'}</p>
                    </div>
                    {context.phone ? <div className="phoneAlerts" style={{ display: 'flex' }}>
                        <input type="checkbox" name="phoneAlerts" id="" style={{ height: '25px', width: '25px' }} disabled={context.pushAlerts ? false : true} />

                        <p style={{ fontSize: '20px' }}>{context.phone}</p>
                    </div> : null}

                    {context.email ?

                        <div className="emailAlerts" style={{ display: 'flex' }}>
                            <input type="checkbox" name="emailAlerts" id="" style={{ height: '25px', width: '25px' }} disabled={context.pushAlerts ? false : true} />
                            <p style={{ fontSize: '20px' }}>{context.email}</p>

                        </div> : null

                    }
                    {/* <div className="paymeAlerts" >
                        <input type="checkbox" name="payme" id="payme" style={{ height: '25px', width: '25px', borderRadius: '5px' }} disabled={context.pushAlerts ? false : true} />
                        <p style={{ fontSize: '20px', wordSpacing: '1.5px' }}>Payme Bet Notifications</p>
                    </div>
                    <div className="bitcoinAlerts">
                        <input type="checkbox" name="phoneAlerts" id="" style={{ height: '25px', width: '25px' }} disabled={context.pushAlerts ? false : true} />

                        <p style={{ fontSize: '20px' }}>Bitcoin</p>
                    </div>
                    <div className="stockAlerts">
                        <input type="checkbox" name="phoneAlerts" id="" style={{ height: '25px', width: '25px' }} disabled={context.pushAlerts ? false : true} />

                        <p style={{ fontSize: '20px' }}>Stocks</p>
                    </div> */}
                </div>
            }
        </>
    )
}