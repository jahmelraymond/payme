import { useStateContext } from '../Provider/contextProvider'
import axios from 'axios'
import Line from './Line'
import { v4 } from 'uuid'
import { useEffect } from 'react'

export default function Search() {
    const { context, setContext, icon } = useStateContext()
    useEffect(() => {
        axios.get('http://localhost:8080/search', { withCredentials: true })
            .then(results => {
                // console.log('results', results.data)
                setContext(prev => ({
                    ...prev,
                    contacts: results.data.contacts,
                    fetching: false,
                }))
            })
            .catch(err => console.log('search fetch err', err))
    }, [context.loading])
    const findContact = (e) => {
        // setContext(prev => ({
        //     ...prev,
        //     fetching: true
        // }))
        let searchKey = e.target.value
        if (searchKey === '@' || !searchKey) {
            setContext(prev => ({
                ...prev,
                results: [],
                fetching: false,
            }))
        }
        axios({
            method: 'GET',
            url: `http://localhost:8080/find/${searchKey}`
        })
            .then(res => {
                console.log('search res ', res.data)
                if (res.data.error) {
                    setContext(prev => ({
                        ...prev,
                        added: false,
                        fetching: true,
                    }))
                } else {
                    setContext(prev => ({
                        ...prev,
                        results: res.data,
                        userFound: true,
                        added: false,
                        fetching: false,
                        userNotFound: false
                    }))
                }
            })
            .catch(err => console.error('findContact err', err))

    }
    const addContact = (e) => {
        setContext(prev => ({
            ...prev,
            loading: true
        }))

        axios.put(`http://localhost:8080/add/${context.payTag}`, { user: context.results[0]._id, id: context.session }, { withCredentials: true })
            .then(res =>
                setContext(prev => ({
                    ...prev,
                    confirmAdd: false,
                    loading: false,
                    added: true,
                    contacts: res.data.contacts
                })))
            .catch(err => console.error('addContact error', err))

    }
    const handleViewProfile = (id) => {
        setContext(prev => ({
            ...prev,
            userModal: true,
        }))

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
    const handleViewContact = (id) => {
        if (context.search) {
            setContext(prev => ({
                ...prev,
                contactProfile: id,
                viewProfile: true,
                contactPage: false,
                recent: false,
                settings: false,
                search: false,
                searched: true,
            }))
        }
        else {
            setContext(prev => ({
                ...prev,
                contactProfile: id,
                viewProfile: true,
                contactPage: false,
                recent: false,
                settings: false,
                search: false,
                searched: false,

            }))
        }
    }
    const toggleLine = (e) => {
        if (e.target.value) {
            e.target.value = ''
            setContext(prev => ({
                ...prev,
                underline: true,
                userNotFound: false,
                fetching: true
            }))
        } else {
            setContext(prev => ({
                ...prev,
                underline: true,
                userNotFound: false,
                fetching: true
            }))

        }
    }
    const untoggleLine = () => {
        setContext(prev => ({
            ...prev,
            underline: false,
            fetching: false,
        }))
    }
    const searching = () => {
        // if (!context.results)
        //     setContext(prev => ({
        //         ...prev,
        //         fetching: true,
        //     }))
    }

    return (
        <div className="search" style={{ maxWidth: '99%' }}>
            <h3 style={{ color: context.underline ? 'royalblue' : 'black', margin: '10px 0 10px 0' }}>Find Your Friends</h3>
            <div className="inputContainers" style={{ width: '99%' }}>
                <input type="text" placeholder='Name , Email , Phone' id='findContact' onChange={(e) => findContact(e)} onFocus={(e) => toggleLine(e)} onBlur={() => untoggleLine()} style={{ borderRadius: '5px ', width: "99%" }} onKeyUp={() => searching()} />
                <Line />

            </div>
            <div className="find">

                <div className="confirmAdd" style={{ display: context.confirmAdd ? 'flex' : 'none' }}>
                    {context.results.length ?
                        <p >{`${context.results[0].username} will be added to your contacts are you sure?`}</p> : <p>This user will be added to your contacts are you sure? </p>
                    }

                    <div className="confirmButtons">
                        <button onClick={() => addContact()} style={{ borderRadius: '0 0  0 15px' }}>Yes</button>
                        <button onClick={() => handleCancelAdd()} style={{ borderRadius: '0 0 15px 0', borderLeft: 'solid 0.5px royalblue' }}>No</button>
                    </div>
                </div>
                <p style={{ fontSize: '20px', display: context.userNotFound ? 'block' : 'none' }}>User not found please try a different username, phone, or email</p>
                {context.fetching ? <div className='loader'></div> : context.results.length ? context.results.map((item) => context.contacts.includes(item._id) ? (<div className='searchResult' key={v4()}>
                    <div className="searchUserIcon" onClick={(id) => handleViewContact(item._id)}>
                        {
                            <i className={`fas-sharp fa-${item.username[1]}`} style={icon}></i>
                        }
                    </div>
                    <div className="searchUserInfo">
                        <h5 style={{ margin: '5px 0 5px 0' }}>{item.username}</h5>
                    </div>
                    <div className="searchViewProfile">
                        <button onClick={(id) => handleViewContact(item._id)} style={{ borderRadius: '15px 0 0 15px', }}>View Profile</button>


                    </div>
                </div>) : <div className='searchResult' key={v4()}>
                        <div className="searchUserIcon" onClick={() => handleViewProfile()}>
                            {item.profilePic ? <img src={item.profilePic} alt="" style={{ height: '3.5rem', width: '3.5rem', borderRadius: '50%', margin: 'auto', border: 'inset black 5px' }} /> :
                                <i className={`fas-sharp fa-${item.username[1]}`} style={icon}></i>
                            }
                        </div>
                        <div className="searchUserInfo">
                            <h5 style={{ margin: '5px 0 5px 0' }}>{item.username}</h5>
                        </div>
                        <div className="searchAddView">
                            <button onClick={(id) => handleViewContact(item._id)} style={{ borderRadius: '15px 0 0 15px', }}>View Profile</button>


                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}