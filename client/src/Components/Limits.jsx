import axios from 'axios'
import { useEffect, useState } from 'react'
export default function Limits() {
    const [state, setState] = useState({
        sendLimit: '',
        recieveLimit: '',
        addCashLimit: '',
        cashOutLimit: ''
    })
    useEffect(() => {
        axios.get('http://localhost:8080/limits', { withCredentials: true })
            .then(res => {
                setState(prev => ({
                    ...prev,
                    sendLimit: res.data.sendLimit,
                    receiveLimit: 'Unlimited',
                    addCashLimit: res.data.addCashLimit,
                    cashOutLimit: res.data.cashOutLimit
                }))
            })
            .catch(err => console.log('get limits fetch err', err))
    }, [])
    return (
        <div className="limitsPage" style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ color: 'royalblue', margin: '0', fontWeight: '500', fontSize: '5vw' }}>Limits <i style={{ padding: '0 0 5px 0' }} className='fas fa-user-lock'></i>
            </h1>
            <h3 style={{ color: 'royalblue', opacity: '0.7', alignSelf: 'flex-start', fontWeight: '600', fontSize: '16px', padding: '0 0 0 8px' }}>PAYME LIMITS</h3>
            <div className="sendLimit" style={{ display: 'flex', padding: '10px', justifyContent: 'space-between' }}>
                <strong><p style={{ margin: '5px 0 5px 0', fontWeight: '600' }}>Send Limit</p></strong>
                <p style={{ margin: '5px 0 5px 0' }}>{`$${state.sendLimit.toString()[0]},${state.sendLimit.toString().split('').slice(1).join('')} per Week`}</p>
            </div>
            <div className="recieveLimit" style={{ display: 'flex', padding: '10px', justifyContent: 'space-between' }}>
                <strong>
                    <p style={{ margin: '5px 0 5px 0', fontWeight: '600' }}>Receive Limit</p>
                </strong>
                <p style={{ margin: '5px 0 5px 0' }}>{`${state.receiveLimit}`}</p>
            </div>
            {/* <div className="addCashLimit" style={{ display: 'flex', padding: '10px', justifyContent: 'space-between' }}>
                <strong>
                    <p style={{ margin: '5px 0 5px 0', fontWeight: '600' }}>Add Funds</p>
                </strong>
                <p style={{ margin: '5px 0 5px 0' }}>{`$${state.addCashLimit.toString()[0]},${state.addCashLimit.toString().split('').slice(1).join('')} per Week`}</p>
            </div> */}
            {/* <div className="cashOutLimit" style={{ display: 'flex', padding: '10px', justifyContent: 'space-between' }}>
                <strong>
                    <p style={{ margin: '5px 0 5px 0', fontWeight: '600' }}>Pay Out</p>
                </strong>
                <p style={{ margin: '5px 0 5px 0' }}>{`$${state.cashOutLimit.toString()[0] + state.cashOutLimit.toString()[1]},${state.cashOutLimit.toString().split('').slice(2).join('')} per Week`}</p>
            </div> */}
        </div >
    )
}