import { useRef, useEffect, useState } from 'react'

import Logo from '../Logo/PayMeLogo.png'
import { useStateContext } from '../Provider/contextProvider'
import axios from 'axios'

export default function TopNav() {

    const inputRef = useRef({})
    const [focus, setFocus] = useState(false)

    const { context, setContext } = useStateContext()


    useEffect(() => {

        setTimeout(() => {
            inputRef.current.focus()
        }, 200);

    }, [focus])



    const handleLine = () => {
        setContext(prev => ({
            ...prev,
            underline: false
        }))
    }
    const handleSearch = (e) => {

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
            transaction: false,
            requesting: false,
            sending: false,
            contactPage: false,
            contactProfile: '',
            fetching: false,
            personal: false,
            limits: false,
            addCash: false,
            cashOut: false,
            // input: '',
            recipient: null,
            userNotFound: false,
            addBank: false,
            wasOnContacts: false,
            wasOnRecent: false
        }))
        setFocus(prev => !prev)
        const search = Array.from(document.all).filter((item) => item.id === 'search')[0]
        search.value = ''
    }


    const handleUserprofile = (e) => {
        setContext(prev => ({
            ...prev,
            userProfile: !prev.userProfile,
            // search: false,
            // recent: false,
        }))
    }
    const hideSearch = () => {
        setContext(prev => ({
            ...prev,
            searchBar: false
        }))
    }
    const findContact = (e) => {

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
                    // setContext(prev => ({
                    //     ...prev,
                    //     userNotFound: false,
                    // }))
                    // setTimeout(() => {
                    //     setContext(prev => ({
                    //         ...prev,
                    //         userNotFound: true,
                    //     }))
                    // }, 2000);
                } else {
                    setContext(prev => ({
                        ...prev,
                        results: res.data,
                        userFound: true,
                        fetching: false,
                        userNotFound: false,
                        searchBar: false
                    }))
                }
            })
            .catch(err => console.error('findContact err', err))

    }
    return (
        <>
            <div className="topNav" onClick={() => handleLine()} style={{ maxHeight: '60px' }}>
                <input
                    ref={inputRef}
                    type="text"
                    id='search'
                    placeholder='Email, Phone, Username'
                    style={{ width: context.searchBar ? '90%' : '0', visibility: context.searchBar ? 'visible' : 'hidden' }}
                    onBlur={() => hideSearch()}
                    onChange={(e) => findContact(e)}
                />


                <div className="searchNav" onClick={() => handleSearch()}><button>
                    <i
                        style={{ color: 'white' }}
                        className='fas fa-search'
                    >

                    </i>
                </button>
                </div>
                <div className="logo">
                    <div className="shine"></div>
                    <h3><img src={Logo} className='appLogo' alt="app Logo" /></h3>
                </div>
                <div className="userProfile" onClick={() => handleUserprofile()}><button><i style={{ color: 'white' }} className='far fa-user-circle'></i></button></div>


            </div>

        </>
    )
}