import { useStateContext } from '../Provider/contextProvider'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { v4 } from 'uuid'

export default function Contacts() {
    const { context, setContext } = useStateContext()
    const [data, setData] = useState({
        contacts: []
    })
    useEffect(() => {
        axios.get(`http://localhost:8080/user/contact/${context.session}`)
            .then(res => {
                console.log('contacts res', res)
                setData(prev => ({
                    ...prev,
                    contacts: res.data.contacts,
                    fetching: false,
                }))
                setContext(prev => ({
                    ...prev,
                    fetching: false
                }))

            })
            .catch(err => console.error('fetch contacts error', err))
    }, [])
    const handleViewContact = (id) => {
        setContext(prev => ({
            ...prev,
            contactProfile: id,
            viewProfile: true,
            contactPage: false,
            recent: false,
            settings: false,
            search: false,
            wasOnContacts: true,
        }))

    }
    const findFriends = () => {
        setContext(prev => ({
            ...prev,
            searchBar: true,
            recent: false,
            userProfile: false,
            userModal: false,
            results: [],
            privacy: false,
            support: false,
            alerts: false,
            settings: false,
            linked: false,
            contactPage: false,
            wallet: false,
        }))
    }

    return (
        <>
            <h2 className='header' style={{ margin: '0', border: 'none', fontSize: '5vw', color: 'royalblue', fontWeight: '350' }}>Contacts <i style={{ color: 'royalblue' }} className='fas fa-users'></i></h2>
            <div className="friends" style={{ display: data.contacts.length ? 'grid' : 'flex', flexDirection: 'column' }}>

                {context.fetching ? <div className='loader'></div> : data.contacts.length ? data.contacts.map((item) => <div className='contactResult' style={{ padding: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} key={v4()} id={item._id} onClick={(id) => handleViewContact(item._id)}>
                    {
                        <div className="icon" style={{ backgroundColor: 'royalblue', borderRadius: '50%', border: 'inset 5px black  ', padding: '10px', minWidth: '30px', maxWidth: '35px', minHeight: '30px', maxHeight: '35px' }}>
                            <i className={`fa-sharp fa-${item.username[1]}`} style={{ color: "white", fontSize: '30px', }}></i>

                        </div>}
                    <h5 style={{ margin: '0', fontSize: '16px', color: 'royalblue' }}>{item.username}</h5>
                </div>
                ) : <>
                        <p style={{ fontSize: '20px', margin: '10px 0 10px 0' }}>Get Connected Below <i style={{ color: 'royalblue' }} className='fas'>&#xf063;</i></p><button onClick={() => findFriends()} style={{ backgroundColor: 'royalblue', color: 'white', padding: '10px', borderRadius: '10px', border: 'none', fontSize: '18px', width: '75%', alignSelf: 'center', margin: '1rem' }}>Find Your Friends</button></>
                }

            </div>
        </>
    )
}