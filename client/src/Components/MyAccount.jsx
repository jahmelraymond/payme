import { useStateContext } from '../Provider/contextProvider'
import { useEffect, useState } from 'react'
import axios from 'axios'
export default function MyAccount() {
    const { context, setContext } = useStateContext()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get('http://localhost:8080/getbankinfo', { withCredentials: true })
            .then(bank => {
                console.log('fetch successful', bank.data)
                setContext(prev => ({
                    ...prev,
                    banks: [bank.data.accounts[0]],
                    bio: bank.data.bio,
                }))
            })
            .finally(() => setLoading(false)
            )
            .catch(err => console.log('getbankinfo err', err))
    }, [])

    return (
        <>
            <h1 style={{ color: 'royalblue', fontWeight: '350', margin: '10px 0 10px 0' }}>My Account</h1>
            <div className="userInfo" style={{ display: 'flex', flexDirection: 'column', padding: '0 5px 0 5px' }} >
                {!loading ?
                    <>
                        <div className="bankName" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{ color: 'royalblue', fontSize: '20px' }}>Bank</p>
                            <p>{context.banks[0].bankName}</p>
                        </div>
                        <div className="routing" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{ color: 'royalblue', fontSize: '20px' }}>Routing #</p>
                            <p>{context.banks[0].routingNumber}</p>
                        </div>
                        <div className="currency" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{ color: 'royalblue', fontSize: '20px' }}>Currency</p>
                            <select name="currency" id="currency" style={{ fontSize: '16px' }}>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                    </>
                    : <div className="loader"></div>
                }
            </div>
        </>
    )
}