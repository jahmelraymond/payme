import { useState, useEffect } from 'react'
import axios from 'axios'
import Search from '../Logo/searchIcon.png'
import { useStateContext } from '../Provider/contextProvider'
export default function Support() {
    const { context, setContext } = useStateContext()
    useEffect(() => {
        axios.get('http://localhost:8080/supportFetch', { withCredentials: true })
            .then(results => {
                setContext(prev => ({
                    ...prev,
                    email: results.data.email,
                    bio: results.data.bio,
                    phone: results.data.phonenumber,
                    address: results.data.address,
                    fetching: false
                }))
            })
            .catch(err => console.log('get supportFetch err line 10', err))
    }, [])
    const [state, setState] = useState({
        question: false
    })
    const toggleLine = () => {
        setState(prev => ({
            ...prev,
            question: true,
        }))
    }
    const unToggleLine = () => {
        setState(prev => ({
            ...prev,
            question: false,
        }))
    }
    return (
        <div className="supportHome" style={{ padding: '0 15px 0 15px' }}>
            <h3 style={{ color: state.question ? 'royalblue' : 'black' }}>How can we help?</h3>
            <div className="inputContainer" style={{ flexDirection: 'column' }}>
                <input type="text" className='help' style={{ backgroundImage: `url(${Search})` }} placeholder={`Example: "pin reset"`} onFocus={() => toggleLine()} onBlur={() => unToggleLine()} />
                <div className="underline" style={{ width: state.question ? '100%' : '0' }}></div>
            </div>
            <p style={{ textAlign: 'left', fontWeight: '500', fontSize: '16px', color: 'royalblue' }}>BROWSE CATEGORIES</p>
            <div className="categories">
                <div className="completeProfile" style={{ display: !context.email || !context.phone || !context.bio || context.address ? 'flex' : 'none', padding: '10px', justifyContent: 'space-between' }}>
                    <p style={{ color: 'royalblue', fontWeight: '600', fontSize: '20px', margin: '0' }}><i className='fas fa-info-circle' style={{ fontSize: '20px', color: 'royalblue', padding: '0 5px 0 0' }}></i>Complete Your Profile</p>
                    <button style={{ border: 'none', color: 'royalblue', backgroundColor: 'transparent' }}><i className='	fas fa-arrow-right'></i></button>
                </div>
                <div className="deposit" style={{ display: 'flex', padding: '10px', justifyContent: 'space-between' }}>
                    <p style={{ color: 'royalblue', fontWeight: '600', fontSize: '20px', margin: '0' }}>Paper Money Deposit</p>
                    <button style={{ border: 'none', color: 'royalblue', backgroundColor: 'transparent' }}><i className='	fas fa-arrow-right'></i></button>
                </div>
                <div className="accessOldAccount" style={{ display: 'flex', padding: '10px', justifyContent: 'space-between' }}>
                    <p style={{ color: 'royalblue', fontWeight: '600', fontSize: '20px', margin: '0' }}>Access Old Account</p>
                    <button style={{ border: 'none', color: 'royalblue', backgroundColor: 'transparent' }}><i className='	fas fa-arrow-right'></i></button>
                </div>
                <div className="paymentIssue" style={{ display: 'flex', padding: '10px', justifyContent: 'space-between' }}>
                    <p style={{ color: 'royalblue', fontWeight: '600', fontSize: '20px', margin: '0' }}>Report A Payment Issue</p>
                    <button style={{ border: 'none', color: 'royalblue', backgroundColor: 'transparent' }}><i className='	fas fa-arrow-right'></i></button>
                </div>
                <div className="other" style={{ display: 'flex', padding: '10px', justifyContent: 'space-between' }}>
                    <p style={{ color: 'royalblue', fontWeight: '600', fontSize: '20px', margin: '0' }}>Something Else</p>
                    <button style={{ border: 'none', color: 'royalblue', backgroundColor: 'transparent' }}><i className='	fas fa-arrow-right'></i></button>
                </div>
            </div>
            <div className="contactUs" style={{ margin: '0.5rem 0 0 0' }}>
                <p style={{ textAlign: 'left', fontWeight: '500', fontSize: '16px', color: 'royalblue' }}>CONTACT US</p>
                <div className="chat">
                    <p style={{ color: 'royalblue', fontWeight: '600', fontSize: '20px', margin: '0' }}><i className='fas fa-comment-dots'></i> Chat</p>

                </div>
            </div>
        </div>
    )
}