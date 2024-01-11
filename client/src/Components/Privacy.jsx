import axios from 'axios'
import { useState, useEffect } from 'react'
import { useStateContext } from '../Provider/contextProvider'

export default function Privacy() {
    const { context, setContext } = useStateContext()
    const [state, setState] = useState({
        securityLock: false,
        findMe: false,
        getRequest: false,
        enterPin: false,
        securityPin: '',
        pinLine: false,
        repeatPinLine: false,
        match: false,
        pin: '',
        repeated: '',
    })
    useEffect(() => {
        axios.get('http://localhost:8080/securitySettings', { withCredentials: true })
            .then(settings => {
                setState(prev => ({
                    ...prev,
                    securityLock: settings.data.securityLock,
                    findMe: settings.data.findMe,
                    getRequest: settings.data.getRequests,
                }))
                setContext(prev => ({
                    ...prev,
                    fetching: false
                }))
            })
            .catch(err => console.log('get privacy settings err', err))
    }, [])
    const enableSecurityLock = (e) => {
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/enableSecurityLock',
            withCredentials: true,
            data: { securityLock: true }
        })
            .then(res => {
                axios({
                    method: 'GET',
                    url: 'http://localhost:8080/getPin',
                    withCredentials: true
                }).then(user => {
                    if (user.data.securityPin)
                        setState(prev => ({
                            ...prev,
                            securityLock: res.data.securityLock,
                        }))
                    else setState(prev => ({
                        ...prev,
                        securityLock: res.data.securityLock,
                        enterPin: true
                    }))
                })
                    .catch(err => console.log('getPin err', err))
                // console.log('securityLock res', res.data)

            })
            .catch(err => console.log('handleSecurityLock err', err))
    }
    const disableSecurityLock = (e) => {
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/disableSecurityLock',
            withCredentials: true,
            data: { securityLock: false }
        })
            .then(res => {
                setState(prev => ({
                    ...prev,
                    securityLock: res.data.securityLock
                }))
            })
            .catch(err => console.log('handleSecurityLock err', err))
    }
    const handleSecurityLock = (e) => {
        if (e.target.checked)
            enableSecurityLock(e)
        else disableSecurityLock(e)
    }
    const handleEnableSearch = (e) => {
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/enableFindMe',
            withCredentials: true,
            data: { findMe: true }
        })
            .then(res => {
                setState(prev => ({
                    ...prev,
                    findMe: res.data.findMe
                }))
            })
            .catch(err => console.log('handleEnableSearch err', err))
        console.log('enabled firing')
    }
    const handleDisableSearch = (e) => {
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/disableFindMe',
            withCredentials: true,
            data: { findMe: false }
        })
            .then(res => {
                setState(prev => ({
                    ...prev,
                    findMe: res.data.findMe
                }))
            })
            .catch(err => console.log('handleSecurityLock err', err))
        console.log('disabled firing')
    }
    const handleAllowSearch = (e) => {
        if (e.target.checked)
            handleEnableSearch(e)
        else handleDisableSearch(e)
    }
    const enableRequest = (e) => {
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/enableGetRequest',
            withCredentials: true,
            data: { getRequests: true }
        })
            .then(res => {
                setState(prev => ({
                    ...prev,
                    getRequest: res.data.getRequests
                }))
            })
            .catch(err => console.log('handleSecurityLock err', err))
    }
    const disableRequest = (e) => {
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/disableGetRequest',
            withCredentials: true,
            data: { getRequests: false }
        })
            .then(res => {
                setState(prev => ({
                    ...prev,
                    getRequest: res.data.getRequests
                }))
            })
            .catch(err => console.log('handleSecurityLock err', err))
    }
    const handleRequest = (e) => {
        if (e.target.checked)
            enableRequest(e)
        else disableRequest(e)
    }
    const handlePin = (e) => {
        setState(prev => ({
            ...prev,
            pin: e.target.value
        }))
    }
    const confirmPin = (e) => {
        setState(prev => ({
            ...prev,
            repeated: e.target.value
        }))

    }
    const toggleLine = (e) => {
        if (e.target.name === 'pin')
            setState(prev => ({
                ...prev,
                pinLine: true
            }))
        if (e.target.name === 'repeat')
            setState(prev => ({
                ...prev,
                repeatPinLine: true
            }))
    }
    const unToggleLine = (e) => {
        if (e.target.name === 'pin')
            setState(prev => ({
                ...prev,
                pinLine: false
            }))
        if (e.target.name === 'repeat')
            setState(prev => ({
                ...prev,
                repeatPinLine: false
            }))
    }
    const handleSubmitPin = (e) => {
        if (state.pin === state.repeated)
            axios({ method: 'PUT', url: 'http://localhost:8080/updatePin', withCredentials: true, data: { securityPin: parseInt(state.pin) } })
                .then(pin => {
                    setState(prev => ({ ...prev, enterPin: false }))
                })
                .catch(err => console.log('handleSubmitPin err', err))
    }
    const handleChangePin = () => {
        setState(prev => ({
            ...prev,
            enterPin: true
        }))
    }
    const handleCancelPin = () => {
        setState(prev => ({
            ...prev,
            enterPin: false,
            securityLock: false,
        }))
    }
    return (
        <div className="privacyComp" style={{ overflowX: 'hidden' }}>

            {console.log('state', state)}
            {state.enterPin ?
                <div className="addPin" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h3>Please Enter A Security Pin</h3>
                    <div className="signInContainers" >
                        <label htmlFor="Pin" style={{ color: state.pinLine ? 'royalblue' : 'black', alignSelf: 'flex-start', padding: '0 0 0 5px' }}>Pin</label>
                        <input type="password" onChange={(e) => handlePin(e)} name='pin' onFocus={(e) => toggleLine(e)} onBlur={(e) => unToggleLine(e)} style={{ padding: '15px 0 15px 10px', borderRadius: '10px', textAlign: 'left', width: '100%' }} maxLength='4' placeholder='Pin' />
                        <div className="underline" style={{ width: state.pinLine ? '100%' : '0' }}></div>
                    </div>
                    <div className="signInContainers">
                        <label htmlFor="repeat" style={{ color: state.repeatPinLine ? 'royalblue' : 'black', alignSelf: 'flex-start', padding: '0 0 0 5px' }}>Repeat Pin</label>
                        <input type="password" onChange={(e) => confirmPin(e)} name='repeat' onFocus={(e) => toggleLine(e)} onBlur={(e) => unToggleLine(e)} style={{ padding: '15px 0 15px 10px', borderRadius: '10px', width: '100%', textAlign: 'left' }} maxLength="4" placeholder='Repeat Pin' />
                        <div className="underline" style={{ width: state.repeatPinLine ? '100%' : '0' }}></div>
                    </div>
                    <div className="container" style={{ display: 'flex', width: '100%' }}>
                        <button onClick={(e) => handleCancelPin(e)} style={{ margin: '10px 0 0 0 ', padding: '10px', backgroundColor: 'royalblue', color: 'white', fontSize: '20px', border: 'none', borderRadius: '10px', flex: '1' }}>Cancel</button>
                        <button onClick={(e) => handleSubmitPin(e)} style={{ margin: '10px 0 0 0 ', padding: '10px', backgroundColor: 'royalblue', color: 'white', fontSize: '20px', border: 'none', borderRadius: '10px', flex: '1' }}>Submit</button>

                    </div>
                </div> : context.fetching ? <div className='loader'></div> : <>
                    <div className="header" style={{ width: '100%', padding: '0', border: 'none' }}>
                        <h2 style={{ margin: '0', color: 'royalblue', fontWeight: '350', padding: '0 0 8px 0', border: 'none', fontSize: '5vw' }}>Privacy & Security</h2>
                    </div>
                    <div className="securityheader">
                        <h2 style={{ margin: '2px 0 2px 0', textAlign: 'left', opacity: '0.75', color: 'royalblue', padding: '0 0 0 6px', fontWeight: '600', fontSize: '18px' }}>SECURITY</h2>
                    </div>
                    <div className="security">
                        <div className="securitydesc">
                            <div className="description">
                                <h4>Security Lock</h4>
                                <p>Require biometrics or Pay PIN to transfer funds</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" onChange={(e) => handleSecurityLock(e)} checked={state.securityLock} />
                                <span class="slider round"></span>
                            </label>

                        </div>
                        <button style={{ border: 'none', borderRadius: '10px', backgroundColor: 'transparent', color: 'royalblue', padding: '5px', fontSize: '24px', fontWeight: '600', fontFamily: 'sans-serif', display: state.securityLock ? 'block' : 'none', margin: '0 auto 0 auto' }} onClick={() => handleChangePin()} >Change Pay PIN</button>
                    </div>
                    <div className="paytag" style={{ padding: '10px 0 0 0' }}>
                        <div className="paytagHeader">
                            <h2 style={{ margin: '2px 0 2px 0', textAlign: 'left', opacity: '0.75', color: 'royalblue', padding: '0 0 0 6px', fontWeight: '600', fontSize: '18px' }}>PAYME</h2>
                        </div>
                        <div className="paytagdesc">
                            <div className="description">
                                <h4>Pay.me</h4>
                                <p>Allow others to find me by phone, username & email</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" onChange={(e) => handleAllowSearch(e)} checked={state.findMe} />
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="moneyreq" style={{ padding: '15px 0 0 0' }} >
                        <div className="moneyreqheader">
                            <h2 style={{ margin: '2px 0 2px 0', textAlign: 'left', opacity: '0.75', color: 'royalblue', padding: '0 0 0 6px', fontWeight: '600', fontSize: '18px' }}>REQUEST</h2>
                        </div>
                        <div className="moneyreqdesc">
                            <div className="description">
                                <h4>Incoming Requests</h4>
                                <p>Allow money request from other users</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" onChange={(e) => handleRequest(e)} checked={state.getRequest} />
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                </>}
        </div >

    )
}